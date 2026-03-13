'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ForecastChart from '@/components/ForecastChart';
import DateRangePicker from '@/components/DateRangePicker';
import HorizonSlider from '@/components/HorizonSlider';
import KpiCards from '@/components/KpiCards';
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
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Forecast Monitoring Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Real-time comparison of actual vs forecasted wind generation in the UK
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Controls
          </h3>
          <div className="flex flex-col gap-4">
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
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
              {loading ? 'Loading...' : 'Update Data'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium text-sm">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {data && data.data.length > 0 && (
          <>
            {/* KPI Cards */}
            <div className="mb-6">
              <KpiCards metrics={data.metrics} />
            </div>

            {/* Main Chart */}
            <div className="mb-6">
              <ForecastChart data={data.data} />
            </div>
          </>
        )}

        {/* No Data Message */}
        {data && data.data.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <p className="font-medium text-sm">No Data Available</p>
            <p className="text-sm mt-1">No data available for the selected date range. Try adjusting your filters.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-600 text-sm">Fetching wind generation data...</p>
          </div>
        )}
      </main>
    </div>
  );
}
