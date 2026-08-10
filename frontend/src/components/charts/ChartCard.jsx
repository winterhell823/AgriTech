import ReactECharts from 'echarts-for-react';
import { SectionCard } from '../common/SectionCard';

export function ChartCard({ title, subtitle, option, height = 320, action, onEvents }) {
  return (
    <SectionCard title={title} subtitle={subtitle} action={action} sx={{ height: '100%' }}>
      <ReactECharts option={option} style={{ height }} notMerge lazyUpdate onEvents={onEvents} />
    </SectionCard>
  );
}