import { ActualDataPoint, ForecastDataPoint, ProcessedDataPoint, Metrics } from './types';

/**
 * Process and align forecast data with actual generation data based on forecast horizon.
 * 
 * Forecast Horizon Logic:
 * For each target generation time (startTime), select the most recent forecast where:
 * publishTime ≤ targetTime - forecastHorizon
 * 
 * Example:
 * - targetTime = 24 May 2024 18:00
 * - horizon = 4 hours
 * - Use forecast with publishTime ≤ 14:00 (choose the latest one available)
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
  // Step 1: Filter forecasts to only include those within 0-48 hour horizon range
  const filteredForecasts = forecasts.filter(f => {
    const publishTime = new Date(f.publishTime).getTime();
    const startTime = new Date(f.startTime).getTime();
    const horizonMs = startTime - publishTime;
    const horizonHoursCalc = horizonMs / (1000 * 60 * 60);
    return horizonHoursCalc >= 0 && horizonHoursCalc <= 48;
  });

  // Step 2: Create a map of actuals by time for quick lookup
  const actualsMap = new Map<string, number>();
  actuals.forEach(a => {
    actualsMap.set(a.startTime, a.quantity);
  });

  // Step 3: Group forecasts by their target time (startTime)
  // This allows us to find all forecasts that predict a specific time
  const forecastsByTarget = new Map<string, ForecastDataPoint[]>();
  filteredForecasts.forEach(f => {
    if (!forecastsByTarget.has(f.startTime)) {
      forecastsByTarget.set(f.startTime, []);
    }
    forecastsByTarget.get(f.startTime)!.push(f);
  });

  // Step 4: Process each actual data point and find matching forecast
  const processedData: ProcessedDataPoint[] = [];
  const errors: number[] = [];

  actuals.forEach(actual => {
    const targetTime = new Date(actual.startTime).getTime();
    // Calculate the maximum publish time based on horizon
    // If horizon is 4 hours and target is 18:00, max publish time is 14:00
    const maxPublishTime = targetTime - (horizonHours * 60 * 60 * 1000);

    // Step 5: Find all forecasts for this target time
    const candidateForecasts = forecastsByTarget.get(actual.startTime) || [];
    
    // Step 6: Filter to only forecasts published before the horizon cutoff
    const validForecasts = candidateForecasts.filter(f => {
      const publishTime = new Date(f.publishTime).getTime();
      return publishTime <= maxPublishTime;
    });

    // Step 7: Select the most recent valid forecast (latest publishTime)
    let selectedForecast: ForecastDataPoint | null = null;
    if (validForecasts.length > 0) {
      selectedForecast = validForecasts.reduce((latest, current) => {
        return new Date(current.publishTime) > new Date(latest.publishTime) ? current : latest;
      });
    }

    processedData.push({
      time: actual.startTime,
      actual: actual.quantity,
      forecast: selectedForecast ? selectedForecast.quantity : null
    });

    // Calculate error if forecast exists
    if (selectedForecast) {
      errors.push(Math.abs(actual.quantity - selectedForecast.quantity));
    }
  });

  // Calculate metrics
  const metrics = calculateMetrics(processedData);

  return { data: processedData, metrics };
}

function calculateMetrics(data: ProcessedDataPoint[]): Metrics {
  const validPairs = data.filter(d => d.actual !== null && d.forecast !== null);
  
  if (validPairs.length === 0) {
    return { mae: 0, rmse: 0, medianError: 0 };
  }

  const errors = validPairs.map(d => Math.abs(d.actual! - d.forecast!));
  const squaredErrors = validPairs.map(d => Math.pow(d.actual! - d.forecast!, 2));

  const mae = errors.reduce((sum, e) => sum + e, 0) / errors.length;
  const rmse = Math.sqrt(squaredErrors.reduce((sum, e) => sum + e, 0) / squaredErrors.length);
  
  const sortedErrors = [...errors].sort((a, b) => a - b);
  const medianError = sortedErrors.length % 2 === 0
    ? (sortedErrors[sortedErrors.length / 2 - 1] + sortedErrors[sortedErrors.length / 2]) / 2
    : sortedErrors[Math.floor(sortedErrors.length / 2)];

  return { mae, rmse, medianError };
}
