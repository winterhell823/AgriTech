import ReactECharts from 'echarts-for-react';
import { SectionCard } from '../common/SectionCard';

export function FieldTrendChart({ title, subtitle, history, seriesKeys, height = 300, colorMap = {} }) {
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: history.map((entry) => entry.observationDate) },
    yAxis: { type: 'value', min: 0, max: 1 },
    series: seriesKeys.map((seriesKey) => ({
      name: seriesKey,
      type: 'line',
      smooth: true,
      data: history.map((entry) => entry[seriesKey]),
      color: colorMap[seriesKey],
    })),
  };

  return (
    <SectionCard title={title} subtitle={subtitle}>
      <ReactECharts option={option} style={{ height }} notMerge lazyUpdate />
    </SectionCard>
  );
}