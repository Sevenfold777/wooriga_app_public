import { METHOD, _promise } from "./ApiConfig";

export function findLettersReceivedApi({ prev, isTimeCapsule = false }) {
  return _promise(
    METHOD.GET,
    `letter/received?isTimeCapsule=${isTimeCapsule}&prev=${prev}`
  );
}

export function findLettersSentApi({ prev, isTimeCapsule = false }) {
  return _promise(
    METHOD.GET,
    `letter/sent?isTimeCapsule=${isTimeCapsule}&prev=${prev}`
  );
}

export function findLetterReceivedApi({ id }) {
  return _promise(METHOD.GET, `letter/received/${id}`);
}

export function findLetterSentApi({ id }) {
  return _promise(METHOD.GET, `letter/sent/${id}`);
}

export function findLettersKeptApi({ prev }) {
  return _promise(METHOD.GET, `letter/kept?prev=${prev}`);
}

export function keepLetterApi({ id }) {
  return _promise(METHOD.POST, `letter/${id}/keep`);
}

export function unkeepLetterApi({ id }) {
  return _promise(METHOD.DELETE, `letter/${id}/keep`);
}

export function readLetterApi({ id }) {
  return _promise(METHOD.PATCH, `letter/${id}/read`);
}

export function deleteLetterApi({ id }) {
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
  themeId,
  isTemp = false,
}) {
  return _promise(METHOD.PATCH, `letter/${id}`, {
    title,
    payload,
    emotion,
    isTimeCapsule,
    receiveDate,
    receivers,
    themeId,
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
  themeId,
  isTemp = false,
}) {
  return _promise(METHOD.POST, `letter`, {
    title,
    payload,
    emotion,
    isTimeCapsule,
    receiveDate,
    receivers,
    themeId,
    isTemp,
  });
}

export function findLetterThemesApi({ prev }) {
  return _promise(METHOD.GET, `letter/themes?prev=${prev}`);
}

export function findLetterThemeApi({ id }) {
  return _promise(METHOD.GET, `letter/theme/${id}`);
}

export function getLetterNotifApi() {
  return _promise(METHOD.GET, `letter/home`);
}

export function getLetterGuideApi() {
  return _promise(METHOD.GET, `letter/guide`);
}
