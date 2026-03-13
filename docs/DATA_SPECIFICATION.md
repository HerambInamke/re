# Data Specification

## Overview

This document specifies the data requirements, filtering rules, and processing logic for the Wind Power Forecast Monitoring Dashboard.

## Data Sources

### 1. BMRS FUELHH Dataset (Actual Generation)

**Purpose**: Half-hourly actual wind generation data for the United Kingdom

**API Endpoint**:
```
https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH
```

**Required Parameters**:
- `publishDateTimeFrom`: Start date in format `YYYY-MM-DD HH:MM`
- `publishDateTimeTo`: End date in format `YYYY-MM-DD HH:MM`
- `fuelType`: `WIND` (filter for wind generation only)
- `format`: `json`

**Response Fields**:
| Field | Type | Description | Unit |
|-------|------|-------------|------|
| `startTime` | string | Timestamp of generation period | ISO 8601 |
| `generation` | number | Actual wind power generation | MW |

**Data Frequency**: 30-minute intervals

**Example Response**:
```json
{
  "data": [
    {
      "startTime": "2024-01-01T00:00:00Z",
      "generation": 5234.5
    },
    {
      "startTime": "2024-01-01T00:30:00Z",
      "generation": 5312.8
    }
  ]
}
```

### 2. BMRS WINDFOR Dataset (Forecasts)

**Purpose**: Wind generation forecasts for the United Kingdom

**API Endpoint**:
```
https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR
```

**Required Parameters**:
- `publishDateTimeFrom`: Start date in format `YYYY-MM-DD HH:MM`
- `publishDateTimeTo`: End date in format `YYYY-MM-DD HH:MM`
- `format`: `json`

**Response Fields**:
| Field | Type | Description | Unit |
|-------|------|-------------|------|
| `startTime` | string | Target generation time being forecasted | ISO 8601 |
| `publishTime` | string | When the forecast was published | ISO 8601 |
| `generation` | number | Forecasted wind generation | MW |

**Data Frequency**: Multiple forecasts per target time with varying publish times

**Example Response**:
```json
{
  "data": [
    {
      "startTime": "2024-01-01T18:00:00Z",
      "publishTime": "2024-01-01T12:00:00Z",
      "generation": 5180.2
    },
    {
      "startTime": "2024-01-01T18:00:00Z",
      "publishTime": "2024-01-01T13:30:00Z",
      "generation": 5245.6
    },
    {
      "startTime": "2024-01-01T18:00:00Z",
      "publishTime": "2024-01-01T15:00:00Z",
      "generation": 5301.4
    }
  ]
}
```

## Data Filtering Rules

### Date Range Requirement

**Mandatory Filter**: January 2024 only

```
Start Date: 2024-01-01 00:00
End Date: 2024-01-31 23:59
```

**Rationale**: 
- Ensures consistent data availability
- Provides sufficient data for analysis (31 days)
- Avoids incomplete or missing data from other periods

### Forecast Horizon Filter

**Definition**:
```
horizon = startTime - publishTime
```

**Valid Range**: 0 to 48 hours

**Filter Logic**:
```typescript
const horizonMs = new Date(startTime) - new Date(publishTime);
const horizonHours = horizonMs / (1000 * 60 * 60);
const isValid = horizonHours >= 0 && horizonHours <= 48;
```

**Rationale**:
- 0 hours: Near real-time forecasts
- 48 hours: Maximum useful forecast horizon for wind generation
- Negative horizons: Invalid (forecast published after target time)
- > 48 hours: Too far ahead, typically less accurate

## Forecast Matching Logic

### Algorithm

For each actual generation data point:

1. **Identify Target Time**
   ```typescript
   const targetTime = actual.startTime;
   ```

2. **Calculate Maximum Publish Time**
   ```typescript
   const maxPublishTime = new Date(targetTime).getTime() - (horizonHours * 60 * 60 * 1000);
   ```

3. **Find Candidate Forecasts**
   ```typescript
   const candidates = forecasts.filter(f => f.startTime === targetTime);
   ```

4. **Filter by Horizon**
   ```typescript
   const validForecasts = candidates.filter(f => {
     return new Date(f.publishTime).getTime() <= maxPublishTime;
   });
   ```

5. **Select Most Recent**
   ```typescript
   const selectedForecast = validForecasts.reduce((latest, current) => {
     return new Date(current.publishTime) > new Date(latest.publishTime) 
       ? current 
       : latest;
   });
   ```

6. **Handle Missing Forecasts**
   ```typescript
   const forecastValue = validForecasts.length > 0 
     ? selectedForecast.generation 
     : null;
   ```

### Example Scenario

**Given**:
- Target Time: `2024-01-15 18:00`
- User-selected Horizon: `4 hours`
- Available Forecasts for 18:00:
  - Published at `12:00` → generation: 5100 MW
  - Published at `13:30` → generation: 5150 MW
  - Published at `15:00` → generation: 5200 MW

**Calculation**:
```
maxPublishTime = 18:00 - 4 hours = 14:00
```

**Valid Forecasts**:
- `12:00` ✓ (before 14:00)
- `13:30` ✓ (before 14:00)
- `15:00` ✗ (after 14:00)

**Selected Forecast**: `13:30` (most recent valid)
**Result**: 5150 MW

## Data Processing Pipeline

### Step 1: Data Fetching
```
Parallel Requests:
├── FUELHH API → Actual Generation Data
└── WINDFOR API → Forecast Data
```

### Step 2: Data Validation
```
Validate:
├── Date range within January 2024
├── Required fields present
├── Numeric values valid
└── Timestamps parseable
```

### Step 3: Forecast Filtering
```
Filter forecasts where:
└── 0 ≤ (startTime - publishTime) ≤ 48 hours
```

### Step 4: Data Alignment
```
For each actual:
├── Find matching forecasts (same startTime)
├── Filter by horizon (publishTime ≤ targetTime - horizon)
├── Select most recent valid forecast
└── Create aligned data point
```

### Step 5: Metrics Calculation
```
Calculate:
├── MAE = Σ|actual - forecast| / n
├── RMSE = √(Σ(actual - forecast)² / n)
└── Median = middle value of sorted errors
```

## Data Quality Considerations

### Missing Data Handling

**Scenario**: No valid forecast for a target time
**Action**: Set forecast value to `null`
**Impact**: 
- Data point still plotted for actual value
- Forecast line shows gap
- Excluded from metrics calculation

### Outlier Detection

**Not Implemented**: No outlier filtering applied
**Rationale**: 
- Wind generation naturally varies widely
- All BMRS data assumed accurate
- Preserves data integrity

### Data Completeness

**Expected Coverage**:
- Actuals: ~1,488 data points (31 days × 48 half-hours)
- Forecasts: Variable (multiple per target time)

**Minimum Requirements**:
- At least 1 actual data point required
- Forecasts optional (can be all null)

## Performance Specifications

### Data Volume

**Typical Request** (7 days):
- Actuals: ~336 data points
- Forecasts: ~5,000-10,000 data points (before filtering)
- Processed: ~336 aligned data points

**Maximum Request** (31 days):
- Actuals: ~1,488 data points
- Forecasts: ~20,000-40,000 data points (before filtering)
- Processed: ~1,488 aligned data points

### Processing Time

| Operation | Time | Complexity |
|-----------|------|------------|
| API Fetch (parallel) | 2-4s | O(1) |
| Forecast Filtering | <100ms | O(n) |
| Data Alignment | <200ms | O(n×m) |
| Metrics Calculation | <50ms | O(n) |
| **Total** | **2-5s** | **O(n×m)** |

Where:
- n = number of actual data points
- m = average forecasts per target time

## Data Retention

**Application**: No data stored (stateless)
**BMRS API**: Historical data available indefinitely
**Caching**: Not implemented (can be added)

## Compliance

**Data Source**: Public BMRS API
**License**: Open Government License
**Attribution**: Data provided by Elexon BMRS
**Usage**: No restrictions for non-commercial use
