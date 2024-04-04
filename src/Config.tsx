import {Linking} from 'react-native';

// const ENV = 'PROD';

export enum EMOTION_KOREAN {
  happy = '행복',
  passion = '열정',
  comfort = '편안',
  tired = '피곤',
  sharp = '예민',
  sad = '우울',
}
// null: "선택없음",

export enum BottomPhrases {
  happy = '기쁜 일을 가족과 나눌 때, 우리가',
  passion = '힘이 넘치는 하루의 시작, 우리가',
  comfort = '편안한 하루의 안부 인사, 우리가',
  tired = '피곤한 하루에 위로 한 마디, 우리가',
  sharp = '언젠가 돌아보면 웃을 수 있길, 우리가',
  sad = '힘들 때는 가족한테 기대, 우리가',
  noMessage = '가족에게 하고픈 이야기를 전해보아요, 우리가',
  balanceGame = '가족과 생각을 나눠보아요, 우리가',
}

export enum BGColors {
  happy = '#ffe1f4',
  passion = '#fce3c8',
  comfort = '#fff5bf',
  tired = '#d3e5e0',
  sharp = '#ffc5c5',
  sad = '#D1dFE8',
  noMessage = '#e7e7e7',
  balanceGame = '#ebebe3',
}

export const Colors = {
  main: '#f9852d',
  sub: '#fce0ca',
  borderLight: '#e7e7e7',
  borderDark: '#aeaeae',
  white: '#ffffff',
  black: '#000000',
  heart: '#ED4956',
  balanceA: '#ff7676',
  balanceB: '#ffa364',
};

export const loggedInNavRoutes = {
  screens: {
    FamilyJoin: 'family/join/:id',
    MessageSend: 'message/send',
    PhotoSelect: 'photo/select/:isRecommend',
    MainTabNav: {
      screens: {},
    },
  },
};

export const loggedOutNavRoutes = {
  screens: {
    Login: '/family/join/:familyId',
  },
};
/** for deep link */
export const linking = {
  prefixes: ['wooriga://'],

  async getInitialURL() {
    const url = await Linking.getInitialURL();

    if (url) {
      return url;
    }

    return null;
  },

  subscribe(listener: any) {
    console.log('linking subscribe to ', listener);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', ({url}) => {
      listener(url);
    });

    return () => {
      linkingSubscription.remove();
    };
  },

  // Deep Link configuration
  // config: authStore.isLoggedIn ? loggedInNavRoutes : loggedOutNavRoutes,
};
