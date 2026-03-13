'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import HorizonSlider from '@/components/HorizonSlider';
import { WindDataResponse } from '@/lib/types';
import ReliabilityCharts from '@/components/ReliabilityCharts';

export default function ReliabilityPage() {
  const [startDate, setStartDate] = useState('2024-01-01T00:00');
  const [endDate, setEndDate] = useState('2024-01-31T23:59');
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
            <span className="text-4xl">⚡</span>
            Wind Generation Reliability
          </h2>
          <p className="mt-2 text-gray-600">
            Evaluate how dependable wind power is for meeting electricity demand
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

        {/* Data Methodology Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📚</span>
            Data Methodology
          </h3>
          <p className="text-gray-600 mb-6">
            Understanding the data sources and analysis methods builds credibility for this reliability assessment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dataset Sources */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>🗄️</span>
                Dataset Sources
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-blue-800">Actual Generation:</p>
                  <p className="ml-4">BMRS FUELHH dataset - Half-hourly actual wind generation data filtered by fuel type WIND</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Forecast Data:</p>
                  <p className="ml-4">BMRS WINDFOR dataset - Wind generation forecasts with publish times and target periods</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Time Period:</p>
                  <p className="ml-4">January 2024 (configurable via date range selector)</p>
                </div>
              </div>
            </div>

            {/* Forecast Horizon Definition */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <span>⏱️</span>
                Forecast Horizon Definition
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-green-800">Formula:</p>
                  <p className="ml-4 font-mono bg-white px-3 py-2 rounded border border-green-300">
                    horizon = startTime - publishTime
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">Range:</p>
                  <p className="ml-4">0 to 48 hours (adjustable via slider)</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">Meaning:</p>
                  <p className="ml-4">How far in advance the forecast was published before the actual generation period</p>
                </div>
              </div>
            </div>

            {/* Forecast Matching Logic */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span>🔗</span>
                Forecast Matching Logic
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold text-purple-800">For each actual generation record:</p>
                <ol className="ml-4 space-y-1 list-decimal list-inside">
                  <li>Set <span className="font-mono bg-white px-1 rounded">targetTime = actual.startTime</span></li>
                  <li>Use horizon value from slider</li>
                  <li>
                    Select forecasts where:
                    <span className="font-mono bg-white px-2 py-1 rounded ml-2 inline-block mt-1">
                      publishTime &le; targetTime - horizon
                    </span>
                  </li>
                  <li>Choose forecast with most recent publishTime</li>
                  <li>If no valid forecast exists, return null</li>
                </ol>
              </div>
            </div>

            {/* KPI Calculations */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border border-orange-200">
              <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <span>📊</span>
                KPI Calculations
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-orange-800">MAE (Mean Absolute Error):</p>
                  <p className="ml-4 font-mono text-xs bg-white px-2 py-1 rounded">mean(|forecast - actual|)</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">RMSE (Root Mean Square Error):</p>
                  <p className="ml-4 font-mono text-xs bg-white px-2 py-1 rounded">sqrt(mean((forecast - actual)^2))</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">Median Error:</p>
                  <p className="ml-4">Middle value of sorted absolute errors</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">P99 Error:</p>
                  <p className="ml-4">99% of errors are below this value</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">Forecast Bias:</p>
                  <p className="ml-4 font-mono text-xs bg-white px-2 py-1 rounded">mean(forecast - actual)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
            <p className="text-sm text-gray-700">
              <strong className="text-gray-900">Note:</strong> All calculations are performed dynamically on real data 
              from the BMRS APIs. No hardcoded values are used. The analysis updates in real-time based on your 
              selected date range and forecast horizon.
            </p>
          </div>
        </div>

        {/* Reliability Charts */}
        {data && data.data.length > 0 && (
          <ReliabilityCharts data={data.data} />
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
            <p className="text-gray-600 font-medium">Analyzing wind generation reliability...</p>
          </div>
        )}
      </main>
    </div>
  );
}
