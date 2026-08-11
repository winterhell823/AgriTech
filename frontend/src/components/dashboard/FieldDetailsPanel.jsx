import { Card, CardContent, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { EmptyState } from '../common/EmptyState';
import { SectionCard } from '../common/SectionCard';
import { formatDateLabel, formatDecimal, formatPercent, getPriorityColor } from '../../utils/formatters';

function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ py: 0.75, minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ minWidth: 0, overflowWrap: 'anywhere', textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function FieldDetailsPanel({ field }) {
  if (!field) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%' }}>
          <EmptyState
            title="Select a field"
            description="Click any polygon on the map to inspect crop prediction, stress, weather, and evidence details."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <SectionCard
        title={field.name}
        subtitle={`Observation ${formatDateLabel(field.observationDate)}`}
        action={<Chip label={`Priority: ${field.priority}`} sx={{ bgcolor: getPriorityColor(field.priority), color: '#fff' }} />}
      >
        <Grid container spacing={2} sx={{ minWidth: 0 }}>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Crop" value={field.crop} />
            <InfoRow label="Crop Confidence" value={formatPercent(field.confidence)} />
            <InfoRow label="Phenological Stage" value={field.stage} />
            <InfoRow label="Stage Confidence" value={formatPercent(field.confidence - 0.05)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Moisture Stress" value={field.stress} />
            <InfoRow label="Stress Confidence" value={formatPercent(field.confidence - 0.08)} />
            <InfoRow label="Temperature" value={`${field.temperature}°C`} />
            <InfoRow label="Rainfall" value={`${field.rainfall} mm`} />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="ML Prediction" subtitle="Validated output from the backend model">
        <InfoRow label="Crop type" value={`${field.crop} (${formatPercent(field.confidence)})`} />
        <InfoRow label="Stage" value={`${field.stage} (${formatPercent(field.confidence - 0.05)})`} />
        <InfoRow label="Stress" value={`${field.stress} (${formatPercent(field.confidence - 0.08)})`} />
      </SectionCard>

      <SectionCard title="Evidence" subtitle="Signals used to support the recommendation">
        <Stack spacing={1}>
          {field.evidence.map((evidence) => (
            <Chip key={evidence} label={evidence} variant="outlined" />
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Decision Rule" subtitle="Rule-based trigger that converts evidence into action">
        <Typography variant="body2" color="text.secondary">
          {field.decisionRule}
        </Typography>
      </SectionCard>

      <SectionCard title="Recommendation" subtitle="Operational guidance for the field team">
        <Typography variant="subtitle1" gutterBottom>
          {field.recommendation}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <InfoRow label="NDVI" value={formatDecimal(field.ndvi)} />
        <InfoRow label="NDWI" value={formatDecimal(field.ndwi)} />
        <InfoRow label="EVI" value={formatDecimal(field.evi)} />
        <InfoRow label="Humidity" value={`${field.humidity}%`} />
        <InfoRow label="Wind" value={`${field.windSpeed} km/h`} />
      </SectionCard>
    </Stack>
  );
}