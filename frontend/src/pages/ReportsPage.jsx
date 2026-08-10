import { Grid, Paper, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { useDashboard } from '../context/DashboardContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { getDashboardSummaryData } from '../services/fieldService';
import { formatNumber } from '../utils/formatters';

export function ReportsPage() {
  const { selectedDate } = useDashboard();
  const { data: summary } = useAsyncData(() => getDashboardSummaryData(selectedDate), [selectedDate]);

  const items = [
    ['Fields monitored', summary?.fieldsMonitored],
    ['Last observation', summary?.lastObservation],
    ['Average NDVI', summary?.averageNdvi?.toFixed?.(2)],
    ['High-priority fields', summary?.highPriorityFields],
  ];

  return (
    <Stack spacing={2}>
      <PageHeader title="Reports" subtitle="Operational summaries and downloadable intelligence outputs" />
      <Grid container spacing={2}>
        {items.map(([label, value]) => (
          <Grid key={label} item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
              <Typography variant="h5">{value ?? '—'}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export-ready report placeholders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          These cards are ready to wire to Spring Boot report endpoints later without changing the presentation layer.
        </Typography>
      </Paper>
    </Stack>
  );
}