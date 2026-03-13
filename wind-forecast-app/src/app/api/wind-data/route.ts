import { NextRequest, NextResponse } from 'next/server';
import { fetchActuals } from '@/lib/fetchActuals';
import { fetchForecasts } from '@/lib/fetchForecasts';
import { processForecasts } from '@/lib/processForecasts';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const horizon = parseInt(searchParams.get('horizon') || '24', 10);

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    // Fetch data in parallel
    const [actuals, forecasts] = await Promise.all([
      fetchActuals(startDate, endDate),
      fetchForecasts(startDate, endDate)
    ]);

    // Process and align data
    const result = processForecasts(actuals, forecasts, horizon);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching wind data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wind data' },
      { status: 500 }
    );
  }
}
