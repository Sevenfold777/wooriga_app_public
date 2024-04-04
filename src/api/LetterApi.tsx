import {METHOD, _promise} from './ApiConfig';

type LetterType = {
  id: number;
  title: string;
  payload: string;
  emotion: string;
  isTimeCapsule: boolean;
  receiveDate?: Date;
  receivers: number[];
  isTemp?: boolean;
};

export function findLettersReceivedApi({prev = 0, isTimeCapsule = false}) {
  return _promise(
    METHOD.GET,
    `letter/received?isTimeCapsule=${isTimeCapsule}&prev=${prev}`,
  );
}

export function findLettersSentApi({prev = 0, isTimeCapsule = false}) {
  return _promise(
    METHOD.GET,
    `letter/sent?isTimeCapsule=${isTimeCapsule}&prev=${prev}`,
  );
}

export function findLetterReceivedApi({id}: {id: number}) {
  return _promise(METHOD.GET, `letter/received/${id}`);
}

export function findLetterSentApi({id}: {id: number}) {
  return _promise(METHOD.GET, `letter/sent/${id}`);
}

export function findLettersKeptApi({prev = 0}) {
  return _promise(METHOD.GET, `letter/kept?prev=${prev}`);
}

export function keepLetterApi({id}: {id: number}) {
  return _promise(METHOD.POST, `letter/${id}/keep`);
}

export function unkeepLetterApi({id}: {id: number}) {
  return _promise(METHOD.DELETE, `letter/${id}/keep`);
}

export function readLetterApi({id}: {id: number}) {
  return _promise(METHOD.PATCH, `letter/${id}/read`);
}

export function deleteLetterApi({id}: {id: number}) {
  return _promise(METHOD.DELETE, `letter/${id}`);
}

export function editLetterApi({
  id,
  title,
  payload,
  emotion,
  isTimeCapsule,
  receiveDate,
  receivers,
  isTemp = false,
}: LetterType) {
  return _promise(METHOD.PATCH, `letter/${id}`, {
    title,
    payload,
    emotion,
    isTimeCapsule,
    receiveDate,
    receivers,
    isTemp,
  });
}

export function sendLetterApi({
  title,
  payload,
  emotion,
  isTimeCapsule,
  receiveDate,
  receivers,
  isTemp = false,
}: LetterType) {
  return _promise(METHOD.POST, 'letter', {
    title,
    payload,
    emotion,
    isTimeCapsule,
    receiveDate,
    receivers,
    isTemp,
  });
}

export function getLetterNotifApi() {
  return _promise(METHOD.GET, 'letter/home');
}

export function getLetterGuideApi() {
  return _promise(METHOD.GET, 'letter/guide');
}
