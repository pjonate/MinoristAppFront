const API_BASE = process.env.REACT_APP_API_URL || '';

export function apiFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
}