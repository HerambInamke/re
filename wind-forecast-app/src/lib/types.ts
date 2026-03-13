// Type definitions for wind forecast data

export interface ActualDataPoint {
  startTime: string;
  generation: number;
}

export interface ForecastDataPoint {
  startTime: string;
  publishTime: string;
  generation: number;
}

export interface ProcessedDataPoint {
  time: string;
  actual: number | null;
  forecast: number | null;
}

export interface Metrics {
  mae: number;
  rmse: number;
  medianError: number;
  p99Error: number;
  bias: number;
  count: number;
}

export interface WindDataResponse {
  data: ProcessedDataPoint[];
  metrics: Metrics;
}
