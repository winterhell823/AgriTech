import { ChartCard } from './ChartCard';
import { getStageColor, formatNumber } from '../../utils/formatters';

export function PhenologyChart({ data }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: 40, right: 20, top: 20, bottom: 24 },
    xAxis: {
      type: 'category',
      axisLabel: { rotate: 18 },
      data: data.map((entry) => entry.name),
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: data.map((entry) => ({
          value: entry.value,
          itemStyle: { color: getStageColor(entry.name) },
        })),
      },
    ],
  };

  return <ChartCard title="Phenological Stage Distribution" subtitle="Field counts across crop growth stages" option={option} height={300} />;
}