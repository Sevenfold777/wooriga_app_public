import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {Asset} from 'expo-media-library';

/* 1. Signed In Nav (Stack) */
export type SignedInParams = {
  MainTabNav: NavigatorScreenParams<MainTabParams>;

  MessageFamily: {messageId: number};
  MessagePast: undefined;

  PhotoSelect: {isRecommend: boolean} | undefined;
  PhotoUpload: {chosenPhotos: Asset[]; isRecommend?: boolean};
  Photo: {photoId: number};
  PhotoComments: {
    photo: {
      author: {
        id: number;
        userName: string;
      };
      commentsCount: number;
      familyId: number;
      id: number;
      isLiked: boolean;
      likesCount: number;
      payload: string;
      theme: string;
    };
  };

  ChangeNickname: {id: number; name: string; nickname: string};
  BannersPayload: {url: string; title?: string};
  Notifications: undefined;

  FamilyJoin: {id: number};

  FamilyPediaMember: {pediaId: number};
  FamilyPediaSelectPhoto: undefined;

  Report: undefined;

  TermsOfUse: undefined;
  OperationPolicy: undefined;
  PrivacyPolicy: undefined;

  UserInquirySend:
    | {title: string; payload: string; edit: boolean; id: number}
    | undefined;
  UserInquiryList: undefined;
  UserInquiry: {inquiry: {title: string; payload: string; reply: string}};

  LetterSend: {
    targetId: number;
    isTimeCapsule?: boolean;
    isEdit?: boolean;
    letterId?: number;
    isTempSaved?: boolean;
  };
  LetterCompleted: {
    isTimeCapsule: boolean;
    receiveDate?: string;
    targetString: string;
    letterId: number;
  };
  LetterSent: {
    letterId: number;
    isTimeCapsule?: boolean;
    receiveDate?: string;
    isCompleted?: boolean;
  };
  LetterReceived: {
    letterId: number;
    isTimeCapsule?: boolean;
    receiveDate?: string;
  };

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
  OpenSourceLicensePayload: {
    license: {
      libraryName: string;
      homepage: string;
      repository: {url: string};
      _licenseContent: string;
    };
  };
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
  CompositeScreenProps<
    MaterialTopTabScreenProps<MyPageParams, T>,
    SignedInScreenProps<keyof SignedInParams>
  >;

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
  SignIn: {familyId: string} | undefined;
  SignUp: {
    userName?: string;
    email: string;
    familyId?: string;
    provider: string;
    token: string;
    nonce?: string;
  };

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
