import { Grid, Paper, Stack, Typography } from '@mui/material';
import { SectionCard } from '../common/SectionCard';
import { formatNumber } from '../../utils/formatters';

export function WeatherWidget({ weather }) {
  if (!weather) {
    return null;
  }

  const current = weather.current;

  return (
    <Stack spacing={2}>
      <SectionCard title="Current Weather" subtitle="Field-level weather context" sx={{ height: '100%' }}>
        <Grid container spacing={2}>
          {[
            ['Temperature', `${current.temperature}°C`],
            ['Rainfall', `${current.rainfall} mm`],
            ['Humidity', `${current.humidity}%`],
            ['Wind Speed', `${current.windSpeed} km/h`],
          ].map(([label, value]) => (
            <Grid key={label} item xs={6} sm={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(47,107,63,0.04)' }}>
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="h6">{value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard title="7-Day Forecast" subtitle="Mock forecast that will later come from the backend">
        <Grid container spacing={1.5}>
          {weather.forecast.map((day) => (
            <Grid key={day.day} item xs={12} sm={6} md={12 / 7}>
              <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: 'rgba(47,107,63,0.04)' }}>
                <Typography variant="subtitle2">{day.day}</Typography>
                <Typography variant="body2">{day.temperature}°C</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(day.rainfall)} mm rain
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </SectionCard>
    </Stack>
  );
}