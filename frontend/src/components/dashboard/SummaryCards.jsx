import { Grid } from '@mui/material';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { MetricCard } from '../common/MetricCard';
import { formatNumber, formatDecimal } from '../../utils/formatters';

export function SummaryCards({ summary }) {
  if (!summary) {
    return null;
  }

  const cards = [
    { label: 'Fields Monitored', value: formatNumber(summary.fieldsMonitored), icon: <AgricultureOutlinedIcon />, accent: '#2f6b3f' },
    { label: 'High Stress Fields', value: formatNumber(summary.highPriorityFields), icon: <WarningAmberOutlinedIcon />, accent: '#d18b00' },
    { label: 'Average NDVI', value: formatDecimal(summary.averageNdvi), icon: <SpaOutlinedIcon />, accent: '#306d8a' },
    { label: 'Latest Observation', value: summary.lastObservation, icon: <CalendarTodayOutlinedIcon />, accent: '#7a5c2f' },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2, width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {cards.map((card) => (
        <Grid key={card.label} item xs={12} sm={6} md={6} lg={3}>
          <MetricCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}