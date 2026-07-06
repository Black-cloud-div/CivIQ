const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadDataset(file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/datasets/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDataset(datasetId: string) {
  const res = await fetch(`${API_BASE}/api/datasets/${datasetId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function getInsights(datasetId: string) {
  const res = await fetch(`${API_BASE}/api/ai/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset_id: datasetId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function chatWithData(datasetId: string, question: string, history: {role:string, content:string}[] = []) {
  const res = await fetch(`${API_BASE}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset_id: datasetId, question, history }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateReport(datasetId: string) {
  const res = await fetch(`${API_BASE}/api/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset_id: datasetId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function sendOtp(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to send OTP');
  }
  return res.json();
}

export async function verifyOtp(email: string, otp: string) {
  const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Invalid OTP');
  }
  return res.json();
}

export async function registerUser(name: string, email: string, phone?: string, organization?: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, organization }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to register');
  }
  return res.json();
}

export async function verifyRegisterOtp(email: string, otp: string) {
  const res = await fetch(`${API_BASE}/api/auth/register/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Invalid registration OTP');
  }
  return res.json();
}

export async function getProfile() {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'GET',
    headers: headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch profile');
  }
  return res.json();
}
