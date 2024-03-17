import { METHOD, _promise } from "./ApiConfig";

export function findMyEmotionTodayApi() {
  return _promise(METHOD.GET, `emotions/today/my`);
}

export function findFamEmotionsTodayApi() {
  return _promise(METHOD.GET, `emotions/today/family`);
}

export function createDailyEmotionApi(type) {
  // type: {type: enum}
  return _promise(METHOD.POST, `emotions`, type);
}

export function editDailyEmotionApi({ id, type }) {
  return _promise(METHOD.PATCH, `emotions/${id}`, { type });
}

export function deleteDailyEmotionApi(id) {
  return _promise(METHOD.DELETE, `emotions/${id}`);
}

export function findFamilyEmotionsApi({ prev }) {
  return _promise(METHOD.GET, `emotions?prev=${prev}`);
}

export function pokeFamilyMemberApi({ targetId }) {
  return _promise(METHOD.POST, `emotions/poke`, { targetId });
}
