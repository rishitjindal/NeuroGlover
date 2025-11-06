import React, { useState, useCallback, useEffect } from 'react';
import type { SensorDataPoint } from '../types';
import { BluetoothConnectionStatus } from '../types';
import BluetoothManager from './BluetoothManager';
import SensorDataChart from './SensorDataChart';
import ChatbotWidget from './ChatbotWidget';
import HistoricalDataView from './HistoricalDataView';

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorDataPoint[]>([]);
  const [historicalData, setHistoricalData] = useState<SensorDataPoint[]>([]);

  // State lifted from BluetoothManager
  const [btStatus, setBtStatus] = useState<BluetoothConnectionStatus>(BluetoothConnectionStatus.DISCONNECTED);
  const [latestBtValue, setLatestBtValue] = useState<number | null>(null);

  // Load historical data on component mount
  useEffect(() => {
    try {
        const storedData = localStorage.getItem('sensor-history');
        if (storedData) {
            setHistoricalData(JSON.parse(storedData));
        }
    } catch (error) {
        console.error("Failed to parse historical data from localStorage:", error);
        localStorage.removeItem('sensor-history'); // Clear corrupted data
    }
  }, []);

  const handleNewData = useCallback((value: number) => {
    setLatestBtValue(value);
    const newPoint: SensorDataPoint = {
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      value,
    };

    // Update live data feed (last 50 points)
    setSensorData((prevData) => {
      const newData = [...prevData, newPoint];
      return newData.length > 50 ? newData.slice(newData.length - 50) : newData;
    });
    
    // Update and persist historical data
    setHistoricalData((prevData) => {
        const newHistoricalData = [...prevData, newPoint];
        try {
            localStorage.setItem('sensor-history', JSON.stringify(newHistoricalData));
        } catch (error) {
            console.error("Failed to save data to localStorage. It might be full.", error);
        }
        return newHistoricalData;
    });

  }, []);
  
  const handleStatusChange = useCallback((newStatus: BluetoothConnectionStatus) => {
    setBtStatus(newStatus);
    if (newStatus === BluetoothConnectionStatus.DISCONNECTED || newStatus === BluetoothConnectionStatus.ERROR) {
      setLatestBtValue(null);
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    localStorage.removeItem('sensor-history');
    setHistoricalData([]);
  }, []);

  return (
    <div className="min-h-screen bg-primary p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Sensor Dashboard</h1>
          <p className="text-text-secondary mt-1">Real-time monitoring and AI-powered insights</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Row 1 */}
          <div className="lg:col-span-2 bg-secondary p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Live Sensor Feed</h2>
            <div className="h-96">
                <SensorDataChart data={sensorData} />
            </div>
          </div>
          <div className="bg-secondary p-6 rounded-xl shadow-lg">
            <BluetoothManager 
              onNewData={handleNewData}
              onStatusChange={handleStatusChange}
              status={btStatus}
              latestValue={latestBtValue}
            />
          </div>

          {/* Row 2 - Historical Data */}
          <div className="lg:col-span-3 bg-secondary p-6 rounded-xl shadow-lg">
            <HistoricalDataView data={historicalData} onClear={handleClearHistory} />
          </div>
        </main>
      </div>
      <ChatbotWidget 
        sensorData={sensorData}
        historicalData={historicalData}
        bluetoothStatus={btStatus}
        latestValue={latestBtValue}
      />
    </div>
  );
};

export default Dashboard;