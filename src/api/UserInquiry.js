import { METHOD, _promise } from "./ApiConfig";

export function createInquiryApi({ title, payload }) {
  return _promise(METHOD.POST, `userInquiry`, { title, payload });
}

export function deleteInquiryApi({ id }) {
  return _promise(METHOD.DELETE, `userInquiry/${id}`);
}

export function editInquiryApi({ id, title, payload }) {
  return _promise(METHOD.PATCH, `userInquiry/${id}`, {
    ...(title && { title }),
    ...(payload && { payload }),
  });
}

export function findInquiriesApi({ prev }) {
  return _promise(METHOD.GET, `userInquiry?prev=${prev}`);
}

export function findInquiryApi({ id }) {
  return _promise(METHOD.GET, `userInquiry/${id}`);
}
