import { METHOD, _promise } from "./ApiConfig";

export function loginApi(payload) {
  return _promise(METHOD.POST, "users/login", payload);
}

export function createAccountApi(payload) {
  return _promise(METHOD.POST, "users", payload);
}

export function socialLoginApi(payload) {
  return _promise(METHOD.POST, "users/login/social", payload);
}

export function refreshTokenApi() {
  return _promise(METHOD.PATCH, "users/refreshToken");
}

export function quitServiceApi() {
  return _promise(METHOD.DELETE, "users");
}
