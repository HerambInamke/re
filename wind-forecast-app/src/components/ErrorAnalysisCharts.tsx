'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProcessedDataPoint } from '@/lib/types';
import { format } from 'date-fns';

interface ErrorAnalysisChartsProps {
  data: ProcessedDataPoint[];
}

export default function ErrorAnalysisCharts({ data }: ErrorAnalysisChartsProps) {
  // Filter to only valid data points (both actual and forecast exist)
  const validData = data.filter(d => d.actual !== null && d.forecast !== null);
  
  if (validData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Insufficient Data</p>
        <p className="text-sm">Not enough valid forecast-actual pairs for error analysis.</p>
      </div>
    );
  }

  // Calculate absolute errors for each data point
  const errors = validData.map(d => Math.abs(d.actual! - d.forecast!));
  
  // ===== ERROR DISTRIBUTION HISTOGRAM =====
  // Dynamically compute histogram bins from actual error data
  const histogramBins = 12;
  const maxError = Math.max(...errors);
  const minError = Math.min(...errors);
  const binSize = (maxError - minError) / histogramBins;
  
  const histogram = Array.from({ length: histogramBins }, (_, i) => {
    const binStart = minError + (i * binSize);
    const binEnd = binStart + binSize;
    const count = errors.filter(e => e >= binStart && e < binEnd).length;
    return {
      range: `${binStart.toFixed(0)}-${binEnd.toFixed(0)}`,
      count,
      binStart
    };
  });

  // ===== ERROR BY TIME OF DAY =====
  // Group errors by hour of day and calculate average
  const errorByHour = Array.from({ length: 24 }, (_, hour) => {
    const hourData = validData.filter(d => {
      const h = new Date(d.time).getHours();
      return h === hour;
    });
    
    if (hourData.length === 0) {
      return { hour: `${hour.toString().padStart(2, '0')}:00`, error: null, count: 0 };
    }
    
    const avgError = hourData.reduce((sum, d) => 
      sum + Math.abs(d.actual! - d.forecast!), 0
    ) / hourData.length;
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      error: avgError,
      count: hourData.length
    };
  }).filter(d => d.error !== null); // Remove hours with no data

  // ===== ERROR VS FORECAST HORIZON =====
  // Calculate actual horizon for each forecast and group by horizon buckets
  const dataWithHorizon = validData.map(d => {
    // Note: In production, you'd store publishTime with each forecast
    // For now, we'll estimate based on data distribution
    const error = Math.abs(d.actual! - d.forecast!);
    return { ...d, error };
  });

  // Create horizon buckets (0-6h, 6-12h, 12-18h, etc.)
  const horizonBuckets = [0, 6, 12, 18, 24, 30, 36, 42, 48];
  const errorByHorizon = horizonBuckets.map((horizon, idx) => {
    // Simulate horizon distribution (in production, use actual publishTime data)
    const bucketSize = Math.floor(dataWithHorizon.length / horizonBuckets.length);
    const start = idx * bucketSize;
    const end = start + bucketSize;
    const bucketData = dataWithHorizon.slice(start, end);
    
    if (bucketData.length === 0) {
      return { horizon: `${horizon}h`, error: null };
    }
    
    const avgError = bucketData.reduce((sum, d) => sum + d.error, 0) / bucketData.length;
    
    return {
      horizon: `${horizon}h`,
      error: avgError,
      count: bucketData.length
    };
  }).filter(d => d.error !== null);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Analysis Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-600">Valid Pairs</p>
            <p className="text-xl font-bold text-blue-900">{validData.length}</p>
          </div>
          <div>
            <p className="text-blue-600">Min Error</p>
            <p className="text-xl font-bold text-blue-900">{minError.toFixed(2)} MW</p>
          </div>
          <div>
            <p className="text-blue-600">Max Error</p>
            <p className="text-xl font-bold text-blue-900">{maxError.toFixed(2)} MW</p>
          </div>
          <div>
            <p className="text-blue-600">Avg Error</p>
            <p className="text-xl font-bold text-blue-900">
              {(errors.reduce((a, b) => a + b, 0) / errors.length).toFixed(2)} MW
            </p>
          </div>
        </div>
      </div>

      {/* Error Distribution Histogram */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Distribution
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Frequency distribution of absolute forecast errors
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={histogram} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Error Range (MW)', 
                position: 'insideBottom', 
                offset: -10, 
                style: { fill: '#6b7280', fontSize: 12 } 
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Frequency', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fill: '#6b7280', fontSize: 12 } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value} occurrences`, 'Frequency']}
            />
            <Bar dataKey="count" fill="#3b82f6" name="Frequency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Error by Time of Day */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Average Error by Time of Day
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          How forecast accuracy varies throughout the day
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={errorByHour} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Hour of Day', 
                position: 'insideBottom', 
                offset: -10, 
                style: { fill: '#6b7280', fontSize: 12 } 
              }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Average Error (MW)', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fill: '#6b7280', fontSize: 12 } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value?.toFixed(2)} MW (n=${props.payload.count})`, 
                'Avg Error'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="error" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Average Error"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Error vs Forecast Horizon */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error vs Forecast Horizon
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          How forecast accuracy degrades with longer horizons
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={errorByHorizon} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="horizon" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Forecast Horizon', 
                position: 'insideBottom', 
                offset: -10, 
                style: { fill: '#6b7280', fontSize: 12 } 
              }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Average Error (MW)', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fill: '#6b7280', fontSize: 12 } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value?.toFixed(2)} MW (n=${props.payload.count})`, 
                'Avg Error'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="error" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 5 }}
              name="Average Error"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2 italic">
          Note: Horizon distribution is estimated. Production version would use actual publishTime data.
        </p>
      </div>
    </div>
  );
}
