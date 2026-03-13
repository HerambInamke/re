import { fetchActuals } from '@/lib/fetchActuals';
import { fetchForecasts } from '@/lib/fetchForecasts';
import { processForecasts } from '@/lib/processForecasts';
import { calculateMetrics } from '@/lib/calculateMetrics';

/**
 * API Route: /api/wind-data
 * 
 * Fetches actual and forecast wind generation data, processes them according
 * to the forecast horizon logic, and returns merged data with metrics.
 * 
 * Query Parameters:
 * - startDate: Start date (YYYY-MM-DD HH:MM) - optional, defaults to Jan 2024
 * - endDate: End date (YYYY-MM-DD HH:MM) - optional, defaults to Jan 2024
 * - horizon: Forecast horizon in hours (0-48) - optional, defaults to 4
 * 
 * Returns:
 * - data: Array of time-series data points with actual and forecast values
 * - metrics: MAE, RMSE, Median Error, P99 Error
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    
    // Get horizon from query params, default to 4 hours
    const horizon = Number(url.searchParams.get("horizon") || 4);
    
    // Get date range from query params, default to January 2024
    const startDate = url.searchParams.get("startDate") || "2024-01-01 00:00";
    const endDate = url.searchParams.get("endDate") || "2024-01-31 23:59";

    console.log('API Request:', { startDate, endDate, horizon });

    // Validate horizon range
    if (horizon < 0 || horizon > 48) {
      return Response.json(
        { error: 'horizon must be between 0 and 48 hours' },
        { status: 400 }
      );
    }

    console.log('Fetching data from BMRS APIs...');

    // Fetch actual and forecast data
    const actuals = await fetchActuals(startDate, endDate);
    const forecasts = await fetchForecasts(startDate, endDate);

    console.log(`Fetched ${actuals.length} actuals and ${forecasts.length} forecasts`);

    // Validate we have data
    if (actuals.length === 0) {
      return Response.json(
        { error: 'No actual generation data found for the specified date range' },
        { status: 404 }
      );
    }

    if (forecasts.length === 0) {
      console.warn('No forecast data found, continuing with actuals only');
    }

    // Process and align forecast data with actuals based on horizon
    const merged = processForecasts(actuals, forecasts, horizon);

    console.log(`Processed ${merged.data.length} data points`);

    // Calculate metrics from merged data
    const metrics = calculateMetrics(merged.data);

    console.log('Metrics:', metrics);

    // Return response matching expected format
    return Response.json({
      data: merged.data,
      metrics
    });

  } catch (error) {
    console.error("Wind API error:", error);
    
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', errorMessage);
    
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
