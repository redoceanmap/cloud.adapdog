import { apiClient } from './client';
import type {
  AuthResponse,
  LoginPayload,
  PasswordResetConfirmPayload,
  PasswordResetVerifyResult,
  SignupPayload,
} from '@/types/auth';
import { saveAuthToken } from '@/utils/authToken';

interface TokenResponse {
  access_token: string;
  token_type?: string;
}

interface AccountResponse {
  id: number;
  email: string;
  nickname: string;
}

interface SignupApiResponse extends TokenResponse {
  account: AccountResponse;
}

interface MessageResponse {
  message: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { access_token } = await apiClient<TokenResponse>('/users/account/login', {
    method: 'POST',
    body: { email: payload.email, password: payload.password },
  });

  saveAuthToken(access_token);

  return {
    user: {
      id: payload.email,
      name: payload.email.split('@')[0] ?? '회원',
      email: payload.email,
    },
    token: access_token,
  };
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const { access_token, account } = await apiClient<SignupApiResponse>('/users/account/signup', {
    method: 'POST',
    body: {
      email: payload.email,
      password: payload.password,
      nickname: payload.name,
      pet: {
        name: payload.name ? `${payload.name}의 반려견` : '반려견',
        breed: '믹스견',
        photo_url: '',
      },
    },
  });

  saveAuthToken(access_token);

  return {
    user: {
      id: String(account.id),
      name: account.nickname,
      email: account.email,
    },
    token: access_token,
  };
}

export async function requestPasswordReset(email: string): Promise<string> {
  const result = await apiClient<MessageResponse>('/users/account/password-reset/request', {
    method: 'POST',
    body: { email },
  });
  return result.message;
}

export async function verifyPasswordResetToken(token: string): Promise<PasswordResetVerifyResult> {
  return apiClient<PasswordResetVerifyResult>('/users/account/password-reset/verify', {
    params: { token },
  });
}

export async function resetPassword(payload: PasswordResetConfirmPayload): Promise<string> {
  const result = await apiClient<MessageResponse>('/users/account/password-reset/confirm', {
    method: 'POST',
    body: payload,
  });
  return result.message;
}
