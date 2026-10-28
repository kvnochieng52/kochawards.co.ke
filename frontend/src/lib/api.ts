import type { Campaign, Nominee } from './types';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const TOKEN_KEY = 'kura_admin_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface FetchOpts extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  isFormData?: boolean;
}

export async function api<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { body, headers = {}, auth, isFormData, ...rest } = opts;

  const h: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };
  if (!isFormData && body !== undefined) h['Content-Type'] = 'application/json';

  if (auth) {
    const t = getToken();
    if (t) h['Authorization'] = `Bearer ${t}`;
  }

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const res = await fetch(url, {
    ...rest,
    headers: h,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    cache: 'no-store',
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const message = json?.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, message, json?.errors);
  }
  return json as T;
}

async function downloadCsv(path: string, defaultBaseName: string): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'text/csv',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new ApiError(res.status, `Export failed (${res.status})`);
  }

  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] || `${defaultBaseName}-${Date.now()}.csv`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* -------------------- Typed shortcuts -------------------- */

interface Wrapped<T> {
  data: T;
}

export interface SearchCampaignHit {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  category: string | null;
  location: string | null;
  status: 'live' | 'upcoming' | 'ended';
  featuredImage: string | null;
}

export interface SearchNomineeHit {
  id: string;
  slug: string;
  code: string;
  fullName: string;
  photo: string | null;
  category: string | null;
  location: string | null;
  votes: number;
  campaign: {
    id: string;
    slug: string;
    title: string;
    status: 'live' | 'upcoming' | 'ended';
  } | null;
}

export interface SearchResponse {
  query: string;
  campaigns: SearchCampaignHit[];
  nominees: SearchNomineeHit[];
}

export const publicApi = {
  campaigns: () =>
    api<Wrapped<Campaign[]>>('/campaigns').then((r) => r.data),
  campaign: (slug: string) =>
    api<Wrapped<Campaign>>(`/campaigns/${slug}`).then((r) => r.data),
  campaignNominees: (slug: string) =>
    api<Wrapped<Nominee[]>>(`/campaigns/${slug}/nominees`).then((r) => r.data),
  nominee: (id: string | number) =>
    api<Wrapped<Nominee>>(`/nominees/${id}`).then((r) => r.data),
  trending: (limit = 6) =>
    api<Wrapped<Nominee[]>>(`/nominees/trending?limit=${limit}`).then((r) => r.data),
  search: (q: string, opts: { signal?: AbortSignal; limit?: number } = {}) =>
    api<SearchResponse>(
      `/search?q=${encodeURIComponent(q)}${opts.limit ? `&limit=${opts.limit}` : ''}`,
      { signal: opts.signal }
    ),
};

export const authApi = {
  login: (email: string, password: string) =>
    api<{ token: string; user: { id: number; name: string; email: string; is_admin: boolean } }>(
      '/auth/login',
      { method: 'POST', body: { email, password } }
    ),
  me: () =>
    api<{ user: { id: number; name: string; email: string; is_admin: boolean } }>(
      '/auth/me',
      { auth: true }
    ),
  logout: () => api('/auth/logout', { method: 'POST', auth: true }),
};

export const voteApi = {
  initiate: (payload: { nominee_id: number; phone: string; amount: number }) =>
    api<Wrapped<any> & { message: string }>('/votes/initiate', {
      method: 'POST',
      body: payload,
    }),
  status: (voteId: number | string) =>
    api<Wrapped<any>>(`/votes/${voteId}/status`),
  simulate: (voteId: number | string) =>
    api<Wrapped<any>>(`/votes/${voteId}/simulate`, { method: 'POST' }),
};

export interface DonationRecord {
  id: string;
  program: string;
  donorName: string | null;
  phone: string;
  amountKes: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  mpesaReceipt: string | null;
  mpesaCheckoutRequestId: string | null;
  paidAt: string | null;
  createdAt: string | null;
}

export const donationApi = {
  initiate: (payload: {
    program?: string;
    donor_name?: string;
    phone: string;
    amount: number;
  }) =>
    api<Wrapped<DonationRecord> & { message: string }>('/donations/initiate', {
      method: 'POST',
      body: payload,
    }),
  status: (id: number | string) =>
    api<Wrapped<DonationRecord>>(`/donations/${id}/status`),
};

export const contactApi = {
  send: (payload: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    source?: string;
  }) =>
    api<{ message: string; data: { id: string } }>('/contact', {
      method: 'POST',
      body: payload,
    }),
};

export const adminApi = {
  stats: () => api<any>('/admin/stats', { auth: true }),

  listCampaigns: () =>
    api<Wrapped<Campaign[]>>('/admin/campaigns', { auth: true }).then((r) => r.data),
  createCampaign: (payload: Record<string, any>) =>
    api<Wrapped<Campaign>>('/admin/campaigns', {
      method: 'POST',
      body: payload,
      auth: true,
    }),
  updateCampaign: (id: number | string, payload: Record<string, any>) =>
    api<Wrapped<Campaign>>(`/admin/campaigns/${id}`, {
      method: 'PUT',
      body: payload,
      auth: true,
    }),
  deleteCampaign: (id: number | string) =>
    api(`/admin/campaigns/${id}`, { method: 'DELETE', auth: true }),

  listNominees: (params: { campaign_id?: number | string; search?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.campaign_id) qs.set('campaign_id', String(params.campaign_id));
    if (params.search) qs.set('search', params.search);
    const suffix = qs.toString() ? `?${qs}` : '';
    return api<Wrapped<Nominee[]>>(`/admin/nominees${suffix}`, { auth: true }).then(
      (r) => r.data
    );
  },
  getNominee: (id: number | string) =>
    api<Wrapped<Nominee>>(`/admin/nominees/${id}`, { auth: true }).then((r) => r.data),
  createNominee: (payload: Record<string, any>) =>
    api<Wrapped<Nominee>>('/admin/nominees', {
      method: 'POST',
      body: payload,
      auth: true,
    }),
  updateNominee: (id: number | string, payload: Record<string, any>) =>
    api<Wrapped<Nominee>>(`/admin/nominees/${id}`, {
      method: 'PUT',
      body: payload,
      auth: true,
    }),
  deleteNominee: (id: number | string) =>
    api(`/admin/nominees/${id}`, { method: 'DELETE', auth: true }),

  payments: (
    params: {
      status?: string;
      range?: string;
      search?: string;
      page?: number;
      per_page?: number;
    } = {},
  ) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.range) qs.set('range', params.range);
    if (params.search) qs.set('search', params.search);
    if (params.page) qs.set('page', String(params.page));
    if (params.per_page) qs.set('per_page', String(params.per_page));
    return api<any>(`/admin/payments?${qs}`, { auth: true });
  },

  paymentsExport: async (
    params: { status?: string; range?: string; search?: string } = {},
  ) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.range) qs.set('range', params.range);
    if (params.search) qs.set('search', params.search);
    await downloadCsv(`/admin/payments/export?${qs}`, 'payments');
  },

  donations: (
    params: {
      status?: string;
      range?: string;
      search?: string;
      program?: string;
      page?: number;
      per_page?: number;
    } = {},
  ) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.range) qs.set('range', params.range);
    if (params.search) qs.set('search', params.search);
    if (params.program) qs.set('program', params.program);
    if (params.page) qs.set('page', String(params.page));
    if (params.per_page) qs.set('per_page', String(params.per_page));
    return api<any>(`/admin/donations?${qs}`, { auth: true });
  },

  donationsExport: async (
    params: { status?: string; range?: string; search?: string; program?: string } = {},
  ) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.range) qs.set('range', params.range);
    if (params.search) qs.set('search', params.search);
    if (params.program) qs.set('program', params.program);
    await downloadCsv(`/admin/donations/export?${qs}`, 'donations');
  },

  uploadImage: (file: File, kind: 'photo' | 'cover' | 'campaign' = 'photo') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('kind', kind);
    return api<{ path: string; url: string }>('/admin/uploads', {
      method: 'POST',
      body: fd,
      auth: true,
      isFormData: true,
    });
  },
};
