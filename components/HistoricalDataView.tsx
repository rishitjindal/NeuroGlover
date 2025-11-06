
import React, { useState, useMemo } from 'react';
import type { SensorDataPoint } from '../types';
import SensorDataChart from './SensorDataChart';

interface HistoricalDataViewProps {
  data: SensorDataPoint[];
  onClear: () => void;
}

const HistoricalDataView: React.FC<HistoricalDataViewProps> = ({ data, onClear }) => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    // Set time to beginning of the day for start date
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const startTimestamp = start.getTime();

    // Set time to end of the day for end date
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const endTimestamp = end.getTime();

    if (startTimestamp > endTimestamp) {
        setError("Start date cannot be after end date.");
        return [];
    }
    setError(null);

    return data.filter(point => 
      point.timestamp >= startTimestamp && point.timestamp <= endTimestamp
    );
  }, [data, startDate, endDate]);

  const handleClearClick = () => {
      if (window.confirm("Are you sure you want to delete all historical sensor data? This action cannot be undone.")) {
          onClear();
      }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-text-primary">Historical Data</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="start-date" className="text-sm text-text-secondary">From:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-primary border border-highlight rounded-md px-2 py-1 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="end-date" className="text-sm text-text-secondary">To:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-primary border border-highlight rounded-md px-2 py-1 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button 
            onClick={handleClearClick}
            className="bg-red-600/80 hover:bg-red-700 disabled:bg-red-600/40 disabled:cursor-not-allowed text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors"
            disabled={data.length === 0}
            >
            Clear History
          </button>
        </div>
      </div>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
      <div className="h-96">
        <SensorDataChart data={filteredData} />
      </div>
    </div>
  );
};

export default HistoricalDataView;