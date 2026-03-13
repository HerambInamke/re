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
      description: 'Average forecast deviation',
      color: 'blue',
      icon: '📊',
      formula: 'mean(|forecast - actual|)'
    },
    {
      title: 'RMSE',
      value: metrics.rmse.toFixed(2),
      unit: 'MW',
      description: 'Root mean square error',
      color: 'green',
      icon: '📈',
      formula: '√(mean((forecast - actual)²))'
    },
    {
      title: 'Median Error',
      value: metrics.medianError.toFixed(2),
      unit: 'MW',
      description: 'Typical forecast error',
      color: 'purple',
      icon: '📉',
      formula: 'median(|forecast - actual|)'
    },
    {
      title: 'P99 Error',
      value: metrics.p99Error.toFixed(2),
      unit: 'MW',
      description: '99th percentile error',
      color: 'orange',
      icon: '⚡',
      formula: '99% of errors below this'
    }
  ];

  const colorClasses = {
    blue: 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'border-green-500 bg-gradient-to-br from-green-50 to-green-100',
    purple: 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100',
    orange: 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100'
  };

  const textColorClasses = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    purple: 'text-purple-700',
    orange: 'text-orange-700'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index}
          className={`relative overflow-hidden rounded-xl shadow-md border-l-4 ${colorClasses[card.color as keyof typeof colorClasses]} hover:shadow-lg transition-shadow duration-200`}
        >
          <div className="p-6">
            {/* Icon */}
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{card.icon}</span>
              <div className={`text-xs font-mono px-2 py-1 rounded ${textColorClasses[card.color as keyof typeof textColorClasses]} bg-white bg-opacity-60`}>
                {card.formula}
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {card.title}
            </h3>
            
            {/* Value */}
            <div className="flex items-baseline gap-2 mb-2">
              <p className={`text-4xl font-bold ${textColorClasses[card.color as keyof typeof textColorClasses]}`}>
                {card.value}
              </p>
              <span className="text-sm text-gray-600 font-medium">{card.unit}</span>
            </div>
            
            {/* Description */}
            <p className="text-xs text-gray-600">{card.description}</p>
          </div>
          
          {/* Decorative element */}
          <div className={`absolute bottom-0 right-0 w-24 h-24 ${textColorClasses[card.color as keyof typeof textColorClasses]} opacity-5 transform translate-x-8 translate-y-8`}>
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
