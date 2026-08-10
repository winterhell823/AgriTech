import { apiRequest } from './api';
import { getChatResponse } from '../data/mockData';

export async function sendChatMessage(message) {
  return apiRequest('/chat', {
    method: 'POST',
    body: { message },
    fallback: () => ({
      reply: getChatResponse(message),
      sources: ['validated field summaries', 'weather context', 'historical time series'],
    }),
  });
}