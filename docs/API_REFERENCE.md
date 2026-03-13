# API Reference

## Overview

The Wind Power Forecast Monitoring Dashboard uses a single API endpoint to fetch and process wind generation data from BMRS datasets.

## Endpoint

### GET /api/wind-data

Fetches actual and forecast wind generation data, processes them according to the forecast horizon logic, and returns merged data with performance metrics.

#### Base URL
```
http://localhost:3000/api/wind-data (development)
https://your-app.vercel.app/api/wind-data (production)
```

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `startDate` | string | Yes | Start date and time | `2024-01-01 00:00` |
| `endDate` | string | Yes | End date and time | `2024-01-07 23:59` |
| `horizon` | number | No | Forecast horizon in hours (0-48) | `24` |

#### Request Example

```bash
GET /api/wind-data?startDate=2024-01-01%2000:00&endDate=2024-01-07%2023:59&horizon=24
```

#### Response Format

```typescript
{
  data: ProcessedDataPoint[];
  metrics: Metrics;
}
```

#### Response Example

```json
{
  "data": [
    {
      "time": "2024-01-01T00:00:00Z",
      "actual": 5234.5,
      "forecast": 5180.2
    },
    {
      "time": "2024-01-01T00:30:00Z",
      "actual": 5312.8,
      "forecast": 5245.6
    },
    {
      "time": "2024-01-01T01:00:00Z",
      "actual": 5401.2,
      "forecast": null
    }
  ],
  "metrics": {
    "mae": 123.45,
    "rmse": 156.78,
    "medianError": 98.32
  }
}
```

#### Response Fields

**ProcessedDataPoint**
- `time` (string): ISO 8601 timestamp of the generation period
- `actual` (number | null): Actual wind generation in MW
- `forecast` (number | null): Forecasted generation in MW (null if no valid forecast)

**Metrics**
- `mae` (number): Mean Absolute Error in MW
- `rmse` (number): Root Mean Square Error in MW
- `medianError` (number): Median Error in MW

#### Error Responses

**400 Bad Request**
```json
{
  "error": "startDate and endDate are required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch wind data"
}
```

## Data Sources

### BMRS FUELHH Dataset

**Purpose**: Actual wind generation data

**Endpoint**: `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH`

**Parameters**:
- `publishDateTimeFrom`: Start date
- `publishDateTimeTo`: End date
- `fuelType`: WIND
- `format`: json

**Fields Used**:
- `startTime`: Timestamp of generation (30-minute intervals)
- `generation`: Wind power generation in MW

**Documentation**: https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream

### BMRS WINDFOR Dataset

**Purpose**: Wind generation forecasts

**Endpoint**: `https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR`

**Parameters**:
- `publishDateTimeFrom`: Start date
- `publishDateTimeTo`: End date
- `format`: json

**Fields Used**:
- `startTime`: Generation target time
- `publishTime`: When forecast was created
- `generation`: Forecasted wind generation in MW

**Documentation**: https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream

## Data Processing Logic

### Forecast Horizon Calculation

```
horizon = startTime - publishTime
```

### Forecast Selection Algorithm

For each actual data point at `targetTime`:

1. Calculate `maxPublishTime = targetTime - horizonHours`
2. Find all forecasts where `forecast.startTime === targetTime`
3. Filter forecasts where `publishTime ≤ maxPublishTime`
4. Select forecast with the most recent `publishTime`
5. If no valid forecast exists, set forecast to `null`

### Metrics Calculation

**Mean Absolute Error (MAE)**
```
MAE = Σ|actual - forecast| / n
```

**Root Mean Square Error (RMSE)**
```
RMSE = √(Σ(actual - forecast)² / n)
```

**Median Error**
```
Median = middle value of sorted |actual - forecast|
```

## Rate Limiting

The BMRS API may have rate limits. Consider implementing:
- Request caching
- Exponential backoff
- Request throttling

## Error Handling

The API handles errors gracefully:
- Network errors: Returns 500 with error message
- Invalid parameters: Returns 400 with validation error
- Empty datasets: Returns empty data array with zero metrics

## Usage Examples

### JavaScript/TypeScript

```typescript
async function fetchWindData(
  startDate: string,
  endDate: string,
  horizon: number = 24
) {
  const params = new URLSearchParams({
    startDate,
    endDate,
    horizon: horizon.toString()
  });

  const response = await fetch(`/api/wind-data?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch wind data');
  }

  return await response.json();
}

// Usage
const data = await fetchWindData('2024-01-01 00:00', '2024-01-07 23:59', 24);
console.log(data.metrics.mae);
```

### cURL

```bash
curl "http://localhost:3000/api/wind-data?startDate=2024-01-01%2000:00&endDate=2024-01-07%2023:59&horizon=24"
```

### Python

```python
import requests

def fetch_wind_data(start_date, end_date, horizon=24):
    params = {
        'startDate': start_date,
        'endDate': end_date,
        'horizon': horizon
    }
    
    response = requests.get(
        'http://localhost:3000/api/wind-data',
        params=params
    )
    
    response.raise_for_status()
    return response.json()

# Usage
data = fetch_wind_data('2024-01-01 00:00', '2024-01-07 23:59', 24)
print(f"MAE: {data['metrics']['mae']}")
```

## Performance Considerations

- Data fetching is parallelized (actuals and forecasts fetched simultaneously)
- Processing is done in-memory with O(n) complexity
- Typical response time: 2-5 seconds for 7 days of data
- Consider implementing caching for frequently requested date ranges

## Future Enhancements

- Add pagination for large datasets
- Implement response caching
- Add WebSocket support for real-time updates
- Support multiple regions/countries
- Add data export endpoints (CSV, JSON)
