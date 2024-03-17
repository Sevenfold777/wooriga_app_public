import { METHOD, _promise } from "./ApiConfig";

/** Message: Private */
export function findMessageFamilyApi(id) {
  return _promise(METHOD.GET, `message/family/${id}`);
}

export function findMessageFamilyTodayApi() {
  return _promise(METHOD.GET, `message/family/today`);
}

export function findMessageFamilyTodayCntApi() {
  return _promise(METHOD.GET, `message/family/today/count`);
}

export function findMessageFamilyTodayAllApi({ prev }) {
  return _promise(METHOD.GET, `message/family/today/all?prev=${prev}`);
}

export function findFamilyMessagesApi({ prev }) {
  return _promise(METHOD.GET, `message/family?prev=${prev}`);
}

export function commentMessageFamApi({ id, payload }) {
  return _promise(METHOD.POST, `message/family/comments/${id}`, payload);
}

export function findMessageFamCommentsApi({ id, prev }) {
  return _promise(METHOD.GET, `message/family/comments/${id}?prev=${prev}`);
}

export function deleteMessageFamCommentApi(id) {
  return _promise(METHOD.DELETE, `message/family/comments/${id}`);
}

/** Message: Public */
export function findMessageApi(id) {
  return _promise(METHOD.GET, `messages/${id}`);
}

export function findAllMessages() {
  return _promise(METHOD.GET, `messages?limit=10`);
}

export function findMessageCommentsApi({ id, prev }) {
  return _promise(METHOD.GET, `message/comments/${id}?prev=${prev}`);
}

export function commentMessageApi({ id, payload }) {
  return _promise(METHOD.POST, `message/comments/${id}`, payload);
}

export function deleteMessageCommentApi(id) {
  return _promise(METHOD.DELETE, `message/comments/${id}`);
}

export function likeFamilyCommentApi(id) {
  return _promise(METHOD.POST, `message/family/comments/${id}/like`);
}

export function unlikeFamilyCommentApi(id) {
  return _promise(METHOD.DELETE, `message/family/comments/${id}/unlike`);
}

export function likeCommentApi(id) {
  return _promise(METHOD.POST, `message/comments/${id}/like`);
}

export function unlikeCommentApi(id) {
  return _promise(METHOD.DELETE, `message/comments/${id}/unlike`);
}

export function metooMessageApi(id) {
  return _promise(METHOD.POST, `messages/${id}/metoo`);
}

export function deleteMetooMessageApi(id) {
  return _promise(METHOD.DELETE, `messages/${id}/metoo`);
}

export function metooMessageFamApi(id) {
  return _promise(METHOD.POST, `message/family/${id}/metoo`);
}

export function deleteMetooMessageFamApi(id) {
  return _promise(METHOD.DELETE, `message/family/${id}/metoo`);
}

export function keepMessageFamApi(id) {
  return _promise(METHOD.POST, `message/family/${id}/keep`);
}

export function deleteKeepMessageFamApi(id) {
  return _promise(METHOD.DELETE, `message/family/${id}/keep`);
}

export function findMessageFamKeptApi({ prev }) {
  return _promise(METHOD.GET, `message/family/keep?prev=${prev}`);
}

export function sendMessageFamilyApi({ messageId, isNow }) {
  return _promise(METHOD.POST, `message/family`, { messageId, isNow });
}

/** Intergrated from Voice */

export function sendMessageApi({ payload, emotion, isNow = true }) {
  return _promise(METHOD.POST, `messages`, { payload, emotion, isNow });
}

export function findMyMessagesApi({ prev }) {
  return _promise(METHOD.GET, `messages/my?prev=${prev}`);
  // return _promise(METHOD.GET, `messages/my?take=${take}&prev=${prev}`);
}

export function deleteMessageApi(id) {
  return _promise(METHOD.DELETE, `messages/${id}`);
}

export function editMessageApi({ id, payload, emotion, isNow }) {
  return _promise(METHOD.PATCH, `messages/${id}`, { payload, emotion, isNow });
}

export function keepMessageApi(id) {
  return _promise(METHOD.POST, `messages/${id}/keep`);
}

export function deleteKeepMessageApi(id) {
  return _promise(METHOD.DELETE, `messages/${id}/keep`);
}

export function findMessageKeptApi({ prev }) {
  return _promise(METHOD.GET, `messages/keep?prev=${prev}`);
}

export function findMessageLatestApi() {
  return _promise(METHOD.GET, `message/family/latest`);
  // return _promise(METHOD.GET, `message/family/today`);
}
