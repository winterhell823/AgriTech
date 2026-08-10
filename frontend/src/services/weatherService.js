import { apiRequest } from './api';
import { getWeatherData } from '../data/mockData';

export async function getWeatherSummary(date) {
  return apiRequest(`/weather?date=${date ?? ''}`, { fallback: () => getWeatherData(date) });
}

export async function getWeatherForecast(date) {
  const data = await getWeatherSummary(date);
  return data.forecast;
}