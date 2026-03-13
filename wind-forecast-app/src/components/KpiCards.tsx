'use client';

import { Metrics } from '@/lib/types';

interface KpiCardsProps {
  metrics: Metrics;
}

export default function KpiCards({ metrics }: KpiCardsProps) {
  const cards = [
    {
      title: 'Mean Absolute Error',
      value: metrics.mae.toFixed(2),
      unit: 'MW',
      description: 'Average forecast deviation'
    },
    {
      title: 'RMSE',
      value: metrics.rmse.toFixed(2),
      unit: 'MW',
      description: 'Root mean square error'
    },
    {
      title: 'Median Error',
      value: metrics.medianError.toFixed(2),
      unit: 'MW',
      description: 'Typical forecast error'
    },
    {
      title: 'P99 Error',
      value: metrics.p99Error.toFixed(2),
      unit: 'MW',
      description: '99th percentile error'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
        >
          <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            {card.title}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-3xl font-semibold text-gray-900">
              {card.value}
            </p>
            <span className="text-sm text-gray-500">{card.unit}</span>
          </div>
          
          <p className="text-xs text-gray-500">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
