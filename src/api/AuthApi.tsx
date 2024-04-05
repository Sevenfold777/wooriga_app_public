import {METHOD, _promise} from './ApiConfig';

export function loginApi(payload: {
  token: string;
  provider: string;
  nonce?: string;
}) {
  return _promise(METHOD.POST, 'users/login', payload);
}

export function createAccountApi(payload: {
  email: string;
  userName: string;
  birthday: string;
  position: string;
  familyToken?: string;
  provider: string;
  mktPushAgreed: boolean;
  token: string;
  nonce?: string;
  isBirthLunar: boolean;
}) {
  return _promise(METHOD.POST, 'users', payload);
}

export function socialLoginApi(payload: string) {
  return _promise(METHOD.POST, 'users/login/social', payload);
}

export function refreshTokenApi() {
  return _promise(METHOD.PATCH, 'users/refreshToken');
}

export function quitServiceApi() {
  return _promise(METHOD.DELETE, 'users');
}
