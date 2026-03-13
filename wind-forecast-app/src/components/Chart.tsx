'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProcessedDataPoint } from '@/lib/types';

interface ChartProps {
  data: ProcessedDataPoint[];
}

export default function Chart({ data }: ChartProps) {
  // Format data for Recharts
  const chartData = data.map(d => ({
    time: new Date(d.time).toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    actual: d.actual,
    forecast: d.forecast
  }));

  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Generation (MW)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            name="Actual"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line 
            type="monotone" 
            dataKey="forecast" 
            stroke="#10b981" 
            name="Forecast"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
