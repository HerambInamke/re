'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProcessedDataPoint } from '@/lib/types';
import { format } from 'date-fns';

interface ForecastChartProps {
  data: ProcessedDataPoint[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const actual = payload[0]?.value;
    const forecast = payload[1]?.value;
    const error = actual && forecast ? Math.abs(actual - forecast) : null;

    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs font-medium text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-xs text-gray-600">Actual:</span>
            <span className="text-xs font-medium text-gray-900">{actual?.toFixed(2)} MW</span>
          </div>
          {forecast !== null && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-xs text-gray-600">Forecast:</span>
                <span className="text-xs font-medium text-gray-900">{forecast?.toFixed(2)} MW</span>
              </div>
              {error !== null && (
                <div className="flex items-center gap-2 pt-1 border-t border-gray-200 mt-1">
                  <span className="text-xs text-gray-600">Error:</span>
                  <span className="text-xs font-medium text-orange-600">{error.toFixed(2)} MW</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function ForecastChart({ data }: ForecastChartProps) {
  // Format data for Recharts
  const chartData = data.map(d => ({
    timestamp: new Date(d.time).getTime(),
    time: format(new Date(d.time), 'dd MMM HH:mm'),
    actual: d.actual,
    forecast: d.forecast
  }));

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900">
          Wind Generation: Actual vs Forecast
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Comparison of forecasted and actual wind power generation
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis 
            label={{ 
              value: 'Generation (MW)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#6b7280', fontSize: 12 }
            }}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#2563eb" 
            name="Actual Generation"
            strokeWidth={2}
            dot={false}
            connectNulls
            activeDot={{ r: 5, fill: '#2563eb' }}
          />
          <Line 
            type="monotone" 
            dataKey="forecast" 
            stroke="#16a34a" 
            name="Forecast Generation"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            activeDot={{ r: 5, fill: '#16a34a' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
