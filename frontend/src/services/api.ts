import { AnalyzeResponse, ComplaintDetail, Authority } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : 'http://localhost:8000') + '/api';

export interface AnalyzePayload {
  input_type: 'photo' | 'voice' | 'text';
  text?: string;
  transcript?: string;
  image_base64?: string;
  audio_base64?: string;
  latitude?: number | null;
  longitude?: number | null;
  location_source?: string;
  address?: string;
  area?: string;
}

export const api = {
  async analyze(payload: AnalyzePayload): Promise<AnalyzeResponse> {
    const res = await fetch(`${API_BASE}/complaints/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to analyze report.');
    }
    return res.json();
  },

  async sendComplaint(complaintId: string): Promise<{ success: boolean; message: string; status: string; reference_id: string; authority_name: string; authority_email: string | null }> {
    const res = await fetch(`${API_BASE}/complaints/${complaintId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to dispatch email.');
    }
    return res.json();
  },

  async retryEmail(complaintId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/complaints/${complaintId}/retry-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async supportComplaint(complaintId: string): Promise<{ success: boolean; message: string; report_count: number }> {
    const res = await fetch(`${API_BASE}/complaints/${complaintId}/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async getComplaints(params: {
    date_filter?: string;
    category?: string;
    authority_id?: string;
    status?: string;
    search?: string;
    sort?: string;
  } = {}): Promise<ComplaintDetail[]> {
    const query = new URLSearchParams();
    if (params.date_filter) query.set('date_filter', params.date_filter);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.authority_id && params.authority_id !== 'all') query.set('authority_id', params.authority_id);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);

    const res = await fetch(`${API_BASE}/complaints?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch complaints.');
    return res.json();
  },

  async getComplaint(id: string): Promise<ComplaintDetail> {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) throw new Error('Complaint not found.');
    return res.json();
  },

  async getAuthorities(): Promise<Authority[]> {
    const res = await fetch(`${API_BASE}/authorities`);
    if (!res.ok) throw new Error('Failed to load authorities.');
    return res.json();
  },

  async getCategories(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to load categories.');
    return res.json();
  }
};
