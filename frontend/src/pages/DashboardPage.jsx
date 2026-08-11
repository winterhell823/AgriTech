import { useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { useDashboard } from '../context/DashboardContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { getDashboardSummaryData, getFields, getMapLayersData, getStressDistributionData, getStressTrendData, getCropDistributionData, getPhenologyDistributionData } from '../services/fieldService';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { GISMap } from '../components/map/GISMap';
import { FieldDetailsPanel } from '../components/dashboard/FieldDetailsPanel';
import { StressDistributionChart } from '../components/charts/StressDistributionChart';
import { StressTrendChart } from '../components/charts/StressTrendChart';
import { CropDistributionChart } from '../components/charts/CropDistributionChart';
import { PhenologyChart } from '../components/charts/PhenologyChart';
import { LoadingState } from '../components/common/LoadingState';

export function DashboardPage() {
  const { selectedDate, selectedFieldId, selectedLayer, setSelectedLayer, setSelectedDate, selectedCrop, setSelectedCrop, setSelectedFieldId, mapLayers, timelineOptions } = useDashboard();

  const { data: summary, loading: summaryLoading } = useAsyncData(() => getDashboardSummaryData(selectedDate), [selectedDate]);
  const { data: fieldsData, loading: fieldsLoading } = useAsyncData(() => getFields(selectedDate), [selectedDate]);
  const { data: stressDistributionData } = useAsyncData(() => getStressDistributionData(selectedDate), [selectedDate]);
  const { data: cropDistributionData } = useAsyncData(() => getCropDistributionData(selectedDate), [selectedDate]);
  const { data: phenologyDistributionData } = useAsyncData(() => getPhenologyDistributionData(selectedDate), [selectedDate]);
  const { data: stressTrendData } = useAsyncData(() => getStressTrendData(), []);
  const { data: layersData } = useAsyncData(() => getMapLayersData(), []);

  const fields = fieldsData ?? [];
  const stressDistribution = stressDistributionData ?? [];
  const cropDistribution = cropDistributionData ?? [];
  const phenologyDistribution = phenologyDistributionData ?? [];
  const stressTrend = stressTrendData ?? [];
  const layers = layersData ?? [];

  const selectedField = useMemo(() => {
    if (!Array.isArray(fields) || fields.length === 0) {
      return null;
    }

    return fields.find((field) => field.id === selectedFieldId) ?? fields[0];
  }, [fields, selectedFieldId]);

  const isLoading = summaryLoading || fieldsLoading;

  if (isLoading && !summary) {
    return <LoadingState height={460} rows={2} />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <SummaryCards summary={summary} />
      <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        <Grid item xs={12} lg={7} xl={8} sx={{ minWidth: 0 }}>
          <GISMap
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={(fieldId) => {
              const nextField = fields.find((field) => field.id === fieldId);
              if (nextField) {
                setSelectedFieldId(fieldId);
                setSelectedCrop(selectedCrop === nextField.crop ? selectedCrop : nextField.crop);
              }
            }}
            selectedLayer={selectedLayer}
            onSelectedLayerChange={setSelectedLayer}
            dates={timelineOptions}
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
            layers={layers.length ? layers : mapLayers}
            selectedCrop={selectedCrop}
          />
        </Grid>
        <Grid item xs={12} lg={5} xl={4} sx={{ minWidth: 0 }}>
          <FieldDetailsPanel field={selectedField} />
        </Grid>
        <Grid item xs={12} md={6} xl={4} sx={{ minWidth: 0 }}>
          <StressDistributionChart data={stressDistribution} />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <CropDistributionChart data={cropDistribution} />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <PhenologyChart data={phenologyDistribution} />
        </Grid>
        <Grid item xs={12}>
          <StressTrendChart data={stressTrend} />
        </Grid>
      </Grid>
    </Box>
  );
}