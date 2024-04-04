import {METHOD, _promise} from './ApiConfig';

/** Message: Private */
export function findMessageFamilyApi(id: number) {
  return _promise(METHOD.GET, `message/family/${id}`);
}

export function findMessageFamilyTodayApi() {
  return _promise(METHOD.GET, 'message/family/today');
}

export function findMessageFamilyTodayCntApi() {
  return _promise(METHOD.GET, 'message/family/today/count');
}

export function findMessageFamilyTodayAllApi({prev = 0}) {
  return _promise(METHOD.GET, `message/family/today/all?prev=${prev}`);
}

export function findFamilyMessagesApi({prev = 0}) {
  return _promise(METHOD.GET, `message/family?prev=${prev}`);
}

export function commentMessageFamApi({
  id,
  payload,
}: {
  id: number;
  payload: {payload: string};
}) {
  return _promise(METHOD.POST, `message/family/comments/${id}`, payload);
}

export function findMessageFamCommentsApi({
  id,
  prev = 0,
}: {
  id: number;
  prev: number;
}) {
  return _promise(METHOD.GET, `message/family/comments/${id}?prev=${prev}`);
}

export function deleteMessageFamCommentApi(id: number) {
  return _promise(METHOD.DELETE, `message/family/comments/${id}`);
}

export function keepMessageFamApi(id: number) {
  return _promise(METHOD.POST, `message/family/${id}/keep`);
}

export function deleteKeepMessageFamApi(id: number) {
  return _promise(METHOD.DELETE, `message/family/${id}/keep`);
}

export function findMessageFamKeptApi({prev = 0}) {
  return _promise(METHOD.GET, `message/family/keep?prev=${prev}`);
}

export function sendMessageFamilyApi({
  messageId,
  isNow,
}: {
  messageId: number;
  isNow: boolean;
}) {
  return _promise(METHOD.POST, 'message/family', {messageId, isNow});
}

/** Intergrated from Voice */

export function sendMessageApi({
  payload,
  emotion,
  isNow = true,
}: {
  payload: string;
  emotion: string;
  isNow: boolean;
}) {
  return _promise(METHOD.POST, 'messages', {payload, emotion, isNow});
}

export function findMyMessagesApi({prev = 0}) {
  return _promise(METHOD.GET, `messages/my?prev=${prev}`);
  // return _promise(METHOD.GET, `messages/my?take=${take}&prev=${prev}`);
}

export function deleteMessageApi(id: number) {
  return _promise(METHOD.DELETE, `messages/${id}`);
}

export function editMessageApi({
  id,
  payload,
  emotion,
  isNow,
}: {
  id: number;
  payload: string;
  emotion: string;
  isNow: boolean;
}) {
  return _promise(METHOD.PATCH, `messages/${id}`, {payload, emotion, isNow});
}

export function keepMessageApi(id: number) {
  return _promise(METHOD.POST, `messages/${id}/keep`);
}

export function deleteKeepMessageApi(id: number) {
  return _promise(METHOD.DELETE, `messages/${id}/keep`);
}

export function findMessageKeptApi({prev = 0}) {
  return _promise(METHOD.GET, `messages/keep?prev=${prev}`);
}

export function findMessageLatestApi() {
  return _promise(METHOD.GET, 'message/family/latest');
  // return _promise(METHOD.GET, `message/family/today`);
}
