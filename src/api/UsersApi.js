import { METHOD, _promise } from "./ApiConfig";

export function myProfile() {
  return _promise(METHOD.GET, "users/my");
}

export function editUserApi(payload) {
  return _promise(METHOD.PATCH, "users", payload);
}
