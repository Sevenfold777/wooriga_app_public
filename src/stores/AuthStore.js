import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import {observable, runInAction} from 'mobx';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../Strings';
import messaging from '@react-native-firebase/messaging';
import {METHOD, SERVER_URL, _promise} from '../api/ApiConfig';
import familyStore from './FamilyStore';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const authStore = observable({
  // auth states
  isLoggedIn: false,
  accessToken: '',
  userId: 0,
  userName: '',
  familyId: 0,
  permissionsChecked: false,
  isTokenRefreshing: false,

  // login action
  async loginAction({accessToken, refreshToken}) {
    runInAction(() => {
      this.isLoggedIn = true;
      this.accessToken = accessToken;
    });

    await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);

    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);
    }

    const me = await _promise(METHOD.GET, `users/my`);
    const family = await _promise(METHOD.GET, `family/my`);

    // 가족 nickname set
    await familyStore.preloadFamilyMembers();
    await familyStore.setNewfamilyMembers(family?.data?.users);

    // check fcm token; 토큰이 달라졌으면 갱신
    const fcmToken = await messaging().getToken();
    if (fcmToken !== me?.data.fcmToken) {
      await _promise(METHOD.PATCH, `users`, {fcmToken});
    }

    runInAction(() => {
      authStore.setUserId({
        userId: me?.data?.id,
        userName: me?.data?.userName,
        familyId: family?.data?.id,
      });
    });
  },

  // logout action
  async logoutAction() {
    await _promise(METHOD.PATCH, `users`, {fcmToken: ''});

    await SecureStore.deleteItemAsync(ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN);

    runInAction(() => {
      this.isLoggedIn = false;
      this.accessToken = '';
    });
  },

  // set ids
  setUserId({userId, userName, familyId}) {
    if (!userId || !userName || !familyId) {
      return;
    }
    this.userId = userId;
    this.familyId = familyId;
    this.userName = userName;
  },

  // async loadPermissionChecked() {
  //   const isChecked = await AsyncStorage.getItem("permissionsChecked");

  //   runInAction(() => {
  //     this.permissionsChecked = Boolean(JSON.parse(isChecked));
  //   });
  // },

  // async setPermissionChecked(isChecked) {
  //   await AsyncStorage.setItem("permissionsChecked", JSON.stringify(isChecked));

  //   runInAction(() => {
  //     this.permissionsChecked = isChecked;
  //   });
  // },

  setPermission(isChecked) {
    this.permissionsChecked = isChecked;
  },

  async refreshAccessToken() {
    try {
      runInAction(() => {
        this.isTokenRefreshing = true;
      });

      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
      const refreshTokenExpires = (await jwtDecode(refreshToken)).exp;

      // refreshToken도 만료되었다면 로그아웃
      runInAction(() => {
        const now = new Date().getTime() / 1000;

        if (now > refreshTokenExpires) {
          this.logoutAction();
          return;
        }
      });

      // refresh ACCESS TOKEN
      const result = await axios({
        method: METHOD.PATCH.type,
        url: `users/refreshToken`,
        baseURL: SERVER_URL,
        data: {refreshToken},
      });

      runInAction(() => {
        if (!result || result.data?.ok === false) {
          this.logoutAction();
          return;
        }
      });

      await SecureStore.setItemAsync(ACCESS_TOKEN, result.data.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN, result.data.refreshToken);

      runInAction(() => {
        this.accessToken = result.data.accessToken;
        this.isTokenRefreshing = false;
      });

      return result.data.accessToken;
    } catch (e) {
      this.logoutAction();
    }
  },
});

export default authStore;
