import {METHOD, _promise} from './ApiConfig';

export function findReceivedNotificationsApi({prev = 0}) {
  return _promise(METHOD.GET, `notifications/received?prev=${prev}`);
}

export function deleteNotificationApi({id}: {id: number}) {
  return _promise(METHOD.DELETE, `notifications/${id}`);
}
