import {METHOD, _promise} from './ApiConfig';

export function findMyFamilyApi(exceptMe = false) {
  return _promise(METHOD.GET, `family/my?exceptMe=${exceptMe}`);
}

export function inviteFamilyApi() {
  return _promise(METHOD.POST, 'family/invite');
}

export function joinFamilyApi(familyToken: string) {
  return _promise(METHOD.PATCH, `family/join/${familyToken}`);
}
