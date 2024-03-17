import { preparePhotosToUpload } from "../helper";
import { METHOD, _promise } from "./ApiConfig";

// export function createPhotoApi(body) {
//   return _promise(METHOD.POST, "photos", body);
// }

export async function createPhotoApi({ theme, payload, files }) {
  const fileFormData = new FormData();

  const result = await preparePhotosToUpload({ fileFormData, files });

  if (!result) {
    return;
  }

  const body = fileFormData;
  body.append("theme", theme);
  body.append("payload", payload);

  return _promise(METHOD.POST_FILES, "photos", body);
}

export function deletePhotoApi(id) {
  return _promise(METHOD.DELETE, `photos/${id}`);
}

export function findPhotoApi(id) {
  return _promise(METHOD.GET, `photos/${id}`);
}

export function findPhotosFamilyApi(prev) {
  return _promise(METHOD.GET, `photos/family?prev=${prev}`);
}

export function findMyPhotosApi(prev) {
  return _promise(METHOD.GET, `photos/my?prev=${prev}`);
}

export function findPhotoCommentsApi({ id, prev }) {
  return _promise(METHOD.GET, `photo/comments/${id}?prev=${prev}`);
}

export function commentPhotoApi({ id, payload }) {
  return _promise(METHOD.POST, `photo/comments/${id}`, payload);
}

export function deletePhotoCommentApi(id) {
  return _promise(METHOD.DELETE, `photo/comments/${id}`);
}

export function editPhotoCommentApi({ id, payload }) {
  return _promise(METHOD.PATCH, `photo/comments/${id}`, payload);
}

export function likePhotoCommentApi(id) {
  return _promise(METHOD.POST, `photo/comments/${id}/like`);
}

export function unlikePhotoCommentApi(id) {
  return _promise(METHOD.DELETE, `photo/comments/${id}/unlike`);
}

export function findPhotoLikes(id) {
  return _promise(METHOD.GET, `photos/${id}/likes`);
}

export function likePhotoApi(id) {
  return _promise(METHOD.POST, `photos/${id}/like`);
}

export function unlikePhotoApi(id) {
  return _promise(METHOD.DELETE, `photos/${id}/unlike`);
}

export function findPhotoThemeTodayApi() {
  return _promise(METHOD.GET, `photo/themes/today`);
}

export function findPhotoThemesApi({ prev = 0 }) {
  return _promise(METHOD.GET, `photo/themes?prev=${prev}`);
}
