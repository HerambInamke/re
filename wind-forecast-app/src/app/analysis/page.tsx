'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import HorizonSlider from '@/components/HorizonSlider';
import ErrorAnalysisCharts from '@/components/ErrorAnalysisCharts';
import { WindDataResponse } from '@/lib/types';

export default function AnalysisPage() {
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Forecast Accuracy Analysis
          </h2>
          <p className="mt-2 text-gray-600">
            Detailed error analysis and forecast performance metrics
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
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
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto font-medium"
            >
              {loading ? 'Loading...' : 'Update Analysis'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Analysis Charts */}
        {data && data.data.length > 0 && (
          <ErrorAnalysisCharts data={data.data} />
        )}

        {/* No Data Message */}
        {data && data.data.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="font-medium">No Data Available</p>
            <p className="text-sm">No data available for the selected date range. Try adjusting your filters.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </main>
    </div>
  );
}
