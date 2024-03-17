import { METHOD, _promise } from "./ApiConfig";

export function findBannersHomeApi() {
  return _promise(METHOD.GET, `banners/home`);
}

export function findBannersBarApi({ screen }) {
  return _promise(METHOD.GET, `banners/bar?screen=${screen}`);
}
