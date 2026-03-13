'use client';

import { useState, useEffect } from 'react';
import Chart from '@/components/Chart';
import DateRangePicker from '@/components/DateRangePicker';
import HorizonSlider from '@/components/HorizonSlider';
import MetricsPanel from '@/components/MetricsPanel';
import { WindDataResponse } from '@/lib/types';

export default function Home() {
  // Default to January 2024
  const [startDate, setStartDate] = useState('2024-01-01T00:00');
  const [endDate, setEndDate] = useState('2024-01-07T23:59');
  const [horizon, setHorizon] = useState(24);
  const [data, setData] = useState<WindDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        startDate: startDate.replace('T', ' '),
        endDate: endDate.replace('T', ' '),
        horizon: horizon.toString()
      });

      const response = await fetch(`/api/wind-data?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Wind Power Forecast Monitoring Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Comparing actual vs forecasted wind generation in the United Kingdom
          </p>
        </header>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col gap-6">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <HorizonSlider value={horizon} onChange={setHorizon} />
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
              {loading ? 'Loading...' : 'Update Data'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Chart */}
        {data && data.data.length > 0 && (
          <>
            <div className="mb-6">
              <Chart data={data.data} />
            </div>

            {/* Metrics */}
            <MetricsPanel metrics={data.metrics} />
          </>
        )}

        {/* No Data Message */}
        {data && data.data.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            No data available for the selected date range.
          </div>
        )}
      </div>
    </div>
  );
}
