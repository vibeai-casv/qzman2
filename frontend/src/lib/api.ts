// In development, Vite proxy handles /api -> localhost:8000
// In production, we assume backend serves frontend or they are on same origin
const API_BASE = '/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    // Remove leading slash from endpoint if present to avoid double slash
    const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const res = await fetch(`${API_BASE}/${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || 'API Request Failed');
    }

    return res.json();
}

export async function uploadFile(endpoint: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Upload Failed');
    }

    return res.json();
}
