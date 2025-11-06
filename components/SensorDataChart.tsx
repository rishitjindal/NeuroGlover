
import React from 'react';
import type { SensorDataPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslations } from '../App';

interface SensorDataChartProps {
  data: SensorDataPoint[];
}

const SensorDataChart: React.FC<SensorDataChartProps> = ({ data }) => {
    const { t } = useTranslations();
    
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-text-secondary">
                <p>{t('waitingForData')}</p>
            </div>
        );
    }
    
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4F4F8E" />
        <XAxis dataKey="time" stroke="#A0A0C0" />
        <YAxis stroke="#A0A0C0" domain={['dataMin - 10', 'dataMax + 10']} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E1E3F',
            borderColor: '#4F4F8E',
            color: '#E0E0FF'
          }}
          labelStyle={{ color: '#A0A0C0' }}
        />
        <Legend wrapperStyle={{ color: '#E0E0FF' }} />
        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} dot={false} name={t('sensorValue')} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorDataChart;
