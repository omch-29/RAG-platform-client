const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://44.222.255.100:4000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rag_token');
}

function setToken(token) {
  localStorage.setItem('rag_token', token);
}

function clearToken() {
  localStorage.removeItem('rag_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload, auth: false }),
  listDocuments: () => request('/api/ingest'),
  ingestDocument: (payload) => request('/api/ingest', { method: 'POST', body: payload }),
  getUsage: () => request('/api/query/usage'),
  query: (question) => request('/api/query', { method: 'POST', body: { question } }),
  streamUrl: (question) => {
    const token = getToken();
    return `${API_URL}/api/query/stream?question=${encodeURIComponent(question)}&token=${encodeURIComponent(token || '')}`;
  },
};

export { getToken, setToken, clearToken, API_URL };

//44.222.255.100