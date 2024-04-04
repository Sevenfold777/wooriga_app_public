import messaging from '@react-native-firebase/messaging';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import * as RNFS from 'react-native-fs';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import Toast from './components/Toast';
import axios from 'axios';

/** FCM request permission */
export async function requestNotificationPermission() {
  if (Platform.OS === 'ios') {
    const result = await messaging().requestPermission({
      providesAppNotificationSettings: true,
    });
    const enabled =
      result === messaging.AuthorizationStatus.AUTHORIZED ||
      result === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', result);
    }
  } else {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
}

// get permission
export async function requestMediaPermission() {
  const {accessPrivileges, status} =
    await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    return false;
  } else if (status === 'granted' && accessPrivileges === 'limited') {
    //  "실패. 전체 사진에 대하여 접근 권한 허용해주어야 함"
    return true;
  } else {
    //  "성공"
    return true;
  }
}

export async function getPermissions() {
  let result;

  const {accessPrivileges, status} = await MediaLibrary.getPermissionsAsync();

  if (status !== 'granted') {
    //  "실패. 접근 권한 획득 실패, 직접 설정해야 함."
    // authStore.setPermissionChecked(false);
    result = false;
  } else if (status === 'granted' && accessPrivileges === 'limited') {
    //  "실패. 전체 사진에 대하여 접근 권한 허용해주어야 함"
    // authStore.setPermissionChecked(false);
    result = true;
  } else {
    //  "성공"
    // authStore.setPermissionChecked(true);
    result = true;
  }

  return result;
}

/** Image Download to "Wooriga" Album */
export async function downloadImage(uri: string) {
  const fileUri = `${
    FileSystem.documentDirectory
  }${new Date().getTime()}${uri.substring(uri.lastIndexOf('.'))}`;

  const {uri: downloadedPath} = await FileSystem.downloadAsync(uri, fileUri);

  CameraRoll.save(downloadedPath, {type: 'photo', album: '우리가'});
}

/** prepare photos to be uploaded */
const COMPRESS_SIZE_THRESHOLD = 0.7; // 최대 사진 용량 700kB
const MAXIMUM_PHOTO_SIZE = 10;

// get file size func
const getFileSize = async (uri: string) => {
  const info = await FileSystem.getInfoAsync(uri, {
    size: true,
  });
  return info.size / (1024 * 1024);
};

const compressPhoto = async (uri, width, height) => {
  // 원본 가로 세로 비율
  const widthHeightRatio = height / width;
  let targetWidth = width;
  let targetHeight = height;

  // 가로 세로 축소비
  if (width < height && width > 1080) {
    targetWidth = 1080;
    targetHeight = targetWidth * widthHeightRatio;
  } else {
    targetHeight = 1080;
    targetWidth = targetHeight / widthHeightRatio;
  }

  // 압축 비율
  const compressRatio = 70;
  const compressedResult = await ImageResizer.createResizedImage(
    uri,
    targetWidth,
    targetHeight,
    'JPEG',
    compressRatio,
    0,
    undefined,
    true,
    {mode: 'contain', onlyScaleDown: true},
  );

  return compressedResult;
};

export async function preparePhotosToUpload({fileFormData, files}) {
  const data = fileFormData;
  let maxFileSizeFlag = false;
  let cnt = 0;

  for (const file of files) {
    let body = {uri: file.uri, type: 'image/jpeg', name: 'photo.jpg'};

    const fileSize = await getFileSize(file.uri);
    const fileInfo = await MediaLibrary.getAssetInfoAsync(file);

    // 7MB 넘으면 업로드 불허
    if (fileSize > MAXIMUM_PHOTO_SIZE) {
      maxFileSizeFlag = true;
      continue;
    } else if (fileSize > COMPRESS_SIZE_THRESHOLD) {
      const compressedResult = await compressPhoto(
        fileInfo.localUri,
        fileInfo.width,
        fileInfo.height,
      );

      if (Platform.OS === 'ios') {
        const path = `${RNFS.CachesDirectoryPath}/${new Date().getTime()}`;
        await RNFS.copyFile(compressedResult.uri, path);

        body.uri = path;
      } else {
        body.uri = compressedResult.uri;
      }
    } else {
      body.uri = fileInfo.localUri;
    }

    data.append('files', body);
    cnt++;
  }

  if (maxFileSizeFlag) {
    Toast({message: '10MB 이상의 사진은 업로드할 수 없습니다'});
  }

  if (cnt === 0) {
    return false;
  }

  return true;
}

export function shuffle(array, seed) {
  let result = array.slice();
  let m = result.length,
    t,
    i;

  // While there remain elements to shuffle
  while (m) {
    // Pick a remaining element
    i = Math.floor(random(seed) * m--);

    // And swap it with the current element
    t = result[m];
    result[m] = result[i];
    result[i] = t;
    ++seed;
  }

  return result;
}

function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export async function checkLatestVersion() {
  try {
    // for android
    if (Platform.OS === 'android') {
      const response = await axios(
        'https://play.google.com/store/apps/details?id=com.wooriga.appservice&hl=en&gl=US',
      );
      const text = await response.data;
      const match = text.match(/Current Version.+?>([\d.-]+)<\/span>/);
      if (match) {
        const latestVersion = match[1].trim();

        return latestVersion;
      }

      const matchNewLayout = text.match(/\[\[\["([\d.]+?)"\]\]/);
      if (matchNewLayout) {
        const latestVersion = matchNewLayout[1].trim();

        return latestVersion;
      }
    }

    // for ios
    else if (Platform.OS === 'ios') {
      const response = await axios.get(
        'https://itunes.apple.com/lookup?bundleId=com.wooriga.appservice',
      );
      const json = response.data;

      // Extract the latest version number from the API response
      const latestVersion = json.results[0].version;

      return latestVersion;
    }

    return '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
}

export function versionCompare(now, latest) {
  // now, b는 "x.x.x" 형싱 x는 0보다 크거나 같은 정수
  let result = false;

  const splitNow = now.split('.');
  const splitLatest = latest.split('.');

  const length = Math.max(splitNow.length, splitLatest.length);

  for (let i = 0; i < length; i++) {
    const unitNow = splitNow[i] ? parseInt(splitNow[i]) : 0;
    const unitLatest = splitLatest[i] ? parseInt(splitLatest[i]) : 0;

    if (unitNow > unitLatest) {
      break;
    } else if (unitNow < unitLatest) {
      result = true;
      break;
    }
  }

  return result;
}

export const openURL = async url => {
  // Check if the device supports opening URLs
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // Open the URL using the default browser or app
    await Linking.openURL(url);
  } else {
    console.error('Cannot open URL:', url);
  }
};
