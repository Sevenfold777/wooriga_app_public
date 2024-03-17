import { preparePhotosToUpload } from "../helper";
import { _promise } from "./ApiConfig";
import { METHOD } from "./ApiConfig";

export function findAllFamilyPediaApi() {
  return _promise(METHOD.GET, `familyPedia`);
}

export function findFamilyPediaApi(id) {
  return _promise(METHOD.GET, `familyPedia/${id}`);
}

export function createRowsApi({ id, rows }) {
  // console.log(rows);
  // rows: {payloads: string[], tags:string}[]
  return _promise(METHOD.POST, `familyPedia/${id}`, rows);
}

export function editRowsApi({ id, rows }) {
  return _promise(METHOD.PATCH, `familyPedia/${id}/rows`, rows);
}

export function deleteRowsApi({ id, rows }) {
  return _promise(METHOD.DELETE, `familyPedia/${id}/rows`, rows);
}

export async function editFamilyPediaApi({ id, profilePhoto }) {
  const body = new FormData();
  await preparePhotosToUpload({ fileFormData: body, files: profilePhoto });

  return _promise(METHOD.POST_FILES, `familyPedia/${id}/profilePhoto`, body);
}
