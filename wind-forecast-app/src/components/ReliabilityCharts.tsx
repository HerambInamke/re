'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProcessedDataPoint } from '@/lib/types';

interface ReliabilityChartsProps {
  data: ProcessedDataPoint[];
}

/**
 * ReliabilityCharts Component
 * Displays wind generation reliability analysis with distribution and percentile charts
 */
export default function ReliabilityCharts({ data }: ReliabilityChartsProps) {
  // Extract actual generation values
  const actualValues = data
    .filter(d => d.actual !== null)
    .map(d => d.actual!);

  if (actualValues.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Insufficient Data</p>
        <p className="text-sm">Not enough data points for reliability analysis.</p>
      </div>
    );
  }

  // Sort values for percentile calculations
  const sortedValues = [...actualValues].sort((a, b) => a - b);

  // Calculate percentiles
  const calculatePercentile = (p: number) => {
    const index = Math.ceil((p / 100) * sortedValues.length) - 1;
    return sortedValues[Math.max(0, index)];
  };

  const p10 = calculatePercentile(10);
  const p50 = calculatePercentile(50);
  const p90 = calculatePercentile(90);
  const mean = actualValues.reduce((a, b) => a + b, 0) / actualValues.length;
  const min = Math.min(...actualValues);
  const max = Math.max(...actualValues);

  // Percentile data for chart
  const percentileData = [
    { percentile: 'P10', value: p10, label: '10th Percentile' },
    { percentile: 'P25', value: calculatePercentile(25), label: '25th Percentile' },
    { percentile: 'P50', value: p50, label: 'Median (P50)' },
    { percentile: 'P75', value: calculatePercentile(75), label: '75th Percentile' },
    { percentile: 'P90', value: p90, label: '90th Percentile' }
  ];

  // Distribution histogram
  const bins = 20;
  const binSize = (max - min) / bins;
  const histogram = Array.from({ length: bins }, (_, i) => {
    const binStart = min + (i * binSize);
    const binEnd = binStart + binSize;
    const count = actualValues.filter(v => v >= binStart && v < binEnd).length;
    return {
      range: `${binStart.toFixed(0)}`,
      count,
      binStart
    };
  });

  return (
    <div className="space-y-6">
      {/* Reliability Recommendation Panel */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-l-4 border-green-500 rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2 text-xl">
          <span>✅</span>
          Reliability Recommendation
        </h3>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Based on historical data from the selected period, wind generation is at least{' '}
            <span className="font-bold text-green-700 text-2xl">{p10.toFixed(0)} MW</span>{' '}
            for 90% of the time.
          </p>
          <p className="text-gray-600 text-base">
            <strong>Grid Operator Recommendation:</strong> Grid operators can reliably expect approximately{' '}
            <span className="font-semibold text-green-700">{p10.toFixed(0)} MW</span> from wind generation 
            as a baseline capacity. This represents the P10 value, meaning generation exceeds this level 
            90% of the time.
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 font-medium mb-1">Minimum</p>
          <p className="text-2xl font-bold text-gray-900">{min.toFixed(0)} MW</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-600 font-medium mb-1">P10 (Reliable)</p>
          <p className="text-2xl font-bold text-green-700">{p10.toFixed(0)} MW</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 font-medium mb-1">Median (P50)</p>
          <p className="text-2xl font-bold text-gray-900">{p50.toFixed(0)} MW</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-orange-500">
          <p className="text-sm text-gray-600 font-medium mb-1">P90</p>
          <p className="text-2xl font-bold text-gray-900">{p90.toFixed(0)} MW</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-gray-500">
          <p className="text-sm text-gray-600 font-medium mb-1">Maximum</p>
          <p className="text-2xl font-bold text-gray-900">{max.toFixed(0)} MW</p>
        </div>
      </div>

      {/* Wind Generation Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>📊</span>
              Wind Generation Distribution
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Histogram showing distribution of wind generation levels
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={histogram} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Generation (MW)', 
                position: 'insideBottom', 
                offset: -15, 
                style: { fill: '#6b7280', fontSize: 12, fontWeight: 600 } 
              }}
              angle={-45}
              textAnchor="end"
              height={90}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Frequency', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fill: '#6b7280', fontSize: 12, fontWeight: 600 } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any) => [`${value} occurrences`, 'Frequency']}
            />
            <Bar dataKey="count" fill="#3b82f6" name="Frequency" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Percentile Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>📈</span>
              Generation Percentiles
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Key percentile values showing generation reliability
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={percentileData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="percentile" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Percentile', 
                position: 'insideBottom', 
                offset: -15, 
                style: { fill: '#6b7280', fontSize: 12, fontWeight: 600 } 
              }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Generation (MW)', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fill: '#6b7280', fontSize: 12, fontWeight: 600 } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value.toFixed(2)} MW`, 
                props.payload.label
              ]}
            />
            <Bar dataKey="value" fill="#10b981" name="Generation" radius={[8, 8, 0, 0]}>
              {percentileData.map((entry, index) => (
                <Bar 
                  key={`bar-${index}`} 
                  dataKey="value" 
                  fill={entry.percentile === 'P10' ? '#22c55e' : '#10b981'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong className="text-blue-900">Interpretation:</strong> P10 represents a reliable baseline 
            of wind power available most of the time. Generation exceeds the P10 value ({p10.toFixed(0)} MW) 
            for 90% of the time period, making it a dependable capacity for grid planning.
          </p>
        </div>
      </div>

      {/* Reliability Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            Key Insights
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Reliable Capacity:</strong> {p10.toFixed(0)} MW can be counted on 90% of the time
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>
                <strong>Typical Generation:</strong> Median generation is {p50.toFixed(0)} MW
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">✓</span>
              <span>
                <strong>Peak Capacity:</strong> Generation reaches {p90.toFixed(0)} MW or higher 10% of the time
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">✓</span>
              <span>
                <strong>Variability:</strong> Range from {min.toFixed(0)} MW to {max.toFixed(0)} MW
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📋</span>
            Grid Planning Recommendations
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">→</span>
              <span>
                Use P10 ({p10.toFixed(0)} MW) as firm capacity for grid planning
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>
                Plan backup capacity for the difference between P50 and P10
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">→</span>
              <span>
                Consider energy storage to capture excess during high generation periods
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">→</span>
              <span>
                Monitor weather forecasts to anticipate low generation periods
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
