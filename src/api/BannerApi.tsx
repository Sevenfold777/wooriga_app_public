import {METHOD, _promise} from './ApiConfig';

export function findBannersHomeApi() {
  return _promise(METHOD.GET, 'banners/home');
}

export function findBannersBarApi({screen}: {screen: string}) {
  return _promise(METHOD.GET, `banners/bar?screen=${screen}`);
}
