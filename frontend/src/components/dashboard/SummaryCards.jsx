import { Grid } from '@mui/material';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import { MetricCard } from '../common/MetricCard';
import { formatNumber, formatDecimal } from '../../utils/formatters';

export function SummaryCards({ summary }) {
  if (!summary) {
    return null;
  }

  const cards = [
    { label: 'Total Fields', value: formatNumber(summary.totalFields), icon: <AgricultureOutlinedIcon />, accent: '#2f6b3f' },
    { label: 'Healthy', value: formatNumber(summary.healthy), icon: <CheckCircleOutlineOutlinedIcon />, accent: '#2e7d32' },
    { label: 'Mild Stress', value: formatNumber(summary.mild), icon: <SpaOutlinedIcon />, accent: '#8fa63b' },
    { label: 'Moderate Stress', value: formatNumber(summary.moderate), icon: <WarningAmberOutlinedIcon />, accent: '#d18b00' },
    { label: 'Severe Stress', value: formatNumber(summary.severe), icon: <LocalFireDepartmentOutlinedIcon />, accent: '#c4473b' },
    { label: 'Average NDVI', value: formatDecimal(summary.averageNdvi), icon: <SpaOutlinedIcon />, accent: '#306d8a' },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {cards.map((card) => (
        <Grid key={card.label} item xs={12} sm={6} md={4} lg={2}>
          <MetricCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}