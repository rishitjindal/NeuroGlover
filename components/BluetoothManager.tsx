// WORKAROUND: The build environment is missing Web Serial API type definitions.
declare global {
  interface Navigator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serial: any;
  }
}

import React, { useState, useCallback, useRef } from 'react';
import { ConnectionStatus } from '../types';
import { PlugIcon } from './icons';
import { useTranslations } from '../App';

interface DeviceManagerProps {
  onNewData: (value: number) => void;
  onStatusChange: (status: ConnectionStatus) => void;
  status: ConnectionStatus;
  latestValue: number | null;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ onNewData, onStatusChange, status, latestValue }) => {
  const [error, setError] = useState<string | null>(null);
  const portRef = useRef<any | null>(null);
  const readerRef = useRef<any | null>(null);
  const keepReadingRef = useRef(true);
  const { t } = useTranslations();

  const disconnectDevice = useCallback(async () => {
    keepReadingRef.current = false;
    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
      } catch (err) {
        console.warn("Error cancelling reader:", err);
      }
    }

    if (portRef.current) {
      try {
        await portRef.current.close();
      } catch (err) {
        console.error("Error closing port:", err);
      }
    }
    
    portRef.current = null;
    readerRef.current = null;
    onStatusChange(ConnectionStatus.DISCONNECTED);
  }, [onStatusChange]);

  const connectToDevice = useCallback(async () => {
    setError(null);
    if (!navigator.serial) {
      setError("Web Serial API is not available in this browser. Please use Chrome or Edge on desktop.");
      onStatusChange(ConnectionStatus.ERROR);
      return;
    }

    onStatusChange(ConnectionStatus.CONNECTING);
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      onStatusChange(ConnectionStatus.CONNECTED);
      keepReadingRef.current = true;

      const decoder = new TextDecoder();
      let buffer = '';

      while (port.readable && keepReadingRef.current) {
        readerRef.current = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await readerRef.current.read();
            if (done) {
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last partial line in buffer
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    const sensorValue = parseFloat(trimmedLine);
                    if (!isNaN(sensorValue)) {
                        onNewData(sensorValue);
                    }
                }
            }
          }
        } catch (error) {
          console.error("Read error:", error);
          if (keepReadingRef.current) {
            setError("Device disconnected or read error.");
          }
        } finally {
          readerRef.current.releaseLock();
        }
      }
      
      if (keepReadingRef.current) {
         await disconnectDevice();
      }

    } catch (err: any) {
      console.error("Serial connection error:", err);
      if (err.name === 'NotFoundError') {
        setError("Device selection cancelled.");
        onStatusChange(ConnectionStatus.DISCONNECTED);
      } else {
        setError(err.message);
        onStatusChange(ConnectionStatus.ERROR);
      }
    }
  }, [onStatusChange, onNewData, disconnectDevice]);

  const getStatusText = useCallback((status: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return t('connected');
      case ConnectionStatus.CONNECTING:
        return t('connectingStatus');
      case ConnectionStatus.ERROR:
        return t('error');
      case ConnectionStatus.DISCONNECTED:
      default:
        return t('disconnected');
    }
  }, [t]);

  const getStatusColor = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return 'text-green-400';
      case ConnectionStatus.CONNECTING:
        return 'text-yellow-400';
      case ConnectionStatus.ERROR:
        return 'text-red-400';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-text-primary mb-4">{t('deviceControl')}</h2>
      <div className="flex items-center space-x-3 mb-6">
        <PlugIcon className={`w-6 h-6 ${getStatusColor()}`} />
        <span className={`font-medium ${getStatusColor()}`}>{getStatusText(status)}</span>
      </div>
      
      <div className="flex-grow space-y-4">
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-sm text-text-secondary mb-1">{t('latestSensorReading')}</p>
          <p className="text-4xl font-bold text-accent">
            {latestValue !== null ? latestValue.toFixed(2) : '--'}
          </p>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

      <div className="mt-6">
        {status === ConnectionStatus.CONNECTED ? (
          <button onClick={disconnectDevice} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            {t('disconnect')}
          </button>
        ) : (
          <button onClick={connectToDevice} disabled={status === ConnectionStatus.CONNECTING} className="w-full bg-accent hover:bg-blue-700 disabled:bg-highlight disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors">
            {status === ConnectionStatus.CONNECTING ? t('connecting') : t('connectToDevice')}
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceManager;