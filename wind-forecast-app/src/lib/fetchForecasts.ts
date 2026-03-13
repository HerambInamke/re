import { ForecastDataPoint } from './types';

/**
 * Fetch wind generation forecast data from BMRS WINDFOR dataset.
 * 
 * The WINDFOR dataset provides wind generation forecasts with:
 * - startTime: The time period being forecasted
 * - publishTime: When the forecast was published
 * - quantity: Forecasted generation in MW
 * 
 * @param startDate - Start date in format 'YYYY-MM-DD HH:MM'
 * @param endDate - End date in format 'YYYY-MM-DD HH:MM'
 * @returns Array of forecast data points
 */
export async function fetchForecasts(
  startDate: string,
  endDate: string
): Promise<ForecastDataPoint[]> {
  // Format dates for BMRS API (URL encode spaces)
  const formattedStart = encodeURIComponent(startDate);
  const formattedEnd = encodeURIComponent(endDate);
  
  const url = `https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR?publishDateTimeFrom=${formattedStart}&publishDateTimeTo=${formattedEnd}&format=json`;
  
  console.log('Fetching forecasts from:', url);
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('BMRS API Error (Forecasts):', response.status, errorText);
    throw new Error(`Failed to fetch forecasts: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  console.log('Forecasts response sample:', json.data?.[0]);
  
  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('Invalid response format from BMRS WINDFOR API');
  }
  
  // Map API response to our data structure
  // BMRS uses 'quantity' field for generation values
  return json.data.map((item: any) => ({
    startTime: item.startTime,
    publishTime: item.publishTime,
    generation: Number(item.quantity) || 0
  }));
}
