import { _promise } from "./ApiConfig";
import { METHOD } from "./ApiConfig";

export function findBalanceGamesApi({ prev }) {
  return _promise(METHOD.GET, `balanceGame?prev=${prev}`);
}

export function findBalanceGameApi({ id }) {
  return _promise(METHOD.GET, `balanceGame/${id}`);
}

export function choiceSelectionApi({ id, choice }) {
  return _promise(METHOD.POST, `balanceGame/${id}/choice?choice=${choice}`);
}

export function changeSelectionApi({ id, choice }) {
  return _promise(METHOD.PATCH, `balanceGame/${id}/choice?choice=${choice}`);
}

export function deleteSelectionApi({ id }) {
  return _promise(METHOD.DELETE, `balanceGame/${id}/choice`);
}

export function commentBalanceGameApi({ id, payload }) {
  return _promise(METHOD.POST, `balanceGame/${id}/comment`, payload);
}

export function deleteCommentBalanceGameApi({ id }) {
  return _promise(METHOD.DELETE, `balanceGame/${id}/comment`);
}

export function findBalanceGameCommentsApi({ id, prev }) {
  return _promise(METHOD.GET, `balanceGame/${id}/comment?prev=${prev}`);
}

export function findBalanceGameChoicesApi({ id }) {
  return _promise(METHOD.GET, `balanceGame/${id}/choice`);
}

export function findBalanceGameChoicesFamilyApi({ id }) {
  return _promise(METHOD.GET, `balanceGame/${id}/choice/family`);
}

export function findBalanceGameRecommendedApi() {
  return _promise(METHOD.GET, `balanceGame/recommend`);
}

export function commentFamilyBalanceGameApi({ id, payload }) {
  return _promise(METHOD.POST, `balanceGame/${id}/family/comment`, payload);
}

export function deleteFamilyCommentBalanceGameApi({ id }) {
  return _promise(METHOD.DELETE, `balanceGame/${id}/family/comment`);
}

export function findBalanceGameFamilyCommentsApi({ id, prev }) {
  return _promise(METHOD.GET, `balanceGame/${id}/family/comment?prev=${prev}`);
}

// export function shareBalanceGameToFamilyApi({ id }) {
//   return _promise(METHOD.POST, `balanceGame/${id}/share/family`);
// }
