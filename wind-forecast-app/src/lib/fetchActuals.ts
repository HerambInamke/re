import { ActualDataPoint } from './types';

/**
 * Fetch actual wind generation data from BMRS FUELHH dataset.
 * 
 * The FUELHH dataset provides half-hourly actual generation data by fuel type.
 * We filter for WIND fuel type to get actual wind generation.
 * 
 * @param startDate - Start date in format 'YYYY-MM-DD HH:MM'
 * @param endDate - End date in format 'YYYY-MM-DD HH:MM'
 * @returns Array of actual wind generation data points
 */
export async function fetchActuals(
  startDate: string,
  endDate: string
): Promise<ActualDataPoint[]> {
  const url = `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH?publishDateTimeFrom=${startDate}&publishDateTimeTo=${endDate}&fuelType=WIND&format=json`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch actuals: ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Map API response to our data structure using 'generation' field
  return json.data.map((item: any) => ({
    startTime: item.startTime,
    generation: item.generation || item.quantity || 0
  }));
}
