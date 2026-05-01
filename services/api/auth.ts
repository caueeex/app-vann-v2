import { api } from '@/services/api/client';

type BackendRole = 'admin' | 'condutor' | 'aluno';
type AppRole = 'driver' | 'parent';

interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: BackendRole;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

interface AuthEnvelope {
  success: boolean;
  data: {
    token: string;
    user: BackendUser;
  };
  message?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  cpf: string;
  role: AppRole;
}

function mapRole(role: BackendRole): AppRole {
  if (role === 'condutor') return 'driver';
  return 'parent';
}

function toAuthUser(user: BackendUser): AuthUser {
  const now = new Date().toISOString();
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: mapRole(user.role),
    status: user.status ?? 'active',
    phone: '',
    createdAt: user.created_at ?? now,
    updatedAt: user.updated_at ?? now,
  };
}

export async function loginRequest(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post<AuthEnvelope>('/auth/login', { email, password });
  return { token: data.data.token, user: toAuthUser(data.data.user) };
}

export async function registerRequest(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
  const backendRole: BackendRole = payload.role === 'driver' ? 'condutor' : 'aluno';
  const { data } = await api.post<AuthEnvelope>('/auth/register', {
    name: payload.name,
    email: payload.email,
    cpf: payload.cpf,
    role: backendRole,
  });
  return { token: data.data.token, user: toAuthUser(data.data.user) };
}

export async function meRequest(): Promise<AuthUser> {
  const { data } = await api.get<{ success: boolean; data: BackendUser; message?: string }>('/auth/me');
  return toAuthUser(data.data);
}

export async function logoutRequest(): Promise<void> {
  await api.post('/auth/logout');
}
