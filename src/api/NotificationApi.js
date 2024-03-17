import { METHOD, _promise } from "./ApiConfig";

export function findReceivedNotificationsApi({ prev }) {
  return _promise(METHOD.GET, `notifications/received?prev=${prev}`);
}

export function deleteNotificationApi({ id }) {
  return _promise(METHOD.DELETE, `notifications/${id}`);
}
