import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useDashboard } from '../context/DashboardContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { getCropDistributionData, getPhenologyDistributionData, getStressDistributionData } from '../services/fieldService';
import { PageHeader } from '../components/common/PageHeader';
import { CropDistributionChart } from '../components/charts/CropDistributionChart';
import { PhenologyChart } from '../components/charts/PhenologyChart';
import { StressDistributionChart } from '../components/charts/StressDistributionChart';

export function CategoryPage({ title, subtitle, kind }) {
  const { selectedDate, setSelectedCrop } = useDashboard();
  const cropData = useAsyncData(() => getCropDistributionData(selectedDate), [selectedDate]);
  const phenologyData = useAsyncData(() => getPhenologyDistributionData(selectedDate), [selectedDate]);
  const stressData = useAsyncData(() => getStressDistributionData(selectedDate), [selectedDate]);

  return (
    <Box>
      <PageHeader title={title} subtitle={subtitle} />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          {kind === 'crop' ? (
            <CropDistributionChart data={cropData.data ?? []} onCropSelect={setSelectedCrop} />
          ) : kind === 'phenology' ? (
            <PhenologyChart data={phenologyData.data ?? []} />
          ) : (
            <StressDistributionChart data={stressData.data ?? []} />
          )}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">How this page is wired</Typography>
              <Typography variant="body2" color="text.secondary">
                This page is powered by the same service layer as the dashboard, so it can switch to Spring Boot endpoints without changing the UI.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The selected date in the timeline controls the data shown here, and crop selections can be pushed back to the map for highlighting.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}