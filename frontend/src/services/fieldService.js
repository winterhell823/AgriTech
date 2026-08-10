import { apiRequest } from './api';
import {
  getCropDistribution,
  getDashboardSummary,
  getFieldById,
  getFieldsForDate,
  getHistoricalFieldData,
  getMapLayers,
  getPhenologyDistribution,
  getStressDistribution,
  getStressTrend,
} from '../data/mockData';

export async function getFields(date) {
  return apiRequest(`/fields?date=${date ?? ''}`, { fallback: () => getFieldsForDate(date) });
}

export async function getFieldByFieldId(id, date) {
  return apiRequest(`/fields/${id}?date=${date ?? ''}`, { fallback: () => getFieldById(id, date) });
}

export async function getHistoricalFieldDataById(id) {
  return apiRequest(`/predictions/${id}/history`, { fallback: () => getHistoricalFieldData(id) });
}

export async function getCropDistributionData(date) {
  return apiRequest(`/predictions/crop-distribution?date=${date ?? ''}`, { fallback: () => getCropDistribution(date) });
}

export async function getStressDistributionData(date) {
  return apiRequest(`/stress?date=${date ?? ''}`, { fallback: () => getStressDistribution(date) });
}

export async function getPhenologyDistributionData(date) {
  return apiRequest(`/phenology?date=${date ?? ''}`, { fallback: () => getPhenologyDistribution(date) });
}

export async function getDashboardSummaryData(date) {
  return apiRequest(`/reports/dashboard-summary?date=${date ?? ''}`, { fallback: () => getDashboardSummary(date) });
}

export async function getMapLayersData() {
  return apiRequest('/maps', { fallback: () => getMapLayers() });
}

export async function getStressTrendData() {
  return apiRequest('/stress/trend', { fallback: () => getStressTrend() });
}