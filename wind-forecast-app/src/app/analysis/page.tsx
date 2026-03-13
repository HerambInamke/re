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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">📈</span>
            Forecast Accuracy Analytics
          </h2>
          <p className="mt-2 text-gray-600">
            Detailed error analysis and forecast performance metrics
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            Controls
          </h3>
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
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all w-full sm:w-auto font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Update Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <p className="font-semibold flex items-center gap-2">
              <span>⚠️</span>
              Error
            </p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Analysis Charts */}
        {data && data.data.length > 0 && (
          <ErrorAnalysisCharts data={data.data} />
        )}

        {/* No Data Message */}
        {data && data.data.length === 0 && !loading && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded-lg shadow-sm">
            <p className="font-semibold flex items-center gap-2">
              <span>⚠️</span>
              No Data Available
            </p>
            <p className="text-sm mt-1">No data available for the selected date range. Try adjusting your filters.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Analyzing forecast performance...</p>
          </div>
        )}
      </main>
    </div>
  );
}
