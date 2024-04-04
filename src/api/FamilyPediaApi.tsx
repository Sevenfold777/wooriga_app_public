import {Asset} from 'expo-media-library';
import {preparePhotosToUpload} from '../helper';
import {_promise} from './ApiConfig';
import {METHOD} from './ApiConfig';

/** Familypedia 수정 예정 => 임시로 any 타입 사용 */

export function findAllFamilyPediaApi() {
  return _promise(METHOD.GET, 'familyPedia');
}

export function findFamilyPediaApi(id: number) {
  return _promise(METHOD.GET, `familyPedia/${id}`);
}

export function createRowsApi({id, rows}: {id: number; rows: any}) {
  // console.log(rows);
  // rows: {payloads: string[], tags:string}[]
  return _promise(METHOD.POST, `familyPedia/${id}`, rows);
}

export function editRowsApi({id, rows}: {id: number; rows: any}) {
  return _promise(METHOD.PATCH, `familyPedia/${id}/rows`, rows);
}

export function deleteRowsApi({id, rows}: {id: number; rows: any}) {
  return _promise(METHOD.DELETE, `familyPedia/${id}/rows`, rows);
}

export async function editFamilyPediaApi({
  id,
  profilePhoto,
}: {
  id: number;
  profilePhoto: Asset;
}) {
  const body = new FormData();
  await preparePhotosToUpload({fileFormData: body, files: profilePhoto});

  return _promise(METHOD.POST_FILES, `familyPedia/${id}/profilePhoto`, body);
}
