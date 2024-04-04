import {METHOD, _promise} from './ApiConfig';

export function createInquiryApi({
  title,
  payload,
}: {
  title: string;
  payload: string;
}) {
  return _promise(METHOD.POST, 'userInquiry', {title, payload});
}

export function deleteInquiryApi({id}: {id: number}) {
  return _promise(METHOD.DELETE, `userInquiry/${id}`);
}

export function editInquiryApi({
  id,
  title,
  payload,
}: {
  id: number;
  title: string;
  payload: string;
}) {
  return _promise(METHOD.PATCH, `userInquiry/${id}`, {
    ...(title && {title}),
    ...(payload && {payload}),
  });
}

export function findInquiriesApi({prev = 0}) {
  return _promise(METHOD.GET, `userInquiry?prev=${prev}`);
}

export function findInquiryApi({id}: {id: number}) {
  return _promise(METHOD.GET, `userInquiry/${id}`);
}
