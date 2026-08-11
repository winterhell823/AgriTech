import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Paper, Stack, Typography, Chip } from '@mui/material';
import { useDashboard } from '../context/DashboardContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { getHistoricalFieldDataById } from '../services/fieldService';
import { getWeatherSummary } from '../services/weatherService';
import { PageHeader } from '../components/common/PageHeader';
import { SectionCard } from '../components/common/SectionCard';
import { EmptyState } from '../components/common/EmptyState';
import { formatDateLabel, formatDecimal, formatPercent, getPriorityColor } from '../utils/formatters';
import { FieldTrendChart } from '../components/charts/FieldTrendChart';

export function FieldDetailsPage() {
  const { fieldId } = useParams();
  const { selectedDate } = useDashboard();
  const { data: historyData } = useAsyncData(() => getHistoricalFieldDataById(fieldId), [fieldId]);
  const { data: weather } = useAsyncData(() => getWeatherSummary(selectedDate), [selectedDate]);
  const history = historyData ?? [];

  const field = useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) {
      return null;
    }

    return history.find((entry) => entry.observationDate === selectedDate) ?? history.at(-1);
  }, [history, selectedDate]);
  const stressHistory = useMemo(
    () =>
      history.map((entry) => ({
        ...entry,
        stressScore: {
          Healthy: 1,
          'Mild Stress': 2,
          'Moderate Stress': 3,
          'Severe Stress': 4,
        }[entry.stress],
      })),
    [history],
  );

  if (!field) {
    return <EmptyState title="Field not found" description="The requested field is not available in the current dataset." />;
  }

  return (
    <Box>
      <PageHeader title={`Field ${field.id} Details`} subtitle={`Observation ${formatDateLabel(field.observationDate)}`} />

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            <SectionCard title="Overview" subtitle="Validated field summary">
              <Stack spacing={1}>
                <Typography variant="body2">Crop: <strong>{field.crop}</strong></Typography>
                <Typography variant="body2">Stage: <strong>{field.stage}</strong></Typography>
                <Typography variant="body2">Moisture Stress: <strong>{field.stress}</strong></Typography>
                <Typography variant="body2">Confidence: <strong>{formatPercent(field.confidence)}</strong></Typography>
                <Typography variant="body2">Observation Date: <strong>{formatDateLabel(field.observationDate)}</strong></Typography>
                <Chip label={`Priority: ${field.priority}`} sx={{ bgcolor: getPriorityColor(field.priority), color: '#fff', width: 'fit-content' }} />
              </Stack>
            </SectionCard>

            <SectionCard title="Supporting Evidence" subtitle="Signals that support the field summary">
              <Stack spacing={1} sx={{ mb: 1 }}>
                {field.evidence.map((signal) => (
                  <Chip key={signal} label={signal} variant="outlined" />
                ))}
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FieldTrendChart
                title="Vegetation Trend"
                subtitle="NDVI, NDWI, and EVI across the timeline"
                history={history}
                seriesKeys={['ndvi', 'ndwi', 'evi']}
                colorMap={{ ndvi: '#2f6b3f', ndwi: '#306d8a', evi: '#7a5c2f' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldTrendChart
                title="Weather Trend"
                subtitle="Temperature, rainfall, and humidity"
                history={history}
                seriesKeys={['temperature', 'rainfall', 'humidity']}
                colorMap={{ temperature: '#c4473b', rainfall: '#306d8a', humidity: '#2e7d32' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldTrendChart
                title="Stress History"
                subtitle="Moisture stress progression over time"
                history={stressHistory}
                seriesKeys={['stressScore']}
                colorMap={{ stressScore: '#d18b00' }}
              />
            </Grid>
            <Grid item xs={12}>
              <SectionCard title="Recommendation" subtitle="Distinguish prediction, evidence, rule, and recommendation">
                <Typography variant="subtitle1" gutterBottom>
                  {field.recommendation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ML prediction: {field.crop} / {field.stage} / {field.stress} with {formatPercent(field.confidence)} confidence.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Evidence: {field.evidence.join(', ')}.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Decision rule: {field.decisionRule}
                </Typography>
                {weather ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Weather context at selected date: {weather.current.temperature}°C, {weather.current.rainfall} mm rainfall, {weather.current.humidity}% humidity.
                  </Typography>
                ) : null}
              </SectionCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}