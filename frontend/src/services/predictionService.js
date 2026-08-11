import { apiRequest } from './api';
import { getFieldById, getFieldsForDate } from '../data/mockData';

export async function getPredictions(date) {
  return apiRequest(`/predictions?date=${date ?? ''}`, {
    fallback: () => getFieldsForDate(date),
  });
}

export async function getPredictionByFieldId(fieldId, date) {
  // Use backend field-specific predictions route: /api/v1/predictions/field/{fieldId}
  return apiRequest(`/v1/predictions/field/${fieldId}`, { fallback: () => getFieldById(fieldId, date) });
}

export async function getPriorityFields(date) {
  const fields = await getPredictions(date);
  return fields.filter((field) => field.priority === 'High');
}