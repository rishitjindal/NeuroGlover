
// WORKAROUND: The build environment is missing Web Bluetooth API type definitions.
// The following global declarations use `any` to resolve TypeScript compilation
// errors without requiring changes to the project's dependencies.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type BluetoothRemoteGATTCharacteristic = any;
  interface Navigator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bluetooth: any;
  }
}

import React, { useState, useCallback, useRef } from 'react';
import { BluetoothConnectionStatus } from '../types';
import { BluetoothIcon } from './icons';
import { useTranslations } from '../App';

interface BluetoothManagerProps {
  onNewData: (value: number) => void;
  onStatusChange: (status: BluetoothConnectionStatus) => void;
  status: BluetoothConnectionStatus;
  latestValue: number | null;
}

interface DiscoveredService {
    uuid: string;
    characteristics: {
        uuid: string;
        properties: {
            notify: boolean;
            read: boolean;
            write: boolean;
        };
    }[];
}


// Default UUIDs for the Heart Rate service, used if nothing is in localStorage
const DEFAULT_SERVICE_UUID = 'heart_rate';
const DEFAULT_CHARACTERISTIC_UUID = 'heart_rate_measurement';


const BluetoothManager: React.FC<BluetoothManagerProps> = ({ onNewData, onStatusChange, status, latestValue }) => {
  const [error, setError] = useState<string | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const deviceRef = useRef<any | null>(null);
  const { t } = useTranslations();
  
  const [discoveredServices, setDiscoveredServices] = useState<DiscoveredService[] | null>(null);

  // State for UUID management
  const [serviceUuid, setServiceUuid] = useState(() => localStorage.getItem('bt-service-uuid') || DEFAULT_SERVICE_UUID);
  const [characteristicUuid, setCharacteristicUuid] = useState(() => localStorage.getItem('bt-characteristic-uuid') || DEFAULT_CHARACTERISTIC_UUID);

  const handleNotifications = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (!value) return;

    try {
        // Attempt to parse known heart rate format first
        const flags = value.getUint8(0);
        const is16Bit = flags & 0x1;
        let heartRate: number;
        if (is16Bit) {
            heartRate = value.getUint16(1, true); // Little Endian
        } else {
            heartRate = value.getUint8(1);
        }
        onNewData(heartRate);
    } catch (parseError) {
        // Fallback for other sensors: read the first byte
        try {
            console.log("Failed to parse as heart rate, using fallback parser.");
            const fallbackValue = value.getUint8(0);
            onNewData(fallbackValue);
        } catch (fallbackError) {
            console.error("Error parsing sensor data with any method:", parseError, fallbackError);
            setError("Failed to parse sensor data. Check device compatibility.");
            disconnectDevice();
        }
    }
  }, [onNewData]);

  const disconnectDevice = useCallback(async () => {
    const cleanup = () => {
        onStatusChange(BluetoothConnectionStatus.DISCONNECTED);
        characteristicRef.current = null;
        deviceRef.current = null;
        setDiscoveredServices(null);
    }

    if (deviceRef.current && deviceRef.current.gatt?.connected) {
        try {
            if (characteristicRef.current) {
                await characteristicRef.current.stopNotifications();
                characteristicRef.current.removeEventListener('characteristicvaluechanged', handleNotifications);
            }
            deviceRef.current.gatt.disconnect();
        } catch (err: any) {
            console.error("Error disconnecting:", err);
            setError(err.message);
        } finally {
            cleanup();
        }
    } else {
        cleanup();
    }
  }, [onStatusChange, handleNotifications]);

  const handleCharacteristicSelection = async (selectedServiceUuid: string, selectedCharacteristicUuid: string) => {
    setError(null);
    try {
        if (!deviceRef.current || !deviceRef.current.gatt?.connected) {
            throw new Error("Device is not connected.");
        }

        const server = deviceRef.current.gatt;
        const service = await server.getPrimaryService(selectedServiceUuid);
        const characteristic = await service.getCharacteristic(selectedCharacteristicUuid);

        characteristicRef.current = characteristic;
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleNotifications);

        // Save selection for future sessions
        setServiceUuid(selectedServiceUuid);
        setCharacteristicUuid(selectedCharacteristicUuid);
        localStorage.setItem('bt-service-uuid', selectedServiceUuid);
        localStorage.setItem('bt-characteristic-uuid', selectedCharacteristicUuid);
        
        setDiscoveredServices(null); // Hide selection UI
        onStatusChange(BluetoothConnectionStatus.CONNECTED);

    } catch (err: any) {
        console.error("Error selecting characteristic:", err);
        let userFriendlyError = `Error setting up notifications: ${err.message}`;
        if (err.name === 'NotFoundError') {
            userFriendlyError = "Could not find the selected service/characteristic on the device. It may have disconnected or does not support this configuration.";
        } else if (err.name === 'NetworkError' || err.message.toLowerCase().includes('gatt server is disconnected')) {
            userFriendlyError = "Device connection lost during setup. Please try reconnecting.";
        } else if (err.name === 'SecurityError') {
            userFriendlyError = "A security error occurred. This characteristic might require a more secure connection or pairing.";
        }
        setError(userFriendlyError);
        onStatusChange(BluetoothConnectionStatus.ERROR);
        disconnectDevice();
    }
  };

  const connectToDevice = useCallback(async () => {
    setError(null);
    onStatusChange(BluetoothConnectionStatus.CONNECTING);
    try {
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not available in this browser.');
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      deviceRef.current = device;

      const handleDisconnect = () => {
        onStatusChange(BluetoothConnectionStatus.DISCONNECTED);
        characteristicRef.current = null;
        deviceRef.current = null;
        setDiscoveredServices(null);
        device.removeEventListener('gattserverdisconnected', handleDisconnect);
      };
      device.addEventListener('gattserverdisconnected', handleDisconnect);

      const server = await device.gatt?.connect();
      const services = await server?.getPrimaryServices();
      
      const discovered: DiscoveredService[] = [];
      for (const service of services) {
          const characteristics = await service.getCharacteristics();
          discovered.push({
              uuid: service.uuid,
              characteristics: characteristics.map(c => ({
                  uuid: c.uuid,
                  properties: {
                      notify: c.properties.notify,
                      read: c.properties.read,
                      write: c.properties.write,
                  }
              })),
          });
      }
      setDiscoveredServices(discovered);
      onStatusChange(BluetoothConnectionStatus.CONNECTED_AWAITING_SELECTION);

    } catch (err: any) {
      console.error("Bluetooth connection error:", err);

      // User cancelled the device picker. This is not a critical error.
      if (err.name === 'NotFoundError') {
        onStatusChange(BluetoothConnectionStatus.DISCONNECTED);
        return; // Silently return to previous state
      }
      
      let userFriendlyError = `An unexpected error occurred: ${err.message}.`;
      if (err.name === 'NotAllowedError') {
          userFriendlyError = "Bluetooth permissions denied. Please allow access in your browser settings and try again.";
      } else if (err.message.includes('Web Bluetooth API is not available') || err.name === 'NotSupportedError') {
          userFriendlyError = "Web Bluetooth is not available on this device/browser. Please try again on a compatible platform (like Chrome on Desktop/Android).";
      } else if (err.message.toLowerCase().includes('adapter not available')) {
          userFriendlyError = "Bluetooth adapter not available. Please make sure Bluetooth is turned on on your device.";
      } else if (err.message.toLowerCase().includes('gatt server is disconnected')) {
          userFriendlyError = "Connection failed. The device may be out of range or has disconnected.";
      }
      
      setError(userFriendlyError);
      onStatusChange(BluetoothConnectionStatus.ERROR);
    }
  }, [onStatusChange]);
  
    const getStatusText = useCallback((status: BluetoothConnectionStatus) => {
        switch (status) {
            case BluetoothConnectionStatus.CONNECTED:
                return t('connected');
            case BluetoothConnectionStatus.CONNECTING:
                return t('connectingStatus');
            case BluetoothConnectionStatus.CONNECTED_AWAITING_SELECTION:
                return t('selectCharacteristic');
            case BluetoothConnectionStatus.ERROR:
                return t('error');
            case BluetoothConnectionStatus.DISCONNECTED:
            default:
                return t('disconnected');
        }
    }, [t]);

  const getStatusColor = () => {
    switch (status) {
      case BluetoothConnectionStatus.CONNECTED:
        return 'text-green-400';
      case BluetoothConnectionStatus.CONNECTING:
      case BluetoothConnectionStatus.CONNECTED_AWAITING_SELECTION:
        return 'text-yellow-400';
      case BluetoothConnectionStatus.ERROR:
        return 'text-red-400';
      default:
        return 'text-text-secondary';
    }
  };
  
  const renderContent = () => {
    if (status === BluetoothConnectionStatus.CONNECTED_AWAITING_SELECTION && discoveredServices) {
        return (
            <div className="flex-grow space-y-4 overflow-y-auto">
                <h3 className="text-lg font-semibold text-text-primary">{t('selectCharacteristicTitle')}</h3>
                <p className="text-sm text-text-secondary">{t('selectCharacteristicDesc')}</p>
                <div className="space-y-3 max-h-64 overflow-auto pr-2">
                    {discoveredServices.length === 0 && <p>No services found on this device.</p>}
                    {discoveredServices.map(service => (
                        <div key={service.uuid} className="bg-primary p-3 rounded-lg">
                            <p className="text-xs text-text-secondary font-mono break-all">SERVICE: {service.uuid}</p>
                            <div className="mt-2 space-y-1">
                                {service.characteristics.map(char => (
                                    <button
                                        key={char.uuid}
                                        onClick={() => handleCharacteristicSelection(service.uuid, char.uuid)}
                                        disabled={!char.properties.notify}
                                        className="w-full text-left p-2 rounded-md bg-secondary hover:bg-highlight disabled:bg-highlight/50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <p className="text-sm font-mono break-all text-text-primary">{char.uuid}</p>
                                        <p className="text-xs text-text-secondary">
                                            Properties: {char.properties.read ? 'R ' : ''}{char.properties.write ? 'W ' : ''}{char.properties.notify ? 'NOTIFY' : ''}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex-grow space-y-4">
            <div className="bg-primary p-4 rounded-lg">
                <p className="text-sm text-text-secondary mb-1">{t('latestSensorReading')}</p>
                <p className="text-4xl font-bold text-accent">
                    {latestValue !== null ? latestValue : '--'}
                </p>
            </div>
            <div className="bg-primary p-4 rounded-lg space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">{t('lastUsedConfig')}</h3>
                <div className="space-y-3 pt-2">
                     <div>
                        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">{t('serviceUuid')}</label>
                        <p className="text-sm text-text-primary font-mono truncate pt-1">{serviceUuid}</p>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">{t('characteristicUuid')}</label>
                        <p className="text-sm text-text-primary font-mono truncate pt-1">{characteristicUuid}</p>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-text-primary mb-4">{t('deviceControl')}</h2>
      <div className="flex items-center space-x-3 mb-6">
        <BluetoothIcon className={`w-6 h-6 ${getStatusColor()}`} />
        <span className={`font-medium ${getStatusColor()}`}>{getStatusText(status)}</span>
      </div>
      
      {renderContent()}

      {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

      <div className="mt-6">
        {status === BluetoothConnectionStatus.CONNECTED || status === BluetoothConnectionStatus.CONNECTED_AWAITING_SELECTION ? (
          <button onClick={disconnectDevice} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            {t('disconnect')}
          </button>
        ) : (
          <button onClick={connectToDevice} disabled={status === BluetoothConnectionStatus.CONNECTING} className="w-full bg-accent hover:bg-blue-700 disabled:bg-highlight disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors">
            {status === BluetoothConnectionStatus.CONNECTING ? t('connecting') : t('connectToDevice')}
          </button>
        )}
      </div>
    </div>
  );
};

export default BluetoothManager;
