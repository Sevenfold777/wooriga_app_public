import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

/* 1. Signed In Nav (Stack) */
export type SignedInParams = {
  MainTabNav: NavigatorScreenParams<MainTabParams>;

  MessageFamily: {messageId: number};
  MessagePast: undefined;

  PhotoSelect: undefined;
  PhotoUpload: undefined;
  Photo: {id: number};
  PhotoComments: {id: number};

  ChangeNickname: undefined;
  BannersPayload: undefined;
  Notifications: undefined;

  FamilyJoin: {id: number};

  FamilyPediaMember: {id: number};
  FamilyPediaSelectPhoto: undefined;

  Report: undefined;

  TermsOfUse: undefined;
  OperationPolicy: undefined;
  PrivacyPolicy: undefined;

  UserInquirySend: undefined;
  UserInquiryList: undefined;
  UserInquiry: undefined;

  LetterSend: undefined;
  LetterCompleted: undefined;
  LetterSent: undefined;
  LetterReceived: undefined;

  LetterBoxNav: NavigatorScreenParams<LetterBoxParams>;
  TimeCapsulesNav: NavigatorScreenParams<TimeCapsuleParams>;

  // my page
  MyPageNav: NavigatorScreenParams<MyPageParams>;
  EditMyProfile: undefined;
  EditFamilyProfile: undefined;
  DailyEmotionsPast: undefined;
  PhotosMy: undefined;
  MessageKeep: undefined;
  LetterReceivedKept: undefined;
  Settings: undefined;
  Infos: undefined;
  OpenSourceLicense: undefined;
  OpenSourceLicensePayload: undefined;
  PushNotifSettings: undefined;
  Quit: undefined;
};

export type SignedInScreenProps<T extends keyof SignedInParams> =
  StackScreenProps<SignedInParams, T>;

/* 2. Main Tab Nav (Bottom Tab) */
export type MainTabParams = {
  MessageHome: {openEmotionSelection: boolean} | undefined;
  PhotoHome: undefined;
  LetterHome: undefined;
  FamilyPediaHome: undefined;
  MyPageNav: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParams> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParams, T>,
    SignedInScreenProps<keyof SignedInParams>
  >;

/* 3. My Page Nav (Material Top Tab) */
export type MyPageParams = {
  MyPage: undefined;
  FamilyPage: undefined;
};

export type MyPageScreenProps<T extends keyof MyPageParams> =
  MaterialTopTabScreenProps<MyPageParams, T>;

/* 4. Letter Box Nav (Material Top Tab) */
export type LetterBoxParams = {
  LetterBoxSent: undefined;
  LetterBoxReceived: undefined;
};

export type LetterBoxScreenProps<T extends keyof LetterBoxParams> =
  MaterialTopTabScreenProps<LetterBoxParams, T>;

/* 5. Time Capsule Nav (Material Top Tab) */
export type TimeCapsuleParams = {
  TimeCapsuleSent: undefined;
  TimeCapsuleReceivd: undefined;
};

export type TimeCapsuleScreenProps<T extends keyof TimeCapsuleParams> =
  MaterialTopTabScreenProps<TimeCapsuleParams, T>;

/* 6. Signed Out Nav */
export type SignedOutParams = {
  SignIn: undefined;
  SignUp: undefined;

  TermsOfUse: undefined;
  OperationPolicy: undefined;
  PrivacyPolicy: undefined;
};

export type SignedOutScreenProps<T extends keyof SignedOutParams> =
  StackScreenProps<SignedOutParams, T>;

export type RootParams = {
  SignedInNav: NavigatorScreenParams<SignedInParams>;
  SignedOutNav: NavigatorScreenParams<SignedOutParams>;
};

declare global {
  namespace ReactNavigation {
    // interface RootParamList extends RootParams {}
    interface RootParamList extends SignedInParams {}
  }
}
