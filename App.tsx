import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import authStore from './src/stores/AuthStore';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {Asset} from 'expo-asset';
import assetStore from './src/stores/AssetStore';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import {linking, loggedInNavRoutes, loggedOutNavRoutes} from './src/Config';
import messaging from '@react-native-firebase/messaging';
import {navigationRef} from './src/RootNavigation';
import * as RootNavigation from './src/RootNavigation';
import notifee, {Event, EventType} from '@notifee/react-native';
import analytics from '@react-native-firebase/analytics';
import * as SecureStore from 'expo-secure-store';
import {ACCESS_TOKEN} from './src/Strings';
import jwtDecode, {JwtPayload} from 'jwt-decode';
import {getPermissions} from './src/helper';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import SignedInNav from './src/navigators/SignedInNav';
import SignedOutNav from './src/navigators/SignedOutNav';
import {RootParams} from './src/navigators/types';

SplashScreen.preventAutoHideAsync();

export default function App() {
  // react-query client
  const client = new QueryClient();

  // preload assets
  const [assetReady, setAssetReady] = useState<boolean>(false);
  const [networkReady, setNetworkReady] = useState<boolean>(false);
  const routeNameRef = useNavigationContainerRef<RootParams>();

  /** to open notification */
  const [initialNotification, setInitialNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  useEffect(() => {
    // preload local assets: images, fonts ...
    const prepareAssets = async () => {
      try {
        // get Permission
        const permission = await getPermissions();
        authStore.setPermission(permission);

        // preload images
        const regularImgLoaded = await Asset.loadAsync(regularImgList);
        const roundImgLoaded = await Asset.loadAsync(roundImgList);

        console.log(roundImgLoaded.length);

        // set mobx vars for preloaded imgs
        if (regularImgLoaded.length === 10) {
          assetStore.setMessageEmotions({
            happy: regularImgLoaded[0].localUri,
            passion: regularImgLoaded[1].localUri,
            comfort: regularImgLoaded[2].localUri,
            tired: regularImgLoaded[3].localUri,
            sharp: regularImgLoaded[4].localUri,
            sad: regularImgLoaded[5].localUri,
            noMessage: regularImgLoaded[6].localUri,
            balanceGame: regularImgLoaded[7].localUri,
          });
        }

        if (roundImgLoaded.length === 7) {
          assetStore.setEmotionsRound({
            happy: roundImgLoaded[0].localUri,
            passion: roundImgLoaded[1].localUri,
            comfort: roundImgLoaded[2].localUri,
            tired: roundImgLoaded[3].localUri,
            sharp: roundImgLoaded[4].localUri,
            sad: roundImgLoaded[5].localUri,
            null: roundImgLoaded[6].localUri,
          });
        }

        // Fonts
        await Font.loadAsync({
          'kangwon-font': require('./assets/fonts/kangwon.ttf'),
          'nanum-regular': require('./assets/fonts/NanumSquareNeo-Regular.ttf'),
          'nanum-bold': require('./assets/fonts/NanumSquareNeo-Bold.ttf'),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setAssetReady(true);
      }
    };

    // 2. preload access token and refresh it if needed
    const prepareNetwork = async () => {
      try {
        // get Token
        let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN);

        // refresh access token
        if (accessToken && !authStore.isTokenRefreshing) {
          // 단위: seconds (초)
          const accessTokenExpires = jwtDecode<JwtPayload>(accessToken).exp;
          const now = Math.round(new Date().getTime() / 1000);
          // 5분 이내 token expires
          if (accessTokenExpires && now + 300 > accessTokenExpires) {
            accessToken = await authStore.refreshAccessToken();
          }
        }

        if (accessToken) {
          await authStore.loginAction({accessToken});
        }
      } catch (e) {
        console.error(e);
      } finally {
        setNetworkReady(true);
      }
    };

    // when app is on foreground
    const unsubscribeFCM = messaging().onMessage(
      async (message: FirebaseMessagingTypes.RemoteMessage) => {
        // const screen = message.data?.screen;
        // const param = message.data?.param;

        await notifee.displayNotification({
          title: message?.notification?.title,
          body: message?.notification?.body,
          data: message.data,
          android: {
            channelId: '500',
            smallIcon: 'ic_notification',
            color: '#f9852d',
          },
          ios: {
            sound: 'default',
          },
        });
      },
    );

    // foreground notifee pressed
    const unsubscribeNotifee = notifee.onForegroundEvent(
      async ({type, detail}: Event) => {
        if (type === EventType.PRESS) {
          const screen = detail.notification?.data?.screen;
          const param = detail.notification?.data?.param;

          RootNavigation.navigate(
            screen || 'Home',
            param && {...JSON.parse(param)},
          );
        }
      },
    );

    // when app is on background
    messaging().onNotificationOpenedApp(
      async (message: FirebaseMessagingTypes.RemoteMessage) => {
        const screen = message.data?.screen;
        const param = message.data?.param;

        RootNavigation.navigate(
          screen || 'Home',
          param && {...JSON.parse(param)},
        );
      },
    );

    // when app is on quit
    messaging()
      .getInitialNotification()
      .then((message: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (message) {
          setInitialNotification(message);
        }
      });

    // execute preload
    prepareAssets();
    prepareNetwork();

    return () => {
      unsubscribeFCM();
      unsubscribeNotifee();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (assetReady && networkReady) {
      await SplashScreen.hideAsync();

      // for firebase screen tracking
      routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;

      // handle open Notification when app is quit
      if (initialNotification) {
        const screen = initialNotification.data?.screen;
        const param = initialNotification.data?.param;

        RootNavigation.navigate(
          screen || 'Home',
          param && {...JSON.parse(param)},
        );
      }
    }
  }, [assetReady, networkReady, initialNotification, routeNameRef]);

  if (!(assetReady && networkReady)) {
    return null;
  }

  return (
    <Observer>
      {() => (
        <QueryClientProvider client={client}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={onLayoutRootView}
              onStateChange={async () => {
                const previousRouteName = routeNameRef?.current;
                const currentRouteName =
                  navigationRef.current?.getCurrentRoute()?.name;

                if (previousRouteName !== currentRouteName) {
                  await analytics().logScreenView({
                    screen_name: currentRouteName,
                    screen_class: currentRouteName,
                  });
                }
                routeNameRef.current = currentRouteName;
              }}
              linking={{
                ...linking,
                config: authStore.isLoggedIn
                  ? loggedInNavRoutes
                  : loggedOutNavRoutes,
              }}>
              {authStore.isLoggedIn ? <SignedInNav /> : <SignedOutNav />}
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      )}
    </Observer>
  );
}

const regularImgList = [
  require('./assets/images/emotions/regular/happy.png'),
  require('./assets/images/emotions/regular/passion.png'),
  require('./assets/images/emotions/regular/comfort.png'),
  require('./assets/images/emotions/regular/tired.png'),
  require('./assets/images/emotions/regular/sharp.png'),
  require('./assets/images/emotions/regular/sad.png'),
  require('./assets/images/emotions/regular/no_message.png'),
  require('./assets/images/emotions/regular/letter.png'),
  require('./assets/images/emotions/regular/family_pedia.png'),
  require('./assets/images/emotions/regular/balance_game.png'),
];

const roundImgList = [
  require('./assets/images/emotions/round/happy.png'),
  require('./assets/images/emotions/round/passion.png'),
  require('./assets/images/emotions/round/comfort.png'),
  require('./assets/images/emotions/round/tired.png'),
  require('./assets/images/emotions/round/sharp.png'),
  require('./assets/images/emotions/round/sad.png'),
  require('./assets/images/emotions/round/null.png'),
];
