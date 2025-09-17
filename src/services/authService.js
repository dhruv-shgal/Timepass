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
    const message = data?.detail || data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export async function register({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  if (data?.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
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



