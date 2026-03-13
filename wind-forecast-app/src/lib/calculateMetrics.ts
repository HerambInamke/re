import { ProcessedDataPoint, Metrics } from './types';

/**
 * Calculate comprehensive error metrics from processed data.
 * All metrics are computed dynamically from real data - no hardcoded values.
 * 
 * @param data - Processed data points with actual and forecast values
 * @returns Metrics object with MAE, RMSE, Median Error, P99 Error, and Bias
 */
export function calculateMetrics(data: ProcessedDataPoint[]): Metrics {
  // Filter to only data points where both actual and forecast exist
  const validPairs = data.filter(d => d.actual !== null && d.forecast !== null);
  
  // Return zero metrics if no valid pairs
  if (validPairs.length === 0) {
    return { 
      mae: 0, 
      rmse: 0, 
      medianError: 0, 
      p99Error: 0, 
      bias: 0,
      count: 0 
    };
  }

  // Calculate errors (absolute and signed)
  const absoluteErrors = validPairs.map(d => Math.abs(d.actual! - d.forecast!));
  const signedErrors = validPairs.map(d => d.forecast! - d.actual!);
  const squaredErrors = validPairs.map(d => Math.pow(d.actual! - d.forecast!, 2));

  // 1. Mean Absolute Error (MAE)
  // MAE = mean(|forecast - actual|)
  const mae = absoluteErrors.reduce((sum, e) => sum + e, 0) / absoluteErrors.length;
  
  // 2. Root Mean Square Error (RMSE)
  // RMSE = √(mean((forecast - actual)²))
  const rmse = Math.sqrt(squaredErrors.reduce((sum, e) => sum + e, 0) / squaredErrors.length);
  
  // 3. Median Error
  // Middle value of sorted absolute errors
  const sortedAbsErrors = [...absoluteErrors].sort((a, b) => a - b);
  const medianError = sortedAbsErrors.length % 2 === 0
    ? (sortedAbsErrors[sortedAbsErrors.length / 2 - 1] + sortedAbsErrors[sortedAbsErrors.length / 2]) / 2
    : sortedAbsErrors[Math.floor(sortedAbsErrors.length / 2)];

  // 4. P99 Error (99th percentile)
  // 99% of errors are below this value
  const p99Index = Math.ceil(sortedAbsErrors.length * 0.99) - 1;
  const p99Error = sortedAbsErrors[Math.max(0, Math.min(p99Index, sortedAbsErrors.length - 1))];

  // 5. Forecast Bias
  // bias = mean(forecast - actual)
  // Positive bias: forecasts tend to overestimate
  // Negative bias: forecasts tend to underestimate
  const bias = signedErrors.reduce((sum, e) => sum + e, 0) / signedErrors.length;

  return { 
    mae, 
    rmse, 
    medianError, 
    p99Error, 
    bias,
    count: validPairs.length 
  };
}
