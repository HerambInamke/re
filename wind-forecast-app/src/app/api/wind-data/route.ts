import { NextRequest, NextResponse } from 'next/server';
import { fetchActuals } from '@/lib/fetchActuals';
import { fetchForecasts } from '@/lib/fetchForecasts';
import { processForecasts } from '@/lib/processForecasts';

/**
 * API Route: /api/wind-data
 * 
 * Fetches actual and forecast wind generation data, processes them according
 * to the forecast horizon logic, and returns merged data with metrics.
 * 
 * Query Parameters:
 * - startDate: Start date (YYYY-MM-DD HH:MM)
 * - endDate: End date (YYYY-MM-DD HH:MM)
 * - horizon: Forecast horizon in hours (0-48)
 * 
 * Returns:
 * - data: Array of time-series data points with actual and forecast values
 * - metrics: MAE, RMSE, and Median Error
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const horizon = parseInt(searchParams.get('horizon') || '24', 10);

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    // Fetch actual and forecast data in parallel for better performance
    const [actuals, forecasts] = await Promise.all([
      fetchActuals(startDate, endDate),
      fetchForecasts(startDate, endDate)
    ]);

    // Process and align forecast data with actuals based on horizon
    const result = processForecasts(actuals, forecasts, horizon);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching wind data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wind data' },
      { status: 500 }
    );
  }
}
