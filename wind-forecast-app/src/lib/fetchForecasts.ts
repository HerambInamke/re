import { ForecastDataPoint } from './types';

/**
 * Fetch wind generation forecast data from BMRS WINDFOR dataset.
 * 
 * The WINDFOR dataset provides wind generation forecasts with:
 * - startTime: The time period being forecasted
 * - publishTime: When the forecast was published
 * - generation: Forecasted generation in MW
 * 
 * @param startDate - Start date in format 'YYYY-MM-DD HH:MM'
 * @param endDate - End date in format 'YYYY-MM-DD HH:MM'
 * @returns Array of forecast data points
 */
export async function fetchForecasts(
  startDate: string,
  endDate: string
): Promise<ForecastDataPoint[]> {
  const url = `https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR?publishDateTimeFrom=${startDate}&publishDateTimeTo=${endDate}&format=json`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch forecasts: ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Map API response to our data structure using 'generation' field
  return json.data.map((item: any) => ({
    startTime: item.startTime,
    publishTime: item.publishTime,
    generation: item.generation || item.quantity || 0
  }));
}
