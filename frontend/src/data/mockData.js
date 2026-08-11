import { getCropColor, getStageColor, getStressColor } from '../utils/formatters';

export const timelineOptions = [
  { value: '2026-06-01', label: 'June 01' },
  { value: '2026-06-15', label: 'June 15' },
  { value: '2026-07-01', label: 'July 01' },
  { value: '2026-07-15', label: 'July 15' },
  { value: '2026-08-01', label: 'August 01' },
];

export const cropStages = {
  Wheat: ['Germination', 'Vegetative', 'Vegetative', 'Flowering', 'Grain Filling'],
  Rice: ['Vegetative', 'Vegetative', 'Flowering', 'Flowering', 'Maturity'],
  Maize: ['Germination', 'Vegetative', 'Vegetative', 'Grain Filling', 'Harvest-ready'],
  Cotton: ['Vegetative', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity'],
  Sugarcane: ['Vegetative', 'Vegetative', 'Vegetative', 'Flowering', 'Maturity'],
  Other: ['Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Harvest-ready'],
};

const stressSeries = {
  healthy: ['Healthy', 'Healthy', 'Mild Stress', 'Mild Stress', 'Healthy'],
  crop1: ['Healthy', 'Mild Stress', 'Mild Stress', 'Moderate Stress', 'Moderate Stress'],
  crop2: ['Healthy', 'Healthy', 'Mild Stress', 'Moderate Stress', 'Moderate Stress'],
  crop3: ['Healthy', 'Mild Stress', 'Moderate Stress', 'Moderate Stress', 'Severe Stress'],
  crop4: ['Mild Stress', 'Mild Stress', 'Moderate Stress', 'Moderate Stress', 'Severe Stress'],
};

const confidenceSeries = [0.94, 0.92, 0.9, 0.88, 0.86];

const trendSeries = {
  wheat: {
    ndvi: [0.41, 0.5, 0.58, 0.64, 0.62],
    ndwi: [0.36, 0.34, 0.31, 0.29, 0.26],
    evi: [0.29, 0.36, 0.44, 0.5, 0.47],
  },
  rice: {
    ndvi: [0.38, 0.47, 0.56, 0.61, 0.65],
    ndwi: [0.39, 0.37, 0.35, 0.32, 0.3],
    evi: [0.26, 0.34, 0.42, 0.46, 0.51],
  },
  maize: {
    ndvi: [0.36, 0.45, 0.54, 0.6, 0.58],
    ndwi: [0.34, 0.31, 0.29, 0.27, 0.24],
    evi: [0.24, 0.32, 0.41, 0.45, 0.43],
  },
  cotton: {
    ndvi: [0.34, 0.43, 0.5, 0.57, 0.55],
    ndwi: [0.33, 0.31, 0.29, 0.27, 0.25],
    evi: [0.23, 0.31, 0.38, 0.42, 0.41],
  },
  sugarcane: {
    ndvi: [0.44, 0.5, 0.57, 0.63, 0.66],
    ndwi: [0.4, 0.39, 0.37, 0.35, 0.34],
    evi: [0.3, 0.36, 0.43, 0.48, 0.52],
  },
  other: {
    ndvi: [0.31, 0.4, 0.48, 0.52, 0.5],
    ndwi: [0.29, 0.28, 0.26, 0.24, 0.22],
    evi: [0.2, 0.27, 0.33, 0.37, 0.35],
  },
};

const baseFields = [
  {
    id: '1024',
    name: 'Field 1024',
    crop: 'Wheat',
    baseCenter: [78.3936, 17.4725],
    shape: [[78.3919, 17.4714], [78.3951, 17.4711], [78.3956, 17.4735], [78.3921, 17.4738]],
    profile: 'wheat',
    stressProfile: 'crop1',
    priority: ['Low', 'Low', 'Medium', 'High', 'High'],
  },
  {
    id: '1025',
    name: 'Field 1025',
    crop: 'Rice',
    baseCenter: [78.3984, 17.4708],
    shape: [[78.3967, 17.4698], [78.3998, 17.4696], [78.4004, 17.4720], [78.3970, 17.4723]],
    profile: 'rice',
    stressProfile: 'healthy',
    priority: ['Low', 'Low', 'Low', 'Medium', 'Medium'],
  },
  {
    id: '1026',
    name: 'Field 1026',
    crop: 'Maize',
    baseCenter: [78.3898, 17.4703],
    shape: [[78.3884, 17.4692], [78.3914, 17.4688], [78.3920, 17.4711], [78.3890, 17.4714]],
    profile: 'maize',
    stressProfile: 'crop2',
    priority: ['Low', 'Medium', 'Medium', 'High', 'High'],
  },
  {
    id: '1027',
    name: 'Field 1027',
    crop: 'Cotton',
    baseCenter: [78.4016, 17.4741],
    shape: [[78.4000, 17.4730], [78.4031, 17.4728], [78.4034, 17.4750], [78.4005, 17.4753]],
    profile: 'cotton',
    stressProfile: 'crop3',
    priority: ['Medium', 'Medium', 'High', 'High', 'High'],
  },
  {
    id: '1028',
    name: 'Field 1028',
    crop: 'Sugarcane',
    baseCenter: [78.3868, 17.4749],
    shape: [[78.3852, 17.4739], [78.3885, 17.4735], [78.3890, 17.4760], [78.3858, 17.4762]],
    profile: 'sugarcane',
    stressProfile: 'healthy',
    priority: ['Low', 'Low', 'Low', 'Medium', 'Medium'],
  },
  {
    id: '1029',
    name: 'Field 1029',
    crop: 'Wheat',
    baseCenter: [78.3929, 17.4773],
    shape: [[78.3911, 17.4763], [78.3944, 17.4760], [78.3950, 17.4785], [78.3920, 17.4788]],
    profile: 'wheat',
    stressProfile: 'crop2',
    priority: ['Low', 'Medium', 'Medium', 'Medium', 'High'],
  },
  {
    id: '1030',
    name: 'Field 1030',
    crop: 'Rice',
    baseCenter: [78.3974, 17.4779],
    shape: [[78.3958, 17.4769], [78.3989, 17.4766], [78.3994, 17.4788], [78.3962, 17.4791]],
    profile: 'rice',
    stressProfile: 'crop4',
    priority: ['Medium', 'Medium', 'High', 'High', 'High'],
  },
  {
    id: '1031',
    name: 'Field 1031',
    crop: 'Other',
    baseCenter: [78.4029, 17.4699],
    shape: [[78.4014, 17.4688], [78.4044, 17.4687], [78.4048, 17.4710], [78.4021, 17.4713]],
    profile: 'other',
    stressProfile: 'crop3',
    priority: ['Medium', 'High', 'High', 'High', 'High'],
  },
];

const weatherSeries = [
  { temperature: 31, rainfall: 12, humidity: 58, windSpeed: 10 },
  { temperature: 33, rainfall: 8, humidity: 54, windSpeed: 11 },
  { temperature: 34, rainfall: 6, humidity: 50, windSpeed: 12 },
  { temperature: 35, rainfall: 4, humidity: 47, windSpeed: 13 },
  { temperature: 34, rainfall: 8, humidity: 49, windSpeed: 11 },
];

export const mapLayers = [
  { id: 'satellite', label: 'Satellite', description: 'Imagery background' },
  { id: 'crop', label: 'Crop Type', description: 'Crop boundary emphasis' },
  { id: 'phenology', label: 'Phenological Stage', description: 'Stage emphasis' },
  { id: 'stress', label: 'Moisture Stress', description: 'Stress intensity' },
  { id: 'boundaries', label: 'Field Boundaries', description: 'Neutral boundaries' },
  { id: 'weather', label: 'Weather', description: 'Weather intensity' },
];

function createPolygon(shape) {
  return [[...shape.map(([lng, lat]) => [lng, lat]), [shape[0][0], shape[0][1]]]];
}

function createSnapshot(field, index) {
  const stage = cropStages[field.crop][index];
  const stress = stressSeries[field.stressProfile][index];
  const weather = weatherSeries[index];
  const profile = trendSeries[field.profile];
  const recommendation =
    stress === 'Severe Stress' || weather.temperature >= 35
      ? 'Irrigation / field inspection'
      : stress === 'Moderate Stress'
        ? 'Prioritize irrigation planning'
        : 'Routine monitoring';

  const evidence = [
    profile.ndwi[index] <= 0.3 ? 'Declining NDWI' : 'Stable NDWI',
    profile.ndvi[index] <= 0.52 ? 'Declining NDVI' : 'Healthy NDVI',
    weather.rainfall <= 8 ? 'Low recent rainfall' : 'Recent rainfall observed',
    weather.temperature >= 34 ? 'High temperature' : 'Moderate temperature',
    'SAR response indicates canopy change',
  ];

  return {
    id: field.id,
    name: field.name,
    crop: field.crop,
    stage,
    stress,
    confidence: confidenceSeries[index],
    observationDate: timelineOptions[index].value,
    temperature: weather.temperature,
    rainfall: weather.rainfall,
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
    ndvi: profile.ndvi[index],
    ndwi: profile.ndwi[index],
    evi: profile.evi[index],
    priority: field.priority[index],
    recommendation,
    decisionRule:
      stress === 'Moderate Stress' || stress === 'Severe Stress'
        ? 'Field exceeded stress threshold for irrigation review.'
        : 'Field remains within expected vegetative threshold.',
    evidence,
    cropColor: getCropColor(field.crop),
    stageColor: getStageColor(stage),
    stressColor: getStressColor(stress),
    geometry: {
      type: 'Feature',
      properties: {
        id: field.id,
        crop: field.crop,
        stage,
        stress,
        confidence: confidenceSeries[index],
      },
      geometry: {
        type: 'Polygon',
        coordinates: createPolygon(field.shape),
      },
    },
  };
}

export const mockFields = baseFields.map((field) => ({
  id: field.id,
  name: field.name,
  crop: field.crop,
  center: field.baseCenter,
  geometry: {
    type: 'Feature',
    properties: {
      id: field.id,
      crop: field.crop,
    },
    geometry: {
      type: 'Polygon',
      coordinates: createPolygon(field.shape),
    },
  },
  history: timelineOptions.map((_, index) => createSnapshot(field, index)),
}));

export const getFieldsForDate = (date) =>
  mockFields.map((field) => field.history.find((snapshot) => snapshot.observationDate === date) ?? field.history.at(-1));

export const getFieldById = (id, date = timelineOptions.at(-1).value) =>
  getFieldsForDate(date).find((field) => field.id === id) ?? null;

export const getHistoricalFieldData = (id) => {
  const field = mockFields.find((entry) => entry.id === id);
  return field?.history ?? [];
};

export const getDashboardSummary = (date = timelineOptions.at(-1).value) => {
  const fields = getFieldsForDate(date);
  const totalFields = fields.length * 156;
  const counts = fields.reduce(
    (accumulator, field) => {
      accumulator[field.stress] += 1;
      return accumulator;
    },
    { Healthy: 0, 'Mild Stress': 0, 'Moderate Stress': 0, 'Severe Stress': 0 },
  );

  return {
    totalFields,
    healthy: counts.Healthy * 112,
    mild: counts['Mild Stress'] * 64,
    moderate: counts['Moderate Stress'] * 39,
    severe: counts['Severe Stress'] * 17,
    fieldsMonitored: totalFields,
    lastObservation: date,
    averageNdvi: fields.reduce((sum, field) => sum + field.ndvi, 0) / fields.length,
    highPriorityFields: fields.filter((field) => field.priority === 'High').length,
  };
};

export const getStressDistribution = (date = timelineOptions.at(-1).value) => {
  const fields = getFieldsForDate(date);
  const totals = fields.reduce(
    (accumulator, field) => {
      accumulator[field.stress] += 1;
      return accumulator;
    },
    { Healthy: 0, 'Mild Stress': 0, 'Moderate Stress': 0, 'Severe Stress': 0 },
  );

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
};

export const getStressTrend = () =>
  timelineOptions.map((entry) => {
    const fields = getFieldsForDate(entry.value);
    return {
      date: entry.label,
      Healthy: fields.filter((field) => field.stress === 'Healthy').length,
      Mild: fields.filter((field) => field.stress === 'Mild Stress').length,
      Moderate: fields.filter((field) => field.stress === 'Moderate Stress').length,
      Severe: fields.filter((field) => field.stress === 'Severe Stress').length,
    };
  });

export const getCropDistribution = (date = timelineOptions.at(-1).value) => {
  const fields = getFieldsForDate(date);
  const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Other'];
  return crops.map((crop) => ({ name: crop, value: fields.filter((field) => field.crop === crop).length }));
};

export const getPhenologyDistribution = (date = timelineOptions.at(-1).value) => {
  const fields = getFieldsForDate(date);
  const stages = ['Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity', 'Harvest-ready'];
  return stages.map((stage) => ({ name: stage, value: fields.filter((field) => field.stage === stage).length }));
};

export const getWeatherData = (date = timelineOptions.at(-1).value) => {
  const index = timelineOptions.findIndex((entry) => entry.value === date);
  const weather = weatherSeries[index >= 0 ? index : weatherSeries.length - 1];
  return {
    current: weather,
    forecast: [
      { day: 'Mon', temperature: 33, rainfall: 6, humidity: 52, windSpeed: 10 },
      { day: 'Tue', temperature: 34, rainfall: 4, humidity: 49, windSpeed: 11 },
      { day: 'Wed', temperature: 35, rainfall: 2, humidity: 46, windSpeed: 13 },
      { day: 'Thu', temperature: 34, rainfall: 7, humidity: 48, windSpeed: 12 },
      { day: 'Fri', temperature: 32, rainfall: 15, humidity: 56, windSpeed: 9 },
      { day: 'Sat', temperature: 31, rainfall: 11, humidity: 58, windSpeed: 8 },
      { day: 'Sun', temperature: 33, rainfall: 5, humidity: 50, windSpeed: 10 },
    ],
  };
};

export const getMapLayers = () => mapLayers;

export const getFeatureImportancePlaceholder = () => [
  { feature: 'NDWI', importance: 0.34 },
  { feature: 'NDVI', importance: 0.28 },
  { feature: 'Rainfall', importance: 0.16 },
  { feature: 'Temperature', importance: 0.12 },
  { feature: 'SAR response', importance: 0.1 },
];