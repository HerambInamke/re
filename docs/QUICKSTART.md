# Quick Start Guide

Get the Wind Power Forecast Monitoring Dashboard running in 3 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

```bash
# Navigate to project directory
cd wind-forecast-app

# Install dependencies
npm install
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the Dashboard

1. **Select Date Range**
   - Default: January 1-7, 2024
   - Click date inputs to change range
   - Use January 2024 data for best results

2. **Adjust Forecast Horizon**
   - Drag slider from 0 to 48 hours
   - Default: 24 hours
   - Shows how far ahead forecasts were made

3. **Update Data**
   - Click "Update Data" button
   - Wait for data to load
   - View chart and metrics

## Understanding the Chart

- **Blue Line**: Actual wind generation (MW)
- **Green Line**: Forecasted generation (MW)
- **Gaps**: Missing forecast data (not plotted)
- **X-axis**: Time (date and hour)
- **Y-axis**: Generation in Megawatts

## Understanding Metrics

- **MAE**: Average forecast error
- **RMSE**: Root mean square error (penalizes large errors)
- **Median Error**: Middle value of all errors

## Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

## Troubleshooting

**No data showing?**
- Check date range is in January 2024
- Verify internet connection
- Check browser console for errors

**Slow loading?**
- Use smaller date ranges (1-7 days)
- Check BMRS API status

**Build errors?**
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

## Next Steps

- Read [USAGE_GUIDE.md](./USAGE_GUIDE.md) for detailed usage
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options

## Support

For issues with:
- Application: Check documentation files
- BMRS API: Visit https://data.elexon.co.uk/bmrs/
- Next.js: Visit https://nextjs.org/docs
