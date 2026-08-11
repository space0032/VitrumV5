import { apiFetch } from '../utils/api';
import { AuthUser } from '../types';

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  employee_id: string;
  employee_name: string;
  department: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
}

export const authRepository = {
  login: async (identifier: string, password: string): Promise<LoginResponse> =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  register: async (payload: RegisterPayload): Promise<AuthUser> =>
    apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  changePassword: async (
    current_password: string,
    new_password: string,
    confirm_password: string
  ): Promise<{ detail: string }> =>
    apiFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password, confirm_password }),
    }),

  me: async (): Promise<AuthUser> => apiFetch('/api/auth/me'),
};
