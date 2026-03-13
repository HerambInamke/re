import { ActualDataPoint, ForecastDataPoint, ProcessedDataPoint, Metrics } from './types';
import { calculateMetrics } from './calculateMetrics';

/**
 * Process and align forecast data with actual generation data based on forecast horizon.
 * 
 * Forecast Matching Logic:
 * For each actual generation record:
 *   targetTime = actual.startTime
 *   Use the horizon value provided by the frontend slider
 *   Select forecasts where: publishTime ≤ targetTime - horizon
 *   From these forecasts choose the one with the most recent publishTime
 *   Use that generation value as the forecast
 *   If no valid forecast exists, return forecast = null
 * 
 * @param actuals - Array of actual wind generation data points
 * @param forecasts - Array of forecast data points
 * @param horizonHours - Forecast horizon in hours (0-48)
 * @returns Processed data with aligned forecasts and calculated metrics
 */
export function processForecasts(
  actuals: ActualDataPoint[],
  forecasts: ForecastDataPoint[],
  horizonHours: number
): { data: ProcessedDataPoint[]; metrics: Metrics } {
  console.log(`Processing ${actuals.length} actuals with ${forecasts.length} forecasts, horizon: ${horizonHours}h`);
  
  // Validate inputs - never crash
  if (!actuals || actuals.length === 0) {
    console.warn('No actuals provided to processForecasts');
    return {
      data: [],
      metrics: { mae: 0, rmse: 0, medianError: 0, p99Error: 0, bias: 0, count: 0 }
    };
  }

  // Convert horizon to milliseconds
  const horizonMs = horizonHours * 60 * 60 * 1000;

  // Process each actual data point
  const processedData: ProcessedDataPoint[] = [];

  actuals.forEach(actual => {
    try {
      // Validate actual has required fields
      if (!actual.startTime) {
        console.warn('Actual missing startTime:', actual);
        return;
      }

      // targetTime = actual.startTime
      const targetTime = new Date(actual.startTime).getTime();
      
      // Validate date conversion
      if (isNaN(targetTime)) {
        console.warn('Invalid startTime in actual:', actual.startTime);
        return;
      }

      // Calculate cutoff: publishTime ≤ targetTime - horizon
      const maxPublishTime = targetTime - horizonMs;

      // Select forecasts where publishTime ≤ targetTime - horizon
      const validForecasts = forecasts.filter(f => {
        try {
          // Validate forecast has required fields
          if (!f.publishTime || !f.startTime) {
            return false;
          }

          // Check if this forecast is for our target time
          if (f.startTime !== actual.startTime) {
            return false;
          }

          // Parse publish time
          const publishTime = new Date(f.publishTime).getTime();
          
          // Validate date conversion
          if (isNaN(publishTime)) {
            return false;
          }

          // Check if published before cutoff
          return publishTime <= maxPublishTime;
        } catch (error) {
          console.error('Error filtering forecast:', error);
          return false;
        }
      });

      // If no valid forecast exists, return forecast = null
      if (validForecasts.length === 0) {
        processedData.push({
          time: actual.startTime,
          actual: actual.generation,
          forecast: null
        });
        return;
      }

      // From these forecasts choose the one with the most recent publishTime
      const latestForecast = validForecasts.reduce((latest, current) => {
        try {
          const latestTime = new Date(latest.publishTime).getTime();
          const currentTime = new Date(current.publishTime).getTime();
          return currentTime > latestTime ? current : latest;
        } catch {
          return latest;
        }
      });

      // Use that generation value as the forecast
      processedData.push({
        time: actual.startTime,
        actual: actual.generation,
        forecast: latestForecast.generation
      });

    } catch (error) {
      console.error('Error processing actual:', error, actual);
      // Don't crash - just skip this data point
    }
  });

  console.log(`Created ${processedData.length} processed data points`);

  // Calculate performance metrics dynamically from processed data
  const metrics = calculateMetrics(processedData);

  return { data: processedData, metrics };
}
