export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const TOKEN_KEY = 'auth_token';

function getHeaders(withAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let message = 'Request failed';
    
    // Handle FastAPI validation errors
    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        // Multiple validation errors
        message = data.detail.map(err => err.msg || err.message || err).join(', ');
      } else if (typeof data.detail === 'string') {
        // Single error message
        message = data.detail;
      } else if (typeof data.detail === 'object') {
        // Error object
        message = data.detail.message || data.detail.msg || JSON.stringify(data.detail);
      }
    } else if (data?.message) {
      message = data.message;
    }
    
    throw new Error(message);
  }
  return data;
}

export async function register({ username, email, password }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password })
  });
  const data = await handleResponse(res);
  if (data?.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
}

export async function login({ login, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ login, password })
  });
  const data = await handleResponse(res);
  if (data?.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
}

export async function me() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: getHeaders(true)
  });
  return handleResponse(res);
}

export async function logout() {
  localStorage.removeItem(TOKEN_KEY);
  return true;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}



