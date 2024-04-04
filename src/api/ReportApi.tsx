import {METHOD, _promise} from './ApiConfig';

export enum ReportType {
  PRIVACY = '개인정보 유출',
  ABNORMAL = '부적절 메세지 (폭력, 비속어, 음란 등)',
  SPAM = '허위 사실 유포 또는 도배',
  OFFENSIVE = '불쾌감 또는 혐오감 유발',
  DISTURB = '서비스 이용 방해',
  INFRIDGE = '권리 침해 또는 창작물 무단 유포',
  ETC = '기타',
}

export enum ReportTarget {
  MESSAGE_PUBLIC = 'message',
  MESSAGE_FAMILY = 'messageFamily',
  MESSAGE_PUBLIC_COMMENT = 'messageComment',
  MESSAGE_FAMILY_COMMENT = 'messageFamilyComment',
  BALANCE_GAME_COMMENT = 'balanceGameComment',
  PHOTO = 'photo',
  PHOTO_COMMENT = 'photoComment',
}

export function createReportApi({
  targetType,
  targetId,
  reportType,
  payload,
}: {
  targetType: ReportTarget;
  targetId: number;
  reportType: ReportType;
  payload?: string;
}) {
  return _promise(METHOD.POST, 'communityReport', {
    targetType,
    targetId,
    reportType,
    ...(payload && {payload}),
  });
}
