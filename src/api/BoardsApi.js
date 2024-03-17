import { METHOD, _promise } from "./ApiConfig";

export function findBoards() {
  return _promise(METHOD.GET, `boards/visible`);
}

export function findBoard(id) {
  return _promise(METHOD.GET, `boards/${id}`);
}
