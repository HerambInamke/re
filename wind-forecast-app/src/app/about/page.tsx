'use client';

import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            About & Methodology
          </h2>
          <p className="mt-2 text-gray-600">
            Understanding how forecasts are matched and metrics are calculated
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              The Wind Power Forecast Monitoring Dashboard is a production-quality data visualization 
              application that compares actual vs forecasted wind generation data in the United Kingdom. 
              It uses real-time data from the BMRS (Balancing Mechanism Reporting Service) API to provide 
              insights into forecast accuracy, performance, and reliability for grid planning.
            </p>
          </section>

          {/* Application Screens */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Screens</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>📊</span>
                  Dashboard
                </h4>
                <p className="text-gray-700 mb-2">
                  Main monitoring interface showing real-time comparison of actual vs forecasted wind generation.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                  <li>Time-series chart with actual (blue) and forecast (green) lines</li>
                  <li>Four KPI cards: MAE, RMSE, Median Error, P99 Error</li>
                  <li>Interactive date range and horizon controls</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>📈</span>
                  Analytics
                </h4>
                <p className="text-gray-700 mb-2">
                  Detailed error analysis and forecast performance metrics.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                  <li>Error distribution histogram</li>
                  <li>Error by time of day analysis</li>
                  <li>Error vs forecast horizon chart</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>⚡</span>
                  Reliability
                </h4>
                <p className="text-gray-700 mb-2">
                  Evaluate how dependable wind power is for meeting electricity demand.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                  <li>Wind generation distribution histogram</li>
                  <li>Percentile chart (P10, P50, P90)</li>
                  <li>Reliability recommendation panel for grid operators</li>
                  <li>Grid planning insights and recommendations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Sources</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">BMRS FUELHH Dataset</h4>
                <p className="text-gray-700 mb-2">
                  Provides half-hourly actual wind generation data for the United Kingdom.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><span className="font-medium">Field:</span> startTime - Timestamp of generation period</li>
                  <li><span className="font-medium">Field:</span> generation - Actual wind power in MW</li>
                  <li><span className="font-medium">Frequency:</span> 30-minute intervals</li>
                </ul>
                <a 
                  href="https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  View API Documentation →
                </a>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">BMRS WINDFOR Dataset</h4>
                <p className="text-gray-700 mb-2">
                  Provides wind generation forecasts with multiple predictions per target time.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><span className="font-medium">Field:</span> startTime - Target generation time</li>
                  <li><span className="font-medium">Field:</span> publishTime - When forecast was created</li>
                  <li><span className="font-medium">Field:</span> generation - Forecasted power in MW</li>
                </ul>
                <a 
                  href="https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  View API Documentation →
                </a>
              </div>
            </div>
          </section>

          {/* Forecast Matching Logic */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Forecast Matching Logic</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Forecast Horizon Definition</h4>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm">
                  horizon = startTime - publishTime
                </div>
                <p className="text-gray-700 mt-2">
                  The horizon represents how far in advance a forecast was made. For example, 
                  a forecast published at 14:00 for 18:00 has a 4-hour horizon.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Selection Algorithm</h4>
                <p className="text-gray-700 mb-3">
                  For each actual generation data point at a target time:
                </p>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Calculate maximum publish time: <code className="bg-gray-100 px-2 py-1 rounded text-sm">maxPublishTime = targetTime - horizonHours</code></li>
                  <li>Find all forecasts where <code className="bg-gray-100 px-2 py-1 rounded text-sm">forecast.startTime === targetTime</code></li>
                  <li>Filter forecasts where <code className="bg-gray-100 px-2 py-1 rounded text-sm">publishTime ≤ maxPublishTime</code></li>
                  <li>Select the forecast with the most recent publishTime</li>
                  <li>If no valid forecast exists, set forecast value to null (gap in chart)</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Example Scenario</h4>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="text-gray-900 font-medium mb-2">Given:</p>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• Target Time: 2024-01-15 18:00</li>
                    <li>• User-selected Horizon: 4 hours</li>
                    <li>• Available Forecasts:
                      <ul className="ml-6 mt-1">
                        <li>- Published at 12:00 → 5100 MW</li>
                        <li>- Published at 13:30 → 5150 MW</li>
                        <li>- Published at 15:00 → 5200 MW</li>
                      </ul>
                    </li>
                  </ul>
                  <p className="text-gray-900 font-medium mt-3 mb-2">Result:</p>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• Max Publish Time: 18:00 - 4h = 14:00</li>
                    <li>• Valid Forecasts: 12:00 ✓, 13:30 ✓, 15:00 ✗</li>
                    <li>• Selected: 13:30 (most recent valid) → 5150 MW</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* KPI Calculations */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">KPI Calculations</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mean Absolute Error (MAE)</h4>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm mb-2">
                  MAE = Σ|actual - forecast| / n
                </div>
                <p className="text-gray-700">
                  The average absolute difference between actual and forecasted values. 
                  Lower values indicate better forecast accuracy.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Root Mean Square Error (RMSE)</h4>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm mb-2">
                  RMSE = √(Σ(actual - forecast)² / n)
                </div>
                <p className="text-gray-700">
                  The square root of the average squared differences. RMSE penalizes larger 
                  errors more heavily than MAE, making it useful for identifying outliers.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Median Error</h4>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm mb-2">
                  Median = middle value of sorted |actual - forecast|
                </div>
                <p className="text-gray-700">
                  The middle value when all absolute errors are sorted. Less sensitive to 
                  outliers than MAE, providing a robust measure of typical forecast error.
                </p>
              </div>
            </div>
          </section>

          {/* Data Filtering */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Filtering Rules</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Date Range</h4>
                <p className="text-gray-700">
                  Data is filtered to January 2024 (2024-01-01 to 2024-01-31) to ensure 
                  consistent data availability and avoid incomplete datasets.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Forecast Horizon Range</h4>
                <p className="text-gray-700">
                  Only forecasts with horizons between 0 and 48 hours are included. This range 
                  represents the most useful forecast window for wind generation planning.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Next.js 16 (App Router)</li>
                  <li>• React 19</li>
                  <li>• TypeScript 5</li>
                  <li>• Tailwind CSS 4</li>
                  <li>• Recharts</li>
                  <li>• date-fns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Next.js API Routes</li>
                  <li>• BMRS API Integration</li>
                  <li>• Server-side Processing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Attribution */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Attribution</h3>
            <p className="text-gray-700">
              Data provided by Elexon BMRS (Balancing Mechanism Reporting Service). 
              This application uses publicly available data under the Open Government License.
            </p>
            <a 
              href="https://www.elexon.co.uk/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              Visit Elexon Website →
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
