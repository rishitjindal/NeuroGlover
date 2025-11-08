
import React, { useState, useCallback, useEffect } from 'react';
import type { SensorDataPoint } from '../types';
import { ConnectionStatus } from '../types';
import DeviceManager from './BluetoothManager';
import SensorDataChart from './SensorDataChart';
import HistoricalDataView from './HistoricalDataView';
import { useTranslations } from '../App';
import type { Language } from '../App';


const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, availableLanguages } = useTranslations();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none bg-secondary border border-highlight text-text-primary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full pl-3 pr-8 py-2"
        aria-label="Select language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorDataPoint[]>([]);
  const [historicalData, setHistoricalData] = useState<SensorDataPoint[]>([]);
  const { t } = useTranslations();

  // State lifted from DeviceManager
  const [btStatus, setBtStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
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
  
  const handleStatusChange = useCallback((newStatus: ConnectionStatus) => {
    setBtStatus(newStatus);
    if (newStatus === ConnectionStatus.DISCONNECTED || newStatus === ConnectionStatus.ERROR) {
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
        <header className="mb-8 flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">{t('dashboardTitle')}</h1>
            <p className="text-text-secondary mt-1">{t('dashboardSubtitle')}</p>
          </div>
          <LanguageSwitcher />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Row 1 */}
          <div className="lg:col-span-2 bg-secondary p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">{t('liveSensorFeed')}</h2>
            <div className="h-96">
                <SensorDataChart data={sensorData} />
            </div>
          </div>
          <div className="bg-secondary p-6 rounded-xl shadow-lg">
            <DeviceManager 
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
    </div>
  );
};

export default Dashboard;