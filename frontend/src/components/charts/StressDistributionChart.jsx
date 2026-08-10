import { getStressColor, formatNumber } from '../../utils/formatters';
import { ChartCard } from './ChartCard';

export function StressDistributionChart({ data, onSelect }) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: ({ name, value, percent }) => `${name}<br/>Fields: ${formatNumber(value)}<br/>Share: ${percent}%`,
    },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['46%', '72%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 13, fontWeight: 600 } },
        data: data.map((entry) => ({
          name: entry.name,
          value: entry.value,
          itemStyle: { color: getStressColor(entry.name) },
        })),
      },
    ],
  };

  return <ChartCard title="Moisture Stress Distribution" subtitle="Current field counts by stress class" option={option} action={onSelect ? null : undefined} />;
}