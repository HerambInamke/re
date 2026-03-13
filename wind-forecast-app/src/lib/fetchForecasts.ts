import { ForecastDataPoint } from './types';

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
  
  return json.data.map((item: any) => ({
    startTime: item.startTime,
    publishTime: item.publishTime,
    quantity: item.quantity
  }));
}
