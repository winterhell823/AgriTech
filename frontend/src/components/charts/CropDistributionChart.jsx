import { getCropColor, formatNumber } from '../../utils/formatters';
import { ChartCard } from './ChartCard';

export function CropDistributionChart({ data, onCropSelect }) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: ({ name, value, percent }) => `${name}<br/>Fields: ${formatNumber(value)}<br/>Share: ${percent}%`,
    },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        type: 'pie',
        radius: ['42%', '70%'],
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        data: data.map((entry) => ({
          name: entry.name,
          value: entry.value,
          itemStyle: { color: getCropColor(entry.name) },
        })),
      },
    ],
  };

  return (
    <ChartCard
      title="Crop Distribution"
      subtitle="Thematic composition by crop type"
      option={option}
      height={300}
      onEvents={
        onCropSelect
          ? {
              click: (params) => onCropSelect(params?.name ?? 'All'),
            }
          : undefined
      }
    />
  );
}