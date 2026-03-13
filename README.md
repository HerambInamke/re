# Wind Power Forecast Monitoring Dashboard

A production-quality data visualization application that compares actual vs forecasted wind generation data in the United Kingdom using BMRS (Balancing Mechanism Reporting Service) APIs.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Recharts](https://img.shields.io/badge/Recharts-2-8884d8)

## Features

✅ Real-time wind generation data from BMRS FUELHH dataset  
✅ Wind forecast data from BMRS WINDFOR dataset  
✅ Interactive date range selection (January 2024 data)  
✅ Adjustable forecast horizon (0-48 hours)  
✅ Time-series visualization with Recharts  
✅ Performance metrics: MAE, RMSE, Median Error  
✅ Responsive design for desktop and mobile  
✅ Clean modular architecture  
✅ TypeScript for type safety  
✅ Production-ready and Vercel-deployable  

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── api/wind-data/route.ts    # API endpoint
│   └── page.tsx                   # Main dashboard
├── components/
│   ├── Chart.tsx                  # Time-series chart
│   ├── DateRangePicker.tsx        # Date selector
│   ├── HorizonSlider.tsx          # Horizon control
│   └── MetricsPanel.tsx           # Metrics display
└── lib/
    ├── types.ts                   # Type definitions
    ├── fetchActuals.ts            # Fetch actuals
    ├── fetchForecasts.ts          # Fetch forecasts
    └── processForecasts.ts        # Alignment logic
```

## How It Works

### Forecast Horizon Logic

For each target generation time, the system selects the most recent forecast where:

```
publishTime ≤ targetTime - forecastHorizon
```

**Example:**
- Target time: 24 May 2024 18:00
- Horizon: 4 hours
- Uses forecast with publishTime ≤ 14:00 (latest available)

### Data Processing Pipeline

1. Fetch actual and forecast data in parallel from BMRS APIs
2. Filter forecasts to 0-48 hour horizon range
3. Group forecasts by target time
4. For each actual, select most recent valid forecast
5. Calculate error metrics (MAE, RMSE, Median)
6. Return aligned data for visualization

## API Endpoint

### GET /api/wind-data

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD HH:MM)
- `endDate` - End date (YYYY-MM-DD HH:MM)
- `horizon` - Forecast horizon in hours (0-48)

**Response:**
```json
{
  "data": [
    {
      "time": "2024-01-01T00:00:00Z",
      "actual": 5234.5,
      "forecast": 5180.2
    }
  ],
  "metrics": {
    "mae": 123.45,
    "rmse": 156.78,
    "medianError": 98.32
  }
}
```

## Build & Deploy

### Local Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- [PROJECT_README.md](./PROJECT_README.md) - Detailed project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - User guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Recharts** - Data visualization
- **BMRS API** - UK energy data

## Data Sources

- **FUELHH Dataset** - Half-hourly actual generation by fuel type
- **WINDFOR Dataset** - Wind generation forecasts

API Documentation: https://data.elexon.co.uk/bmrs/

## License

See [LICENSE](../LICENSE) file for details.

## Contributing

This is a demonstration project. For personal use.