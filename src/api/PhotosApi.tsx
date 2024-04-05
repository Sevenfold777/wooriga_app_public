import {Asset} from 'expo-media-library';
import {preparePhotosToUpload} from '../helper';
import {METHOD, _promise} from './ApiConfig';

export async function createPhotoApi({
  theme,
  payload,
  files,
}: {
  theme: string;
  payload: string;
  files: Asset[];
}) {
  const fileFormData = new FormData();

  const result = await preparePhotosToUpload({fileFormData, files});

  if (!result) {
    return;
  }

  const body = fileFormData;
  body.append('theme', theme);
  body.append('payload', payload);

  return _promise(METHOD.POST_FILES, 'photos', body);
}

export function deletePhotoApi(id: number) {
  return _promise(METHOD.DELETE, `photos/${id}`);
}

export function findPhotoApi(id: number) {
  return _promise(METHOD.GET, `photos/${id}`);
}

export function findPhotosFamilyApi(prev = 0) {
  return _promise(METHOD.GET, `photos/family?prev=${prev}`);
}

export function findMyPhotosApi(prev = 0) {
  return _promise(METHOD.GET, `photos/my?prev=${prev}`);
}

export function findPhotoCommentsApi({
  id,
  prev = 0,
}: {
  id: number;
  prev: number;
}) {
  return _promise(METHOD.GET, `photo/comments/${id}?prev=${prev}`);
}

export function commentPhotoApi({
  id,
  payload,
}: {
  id: number;
  payload: {payload: string};
}) {
  return _promise(METHOD.POST, `photo/comments/${id}`, payload);
}

export function deletePhotoCommentApi(id: number) {
  return _promise(METHOD.DELETE, `photo/comments/${id}`);
}

export function editPhotoCommentApi({
  id,
  payload,
}: {
  id: number;
  payload: string;
}) {
  return _promise(METHOD.PATCH, `photo/comments/${id}`, payload);
}

export function findPhotoLikes(id: number) {
  return _promise(METHOD.GET, `photos/${id}/likes`);
}

export function likePhotoApi(id: number) {
  return _promise(METHOD.POST, `photos/${id}/like`);
}

export function unlikePhotoApi(id: number) {
  return _promise(METHOD.DELETE, `photos/${id}/unlike`);
}

export function findPhotoThemeTodayApi() {
  return _promise(METHOD.GET, 'photo/themes/today');
}

export function findPhotoThemesApi({prev = 0}) {
  return _promise(METHOD.GET, `photo/themes?prev=${prev}`);
}
