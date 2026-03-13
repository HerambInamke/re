# Wind Power Forecast Monitoring Dashboard

A production-quality data visualization application that compares actual vs forecasted wind generation data in the United Kingdom.

## Features

- Real-time wind generation data from BMRS FUELHH dataset
- Wind forecast data from BMRS WINDFOR dataset
- Interactive date range selection (January 2024 data)
- Adjustable forecast horizon (0-48 hours)
- Time-series visualization with Recharts
- Performance metrics: MAE, RMSE, Median Error
- Responsive design for desktop and mobile

## Architecture

```
src/
├── app/
│   ├── api/
│   │   └── wind-data/
│   │       └── route.ts          # API endpoint for data fetching
│   ├── page.tsx                   # Main dashboard page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Chart.tsx                  # Time-series chart component
│   ├── DateRangePicker.tsx        # Date range selector
│   ├── HorizonSlider.tsx          # Forecast horizon slider
│   └── MetricsPanel.tsx           # Error metrics display
└── lib/
    ├── types.ts                   # TypeScript type definitions
    ├── fetchActuals.ts            # Fetch actual generation data
    ├── fetchForecasts.ts          # Fetch forecast data
    └── processForecasts.ts        # Forecast alignment logic
```

## Forecast Horizon Logic

For each target generation time, the system selects the most recent forecast where:
- `publishTime ≤ targetTime - forecastHorizon`

Example:
- Target time: 24 May 2024 18:00
- Horizon: 4 hours
- Uses forecast with publishTime ≤ 14:00 (latest available)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Deployment

This application is ready to deploy on Vercel:

```bash
vercel deploy
```

## Technologies

- Next.js 16 with App Router
- React 19 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- BMRS API for wind generation data
