import { ActualDataPoint } from './types';

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
  
  return json.data.map((item: any) => ({
    startTime: item.startTime,
    quantity: item.quantity
  }));
}
