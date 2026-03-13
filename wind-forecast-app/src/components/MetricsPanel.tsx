'use client';

import { Metrics } from '@/lib/types';

interface MetricsPanelProps {
  metrics: Metrics;
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Mean Absolute Error</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.mae.toFixed(2)} MW</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">RMSE</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.rmse.toFixed(2)} MW</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Median Error</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.medianError.toFixed(2)} MW</p>
      </div>
    </div>
  );
}
