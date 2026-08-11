import { Box, Chip, Slider, Stack, Typography } from '@mui/material';
import { formatDateLabel } from '../../utils/formatters';

export function TimeSlider({ dates, value, onChange }) {
  const currentIndex = Math.max(
    0,
    dates.findIndex((entry) => entry.value === value),
  );

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 1.25, borderTop: '1px solid rgba(22, 48, 37, 0.08)', bgcolor: 'rgba(255,255,255,0.92)' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" sx={{ mb: 1, gap: 1 }}>
        <Typography variant="subtitle2">Historical Timeline</Typography>
        <Chip size="small" label={formatDateLabel(value)} />
      </Stack>
      <Slider
        value={currentIndex}
        min={0}
        max={dates.length - 1}
        step={1}
        marks={dates.map((date, index) => ({ value: index, label: date.label }))}
        onChange={(_, nextValue) => onChange(dates[nextValue]?.value ?? value)}
      />
    </Box>
  );
}