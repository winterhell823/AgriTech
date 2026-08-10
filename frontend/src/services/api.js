const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

export async function apiRequest(path, { method = 'GET', body, fallback } = {}) {
  if (!USE_REAL_API || !API_BASE_URL) {
    return typeof fallback === 'function' ? fallback() : fallback;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (fallback !== undefined) {
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    throw error;
  }
}