import {METHOD, _promise} from './ApiConfig';

type EmotionType = {
  type: string;
};

export function findMyEmotionTodayApi() {
  return _promise(METHOD.GET, 'emotions/today/my');
}

export function findFamEmotionsTodayApi() {
  return _promise(METHOD.GET, 'emotions/today/family');
}

export function createDailyEmotionApi(type: EmotionType) {
  // type: {type: enum}
  return _promise(METHOD.POST, 'emotions', type);
}

export function editDailyEmotionApi({
  id,
  type,
}: {
  id: number;
  type: EmotionType;
}) {
  return _promise(METHOD.PATCH, `emotions/${id}`, {type});
}

export function deleteDailyEmotionApi(id: number) {
  return _promise(METHOD.DELETE, `emotions/${id}`);
}

export function findFamilyEmotionsApi({prev}: {prev: number}) {
  return _promise(METHOD.GET, `emotions?prev=${prev}`);
}

export function pokeFamilyMemberApi({targetId}: {targetId: number}) {
  return _promise(METHOD.POST, 'emotions/poke', {targetId});
}
