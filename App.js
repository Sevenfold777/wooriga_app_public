import {CommonActions, NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import LoggedInNav from './src/navigators/LoggedInNav';
import LoggedOutNav from './src/navigators/LoggedOutNav';
import authStore from './src/stores/AuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {Asset} from 'expo-asset';
import assetStore from './src/stores/AssetStore';
import familyStore from './src/stores/FamilyStore';
import {METHOD, _promise} from './src/api/ApiConfig';
import {Image, StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import {
  ActivityThumbnails,
  Emotions,
  linking,
  loggedInNavRoutes,
  loggedOutNavRoutes,
  RoundEmotions,
} from './src/Config';
import messaging from '@react-native-firebase/messaging';
import {navigationRef} from './src/RootNavigation';
import * as RootNavigation from './src/RootNavigation';
import notifee, {EventType} from '@notifee/react-native';
import analytics from '@react-native-firebase/analytics';
import * as SecureStore from 'expo-secure-store';
import {ACCESS_TOKEN, ROUTE_NAME} from './src/Strings';
import jwtDecode from 'jwt-decode';
import {getPermissions} from './src/helper';

SplashScreen.preventAutoHideAsync();

export default function App() {
  // react-query client
  const client = new QueryClient();

  // preload assets
  const [appIsReady, setAppIsReady] = useState(false);
  const routeNameRef = useRef();

  /** for open notification */
  const [initialNotification, setInitialNotification] = useState();

  useEffect(() => {
    async function prepare() {
      try {
        // get Permission
        const permission = await getPermissions();
        authStore.setPermission(permission);

        // load images
        const background = await Asset.loadAsync(Emotions);
        const roundEmos = await Asset.loadAsync(RoundEmotions);
        const activityThumbnails = await Asset.loadAsync(ActivityThumbnails);

        assetStore.setMessageEmotions({
          happy: background[0]?.localUri,
          passion: background[1]?.localUri,
          comfort: background[2]?.localUri,
          tired: background[3]?.localUri,
          sharp: background[4]?.localUri,
          sad: background[5]?.localUri,
          noMessage: background[6]?.localUri,
          balanceGame: background[7]?.localUri,
          // { null: background[5]?.localUri },
        });

        assetStore.setEmotionsRound({
          happy: roundEmos[0]?.localUri,
          passion: roundEmos[1]?.localUri,
          comfort: roundEmos[2]?.localUri,
          tired: roundEmos[3]?.localUri,
          sharp: roundEmos[4]?.localUri,
          sad: roundEmos[5]?.localUri,
          null: roundEmos[6]?.localUri,
        });

        assetStore.setActivityThumbanails({
          familyPedia: activityThumbnails[0]?.localUri,
          letter: activityThumbnails[1]?.localUri,
          balanceGame: activityThumbnails[2]?.localUri,
        });

        // Fonts
        await Font.loadAsync({
          'kangwon-font': require('./assets/fonts/kangwon.ttf'),
          'nanum-regular': require('./assets/fonts/NanumSquareNeo-Regular.ttf'),
          'nanum-bold': require('./assets/fonts/NanumSquareNeo-Bold.ttf'),
        });

        // get Token
        let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN);

        // refresh access token
        if (accessToken && !authStore.isTokenRefreshing) {
          // 단위: seconds (초)
          const accessTokenExpires = (await jwtDecode(accessToken)).exp;
          const now = parseInt(new Date().getTime() / 1000);
          // 5분 이내 token expires
          if (now + 300 > accessTokenExpires) {
            // if (now + 300 > accessTokenExpires) {
            accessToken = await authStore.refreshAccessToken();
          }
        }

        if (accessToken) {
          await authStore.loginAction({accessToken});
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // tell the application to render
        setAppIsReady(true);
      }
    }

    // when app is on foreground
    const unsubscribeFCM = messaging().onMessage(async message => {
      const screen = message.data.screen;
      const param = message.data.param;

      await notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
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
    });

    // foreground notifee pressed
    const unsubscribeNotifee = notifee.onForegroundEvent(
      async ({type, detail}) => {
        if (type === EventType.PRESS) {
          const screen = detail.notification.data.screen;
          const param = detail.notification.data.param;

          RootNavigation.navigate(
            screen || 'Home',
            param && {...JSON.parse(param)},
          );
        }
      },
    );

    // when app is on background
    messaging().onNotificationOpenedApp(async message => {
      const screen = message.data.screen;
      const param = message.data.param;

      RootNavigation.navigate(
        screen || 'Home',
        param && {...JSON.parse(param)},
      );
    });

    // when app is on quit
    messaging()
      .getInitialNotification()
      .then(message => {
        if (message) {
          setInitialNotification(message);
        }
      });

    prepare();

    return () => {
      unsubscribeFCM();
      unsubscribeNotifee();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();

      // for firebase screen tracking
      routeNameRef.current = navigationRef.current.getCurrentRoute().name;

      // handle open Notification when app is quit
      if (initialNotification) {
        const screen = initialNotification.data.screen;
        const param = initialNotification.data.param;

        RootNavigation.navigate(
          screen || 'Home',
          param && {...JSON.parse(param)},
        );
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
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
                const previousRouteName = routeNameRef.current;
                const currentRouteName =
                  navigationRef.current.getCurrentRoute().name;

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
              {authStore.isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      )}
    </Observer>
  );
}
