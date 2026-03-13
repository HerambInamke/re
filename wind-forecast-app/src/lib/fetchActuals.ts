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
  // Format dates for BMRS API (URL encode spaces)
  const formattedStart = encodeURIComponent(startDate);
  const formattedEnd = encodeURIComponent(endDate);
  
  const url = `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH?publishDateTimeFrom=${formattedStart}&publishDateTimeTo=${formattedEnd}&fuelType=WIND&format=json`;
  
  console.log('Fetching actuals from:', url);
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('BMRS API Error (Actuals):', response.status, errorText);
    throw new Error(`Failed to fetch actuals: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  console.log('Actuals response sample:', json.data?.[0]);
  
  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('Invalid response format from BMRS FUELHH API');
  }
  
  // Map API response to our data structure
  // BMRS uses 'quantity' field, not 'generation'
  return json.data.map((item: any) => ({
    startTime: item.startTime,
    generation: Number(item.quantity) || 0
  }));
}
