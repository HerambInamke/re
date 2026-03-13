# Architecture Documentation

## System Overview

The Wind Power Forecast Monitoring Dashboard is built with a clean, modular architecture that separates concerns into distinct layers.

## Directory Structure

```
wind-forecast-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   └── wind-data/
│   │   │       └── route.ts      # API endpoint for data fetching
│   │   ├── page.tsx              # Main dashboard page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Chart.tsx             # Time-series visualization
│   │   ├── DateRangePicker.tsx   # Date selection control
│   │   ├── HorizonSlider.tsx     # Forecast horizon control
│   │   └── MetricsPanel.tsx      # Error metrics display
│   │
│   └── lib/                      # Business logic & utilities
│       ├── types.ts              # TypeScript type definitions
│       ├── fetchActuals.ts       # Fetch actual generation data
│       ├── fetchForecasts.ts     # Fetch forecast data
│       └── processForecasts.ts   # Forecast alignment logic
```

## Data Flow

1. User adjusts controls → State updates → Fetch button clicked
2. Frontend → GET /api/wind-data?startDate=...&endDate=...&horizon=...
3. API Route fetches data in parallel from BMRS APIs
4. processForecasts aligns forecasts with actuals based on horizon
5. API returns JSON → Frontend updates → Chart renders

## Key Algorithm: Forecast Horizon Selection

For each actual data point at targetTime:
1. Calculate maxPublishTime = targetTime - horizon
2. Find all forecasts for targetTime
3. Filter forecasts where publishTime ≤ maxPublishTime
4. Select forecast with latest publishTime
5. Pair with actual value

Example:
- Target: 2024-01-15 18:00
- Horizon: 4 hours
- Max publish: 2024-01-15 14:00
- Selects most recent forecast published before 14:00

## Component Responsibilities

- DateRangePicker: Date selection with validation
- HorizonSlider: Forecast horizon control (0-48h)
- Chart: Time-series visualization with Recharts
- MetricsPanel: Display MAE, RMSE, Median Error
- API Route: Orchestrate data fetching and processing
- fetchActuals/fetchForecasts: Call BMRS APIs
- processForecasts: Implement horizon logic and calculate metrics
