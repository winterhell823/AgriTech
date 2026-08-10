import { Box } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { useDashboard } from '../context/DashboardContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { getWeatherSummary } from '../services/weatherService';
import { WeatherWidget } from '../components/weather/WeatherWidget';

export function WeatherPage() {
  const { selectedDate } = useDashboard();
  const { data: weather } = useAsyncData(() => getWeatherSummary(selectedDate), [selectedDate]);

  return (
    <Box>
      <PageHeader title="Weather" subtitle="Current conditions and seven-day forecast" />
      <WeatherWidget weather={weather} />
    </Box>
  );
}