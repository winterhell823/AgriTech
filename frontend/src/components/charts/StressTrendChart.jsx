import { ChartCard } from './ChartCard';

export function StressTrendChart({ data }) {
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.date),
    },
    yAxis: { type: 'value' },
    series: [
      { name: 'Healthy', type: 'line', smooth: true, data: data.map((entry) => entry.Healthy), color: '#2e7d32' },
      { name: 'Mild', type: 'line', smooth: true, data: data.map((entry) => entry.Mild), color: '#8fa63b' },
      { name: 'Moderate', type: 'line', smooth: true, data: data.map((entry) => entry.Moderate), color: '#d18b00' },
      { name: 'Severe', type: 'line', smooth: true, data: data.map((entry) => entry.Severe), color: '#c4473b' },
    ],
  };

  return <ChartCard title="Moisture Stress Trend" subtitle="How stress classes changed over time" option={option} height={280} />;
}