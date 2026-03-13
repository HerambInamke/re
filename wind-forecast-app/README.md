# Wind Power Forecast Monitoring Dashboard

A production-quality data visualization application that compares actual vs forecasted wind generation data in the United Kingdom using real-time BMRS (Balancing Mechanism Reporting Service) APIs.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Recharts](https://img.shields.io/badge/Recharts-2-8884d8)

## 🎯 Project Overview

This application provides real-time monitoring and analysis of wind power forecast accuracy in the UK. It fetches actual generation data and forecasts from BMRS APIs, intelligently matches them based on configurable forecast horizons, and calculates comprehensive error metrics.

### Key Features

- ✅ **Real-time Data**: Fetches live data from BMRS FUELHH and WINDFOR datasets
- ✅ **Dynamic Metrics**: All KPIs calculated from real data (no hardcoded values)
- ✅ **Three Screens**: Dashboard, Analysis, and About/Methodology
- ✅ **Interactive Controls**: Date range picker and forecast horizon slider (0-48h)
- ✅ **Comprehensive KPIs**: MAE, RMSE, Median Error, P99 Error, Forecast Bias
- ✅ **Error Analysis**: Distribution histogram, time-of-day patterns, horizon impact
- ✅ **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ✅ **Production Ready**: Optimized, tested, and deployable to Vercel

## 📊 Application Screens

### 1. Dashboard (/)
Main monitoring interface with:
- Date range selector (January 2024)
- Forecast horizon slider (0-48 hours)
- 6 KPI cards (MAE, RMSE, Median, P99, Bias, Count)
- Time-series chart (Actual vs Forecast)

### 2. Analysis (/analysis)
Detailed error analysis with:
- Error distribution histogram
- Error by time of day
- Error vs forecast horizon

### 3. About (/about)
Methodology documentation:
- Data sources explanation
- Forecast matching algorithm
- KPI calculation formulas
- Technology stack

## 🏗️ Architecture

### Project Structure

```
wind-forecast-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard screen
│   │   ├── analysis/page.tsx           # Analysis screen
│   │   ├── about/page.tsx              # About screen
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   └── api/
│   │       └── wind-data/
│   │           └── route.ts            # API endpoint
│   ├── components/
│   │   ├── Header.tsx                  # Navigation header
│   │   ├── ForecastChart.tsx           # Time-series chart
│   │   ├── DateRangePicker.tsx         # Date selector
│   │   ├── HorizonSlider.tsx           # Horizon control
│   │   ├── KpiCards.tsx                # Metrics display
│   │   └── ErrorAnalysisCharts.tsx     # Analysis charts
│   └── lib/
│       ├── types.ts                    # TypeScript types
│       ├── fetchActuals.ts             # Fetch actual data
│       ├── fetchForecasts.ts           # Fetch forecast data
│       ├── processForecasts.ts         # Forecast matching
│       └── calculateMetrics.ts         # KPI calculations
├── docs/                               # Documentation
├── public/                             # Static assets
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── tailwind.config.js                  # Tailwind config
└── next.config.ts                      # Next.js config
```

### Data Flow

```
User Request
    ↓
Frontend (React)
    ↓
API Route (/api/wind-data)
    ↓
Parallel Fetch (BMRS APIs)
    ├── FUELHH (Actuals)
    └── WINDFOR (Forecasts)
    ↓
Data Processing
    ├── Filter January 2024
    ├── Filter Horizon (0-48h)
    ├── Match Forecasts
    └── Calculate Metrics
    ↓
JSON Response
    ↓
Frontend Visualization
```

## 🔌 API Integration

### BMRS API Endpoints

**1. FUELHH Dataset (Actual Generation)**
```
https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH
```
- **Filter**: `fuelType=WIND`
- **Fields**: `startTime`, `generation`
- **Frequency**: 30-minute intervals

**2. WINDFOR Dataset (Forecasts)**
```
https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR
```
- **Fields**: `startTime`, `publishTime`, `generation`
- **Multiple forecasts per target time**

### Internal API Route

**Endpoint**: `GET /api/wind-data`

**Query Parameters**:
- `startDate` (required): Start date in format `YYYY-MM-DD HH:MM`
- `endDate` (required): End date in format `YYYY-MM-DD HH:MM`
- `horizon` (optional): Forecast horizon in hours (0-48, default: 24)

**Response Format**:
```json
{
  "data": [
    {
      "time": "2024-01-01T00:00:00Z",
      "actual": 5400,
      "forecast": 5200
    }
  ],
  "metrics": {
    "mae": 123.45,
    "rmse": 156.78,
    "medianError": 98.32,
    "p99Error": 345.67,
    "bias": -12.34,
    "count": 336
  }
}
```

**Performance Optimizations**:
- ✅ Parallel API fetching (actuals + forecasts)
- ✅ Server-side data processing
- ✅ Efficient filtering algorithms
- ✅ Client receives pre-processed data

### Forecast Matching Algorithm

For each actual generation data point:

1. Calculate `maxPublishTime = targetTime - horizonHours`
2. Find all forecasts where `forecast.startTime === targetTime`
3. Filter forecasts where `publishTime ≤ maxPublishTime`
4. Select forecast with most recent `publishTime`
5. If no valid forecast, set to `null` (gap in chart)

**Example**:
```
Target Time: 2024-01-15 18:00
Horizon: 4 hours
Max Publish: 14:00

Available Forecasts:
- 12:00 → 5100 MW ✓
- 13:30 → 5150 MW ✓ (selected - most recent)
- 15:00 → 5200 MW ✗ (too recent)

Result: 5150 MW
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Internet connection (for BMRS API access)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wind-forecast-app

# Install dependencies
npm install
```

### Running Locally

```bash
# Development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📦 Deployment to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework: Next.js
   - Root Directory: `wind-forecast-app`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

### Method 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL&project-name=wind-forecast-app&root-directory=wind-forecast-app)

### Environment Variables

No environment variables required - uses public BMRS APIs.

### Post-Deployment

- Production URL: `https://your-project.vercel.app`
- Automatic deployments on git push
- Preview deployments for pull requests

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with hooks
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization
- **date-fns** - Date manipulation

### Backend
- **Next.js API Routes** - Serverless functions
- **BMRS API** - UK energy data source

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Git** - Version control

## 📱 Responsive Design

### Mobile (< 640px)
- Single column layout
- Stacked controls
- Full-width charts
- Touch-friendly interactions

### Tablet (640px - 1024px)
- 2-column KPI cards
- Horizontal controls
- Optimized chart sizing

### Desktop (> 1024px)
- 3-column KPI cards
- Full horizontal layout
- Maximum width: 1280px
- Centered content

### Chart Responsiveness
All charts use `ResponsiveContainer` from Recharts:
```tsx
<ResponsiveContainer width="100%" height={320}>
  <LineChart data={data}>
    {/* Chart configuration */}
  </LineChart>
</ResponsiveContainer>
```

## 📈 KPI Metrics

All metrics are calculated dynamically from real data:

### 1. Mean Absolute Error (MAE)
```
MAE = Σ|forecast - actual| / n
```
Average magnitude of errors

### 2. Root Mean Square Error (RMSE)
```
RMSE = √(Σ(forecast - actual)² / n)
```
Penalizes larger errors more heavily

### 3. Median Error
```
Median = middle value of sorted |forecast - actual|
```
Robust to outliers

### 4. P99 Error
```
P99 = 99th percentile of |forecast - actual|
```
99% of errors are below this value

### 5. Forecast Bias
```
Bias = Σ(forecast - actual) / n
```
- Positive: Overestimating
- Negative: Underestimating
- Zero: Unbiased

### 6. Data Points Count
Number of valid forecast-actual pairs

## 🤖 AI Tools Used During Development

This project was developed with assistance from AI tools:

### Kiro AI Assistant
- **Architecture Design**: Helped structure the modular component architecture
- **Code Generation**: Generated boilerplate code for components and utilities
- **Algorithm Implementation**: Assisted with forecast matching logic
- **Documentation**: Created comprehensive documentation files
- **Testing Strategy**: Suggested test cases and validation approaches
- **Best Practices**: Recommended TypeScript patterns and React optimizations

### Development Workflow
1. **Planning**: AI helped outline project structure and requirements
2. **Implementation**: AI generated initial code with human review and refinement
3. **Testing**: AI suggested edge cases and test scenarios
4. **Documentation**: AI created detailed documentation with human editing
5. **Optimization**: AI recommended performance improvements

### Human Oversight
- All AI-generated code was reviewed and tested
- Business logic validated against requirements
- UI/UX decisions made by human developers
- Final deployment and configuration managed manually

## 📚 Documentation

Comprehensive documentation available in `/docs`:

- **API_REFERENCE.md** - API endpoint documentation
- **ARCHITECTURE.md** - System architecture details
- **DATA_SPECIFICATION.md** - Data sources and filtering rules
- **DEPLOYMENT.md** - Deployment instructions
- **METRICS_CALCULATION.md** - KPI calculation formulas
- **SCREENS.md** - Screen layouts and features
- **TESTING_GUIDE.md** - Testing strategies
- **UI_COMPONENTS.md** - Component documentation

## 🔍 Data Sources

### BMRS (Balancing Mechanism Reporting Service)
- **Provider**: Elexon
- **License**: Open Government License
- **Documentation**: https://bmrs.elexon.co.uk/api-documentation
- **Data Range**: January 2024 (configurable)

### Attribution
Data provided by Elexon BMRS. This application uses publicly available data for educational and analytical purposes.

## 🐛 Troubleshooting

### No Data Showing
- Verify date range is in January 2024
- Check internet connection
- Verify BMRS API is accessible

### Slow Loading
- Use smaller date ranges (1-7 days recommended)
- Check network speed
- Verify API response times

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding data caching (Redis/memory)
- Implementing rate limiting
- Adding comprehensive test suite
- Setting up CI/CD pipeline
- Adding monitoring and logging

## 📄 License

See [LICENSE](../LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Deploy to see live version]
- **Documentation**: `/docs` folder
- **BMRS API**: https://bmrs.elexon.co.uk/
- **Elexon**: https://www.elexon.co.uk/

## 📞 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review troubleshooting section
3. Check BMRS API status
4. Review Next.js documentation

---

**Built with Next.js, TypeScript, and Tailwind CSS**  
**Data provided by Elexon BMRS**
