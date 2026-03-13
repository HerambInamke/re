# Application Screens Documentation

## Overview

The Wind Power Forecast Monitoring Dashboard consists of three main screens, each serving a specific purpose in the analysis workflow.

## Screen Architecture

```
Application
├── Dashboard (/)
│   ├── Header
│   ├── Controls Panel
│   ├── KPI Cards
│   └── Forecast Chart
├── Analysis (/analysis)
│   ├── Header
│   ├── Controls Panel
│   └── Error Analysis Charts
└── About (/about)
    ├── Header
    └── Methodology Content
```

## 1. Forecast Monitoring Dashboard

**Route:** `/`

**Purpose:** Main monitoring interface for real-time forecast vs actual comparison

### Layout Structure

```
┌─────────────────────────────────────────┐
│           Header (Navigation)            │
├─────────────────────────────────────────┤
│  Page Title & Description                │
├─────────────────────────────────────────┤
│  Controls Panel                          │
│  ├── Date Range Picker                   │
│  ├── Horizon Slider                      │
│  └── Update Button                       │
├─────────────────────────────────────────┤
│  KPI Cards (4-column grid)               │
│  ├── MAE    ├── RMSE                     │
│  ├── Median ├── Data Points              │
├─────────────────────────────────────────┤
│  Main Forecast Chart                     │
│  (Actual vs Forecast Time Series)        │
└─────────────────────────────────────────┘
```

### Components Used

- `Header` - Navigation
- `DateRangePicker` - Date selection
- `HorizonSlider` - Horizon control
- `KpiCards` - Metrics display
- `ForecastChart` - Main visualization

### Features

1. **Date Range Selection**
   - Default: January 1-7, 2024
   - HTML5 datetime-local inputs
   - Validates date range

2. **Forecast Horizon Control**
   - Slider: 0-48 hours
   - Real-time value display
   - Updates on drag

3. **KPI Summary**
   - Mean Absolute Error (MAE)
   - Root Mean Square Error (RMSE)
   - Median Error
   - Total Data Points

4. **Time Series Chart**
   - Blue line: Actual generation
   - Green line: Forecast generation
   - Interactive tooltips
   - Responsive sizing
   - Gaps for missing forecasts

### User Workflow

1. User lands on dashboard
2. Data loads automatically with defaults
3. User adjusts date range or horizon
4. User clicks "Update Data"
5. Chart and metrics refresh

### States

**Loading:**
- Spinner displayed
- Button disabled
- Previous data remains visible

**Error:**
- Red error banner
- Error message displayed
- Previous data remains visible

**No Data:**
- Yellow warning banner
- Helpful message
- Suggests adjusting filters

**Success:**
- Chart displays
- Metrics calculated
- All controls enabled

---

## 2. Forecast Accuracy Analysis

**Route:** `/analysis`

**Purpose:** Detailed error analysis and forecast performance insights

### Layout Structure

```
┌─────────────────────────────────────────┐
│           Header (Navigation)            │
├─────────────────────────────────────────┤
│  Page Title & Description                │
├─────────────────────────────────────────┤
│  Controls Panel                          │
│  ├── Date Range Picker                   │
│  ├── Horizon Slider                      │
│  └── Update Analysis Button              │
├─────────────────────────────────────────┤
│  Error Distribution Histogram            │
│  (Bar chart showing error frequency)     │
├─────────────────────────────────────────┤
│  Error by Time of Day                    │
│  (Line chart showing hourly patterns)    │
├─────────────────────────────────────────┤
│  Error vs Forecast Horizon               │
│  (Line chart showing horizon impact)     │
└─────────────────────────────────────────┘
```

### Components Used

- `Header` - Navigation
- `DateRangePicker` - Date selection
- `HorizonSlider` - Horizon control
- `ErrorAnalysisCharts` - Analysis visualizations

### Features

1. **Error Distribution Histogram**
   - Shows frequency of error magnitudes
   - 10 equal-width bins
   - Blue bars
   - Identifies error patterns

2. **Error by Time of Day**
   - Average error for each hour (0-23)
   - Green line chart
   - Reveals daily patterns
   - Helps identify peak error times

3. **Error vs Forecast Horizon**
   - Shows how error changes with horizon
   - Purple line chart
   - 9 data points (0h to 48h)
   - Validates forecast degradation

### User Workflow

1. User navigates to Analysis page
2. Data loads with same defaults as Dashboard
3. User explores three analysis charts
4. User adjusts filters to analyze different periods
5. User clicks "Update Analysis"
6. Charts refresh with new data

### Insights Provided

- **Distribution:** Are errors normally distributed?
- **Time Patterns:** When are forecasts least accurate?
- **Horizon Impact:** How does accuracy degrade over time?

---

## 3. About / Methodology

**Route:** `/about`

**Purpose:** Educational content explaining methodology and data sources

### Layout Structure

```
┌─────────────────────────────────────────┐
│           Header (Navigation)            │
├─────────────────────────────────────────┤
│  Page Title & Description                │
├─────────────────────────────────────────┤
│  Overview Section                        │
├─────────────────────────────────────────┤
│  Data Sources Section                    │
│  ├── FUELHH Dataset                      │
│  └── WINDFOR Dataset                     │
├─────────────────────────────────────────┤
│  Forecast Matching Logic                 │
│  ├── Horizon Definition                  │
│  ├── Selection Algorithm                 │
│  └── Example Scenario                    │
├─────────────────────────────────────────┤
│  KPI Calculations                        │
│  ├── MAE Formula                         │
│  ├── RMSE Formula                        │
│  └── Median Error Formula                │
├─────────────────────────────────────────┤
│  Data Filtering Rules                    │
├─────────────────────────────────────────┤
│  Technology Stack                        │
├─────────────────────────────────────────┤
│  Attribution                             │
└─────────────────────────────────────────┘
```

### Components Used

- `Header` - Navigation
- Static content sections

### Content Sections

1. **Overview**
   - Application purpose
   - Data source summary
   - Use case description

2. **Data Sources**
   - BMRS FUELHH details
   - BMRS WINDFOR details
   - API documentation links
   - Field descriptions

3. **Forecast Matching Logic**
   - Horizon definition
   - Step-by-step algorithm
   - Visual example with calculations
   - Edge case handling

4. **KPI Calculations**
   - MAE formula and explanation
   - RMSE formula and explanation
   - Median Error formula and explanation
   - When to use each metric

5. **Data Filtering Rules**
   - Date range requirements
   - Horizon range limits
   - Rationale for filters

6. **Technology Stack**
   - Frontend technologies
   - Backend technologies
   - Libraries and frameworks

7. **Attribution**
   - Data provider credit
   - License information
   - External links

### Features

- Clean, readable typography
- Code blocks for formulas
- Highlighted example scenarios
- External links to documentation
- Responsive layout

---

## Navigation Flow

```
Dashboard ←→ Analysis ←→ About
    ↓           ↓          ↓
  (All pages accessible from header)
```

### Header Navigation

- **Dashboard:** Blue underline when active
- **Analysis:** Blue underline when active
- **About:** Blue underline when active
- Hover effects on all links
- Mobile-responsive menu

---

## Responsive Behavior

### Mobile (< 640px)

**Dashboard:**
- Controls stack vertically
- KPI cards: 1 column
- Chart: Full width, scrollable
- Reduced padding

**Analysis:**
- Controls stack vertically
- Charts: Full width
- Stacked layout

**About:**
- Single column
- Reduced padding
- Readable line length

### Tablet (640px - 1024px)

**Dashboard:**
- Controls: 2 columns
- KPI cards: 2 columns
- Chart: Full width

**Analysis:**
- Controls: 2 columns
- Charts: Full width

**About:**
- Single column
- Wider content area

### Desktop (> 1024px)

**Dashboard:**
- Controls: Horizontal layout
- KPI cards: 4 columns
- Chart: Full width
- Maximum width: 1280px

**Analysis:**
- Controls: Horizontal layout
- Charts: Full width
- Maximum width: 1280px

**About:**
- Single column
- Maximum width: 896px
- Centered content

---

## Color Scheme

### Dashboard
- Primary: Blue (#3b82f6)
- Secondary: Green (#10b981)
- Background: Gray-50 (#f9fafb)

### Analysis
- Primary: Blue (#3b82f6)
- Secondary: Green (#10b981)
- Tertiary: Purple (#8b5cf6)
- Background: Gray-50 (#f9fafb)

### About
- Text: Gray-900 (#111827)
- Secondary Text: Gray-700 (#374151)
- Links: Blue-600 (#2563eb)
- Background: Gray-50 (#f9fafb)

---

## Performance Considerations

### Dashboard
- Initial load: ~2-5 seconds (API fetch)
- Chart render: <100ms
- Interactions: Instant

### Analysis
- Initial load: ~2-5 seconds (API fetch)
- Chart calculations: <200ms
- Three charts render: <300ms

### About
- Static content
- Instant load
- No API calls

---

## Accessibility

### All Screens
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast: WCAG AA

### Dashboard
- Chart tooltips accessible
- Form labels clear
- Button states announced

### Analysis
- Multiple charts navigable
- Data tables as fallback
- Screen reader friendly

### About
- Readable typography
- Clear headings
- Logical structure

---

## Future Enhancements

### Dashboard
- [ ] Export data to CSV
- [ ] Save favorite date ranges
- [ ] Real-time updates
- [ ] Multiple regions

### Analysis
- [ ] Custom date grouping
- [ ] Statistical tests
- [ ] Comparison mode
- [ ] Download charts

### About
- [ ] Interactive examples
- [ ] Video tutorials
- [ ] FAQ section
- [ ] Glossary
