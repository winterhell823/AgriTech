export const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value ?? 0);

export const formatDecimal = (value, digits = 2) => Number(value ?? 0).toFixed(digits);

export const formatPercent = (value, digits = 0) => `${(Number(value ?? 0) * 100).toFixed(digits)}%`;

export const formatDateLabel = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getCropColor = (crop) => {
  const palette = {
    Wheat: '#8b6a32',
    Rice: '#3f7d58',
    Maize: '#d49a24',
    Cotton: '#4f86b8',
    Sugarcane: '#2e8b57',
    Other: '#7c8a7a',
  };
  return palette[crop] ?? '#5b6b61';
};

export const getStressColor = (stress) => {
  const palette = {
    Healthy: '#2e7d32',
    'Mild Stress': '#8fa63b',
    'Moderate Stress': '#d18b00',
    'Severe Stress': '#c4473b',
  };
  return palette[stress] ?? '#5b6b61';
};

export const getStageColor = (stage) => {
  const palette = {
    Germination: '#7ab08d',
    Vegetative: '#4f8a5b',
    Flowering: '#7f9d3d',
    'Grain Filling': '#c28c2c',
    Maturity: '#9c7f45',
    'Harvest-ready': '#475c47',
  };
  return palette[stage] ?? '#5b6b61';
};

export const getPriorityColor = (priority) => {
  const palette = {
    High: '#c4473b',
    Medium: '#d18b00',
    Low: '#2e7d32',
  };
  return palette[priority] ?? '#5b6b61';
};