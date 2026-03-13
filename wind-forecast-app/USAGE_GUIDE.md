# Usage Guide

## Dashboard Overview

The Wind Power Forecast Monitoring Dashboard provides an intuitive interface for analyzing wind generation forecasts against actual data.

## Controls

### Date Range Picker
- Select start and end dates for data analysis
- Default range: January 1-7, 2024
- Format: YYYY-MM-DD HH:MM

### Forecast Horizon Slider
- Adjust the forecast horizon from 0 to 48 hours
- Default: 24 hours
- Shows how far in advance the forecast was made

### Update Data Button
- Click to fetch and display data with current settings
- Automatically loads on page load

## Visualization

### Line Chart
- Blue line: Actual wind generation
- Green line: Forecasted generation
- X-axis: Time (date and hour)
- Y-axis: Generation in MW (Megawatts)
- Missing forecast values are not plotted (gaps in green line)

## Metrics Panel

### Mean Absolute Error (MAE)
Average absolute difference between forecast and actual values.
Lower is better.

### Root Mean Square Error (RMSE)
Square root of average squared differences.
Penalizes larger errors more heavily.

### Median Error
Middle value of all absolute errors.
Less sensitive to outliers than MAE.

## Tips

- Start with a small date range (1-7 days) for faster loading
- Adjust the horizon slider to see how forecast accuracy changes
- Compare metrics across different time periods
- Mobile-friendly: all controls adapt to smaller screens
