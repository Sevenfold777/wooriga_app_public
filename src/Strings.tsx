export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export const ROUTE_NAME = {
  MAIN_TAB_NAV: 'MainTabNav',
  MESSAGE_FAMILY: 'MessageFamily',
  MESSAGE_SEND: 'MessageSend',
  PHOTO_SELECT: 'PhotoSelect',
  PHOTO_UPLOAD: 'PhotoUpload',
  MESSAGE_PUBLIC: 'MessagePublic',
  BANNERS_PAYLOAD: 'BannersPayload',
  MESSAGE_BOARD: 'MessageBoard',
  PHOTO: 'Photo',
  PHOTO_COMMENTS: 'PhotoComments',
  MESSAGE_TODAYS: 'MessageTodays',
  MESSAGE_SENT: 'MessageSent',
  MESSAGES_PAST: 'MessagePast',
  MESSAGE_KEEP: 'MessageKeep',
  CHANGE_NICKNAME: 'ChangeNickname',
  NOTIFICATIONS: 'Notifications',
  FAMILY_JOIN: 'FamilyJoin',
  FAMILYPEDIA_HOME: 'FamilyPediaHome',
  FAMILYPEDIA_MEMBER: 'FamilyPediaMember',
  FAMILYPEDIA_SELECTPHOTO: 'FamilyPediaSelectPhoto',
  REPORT: 'Report',
  TERMS_OF_USE: 'TermsOfUse',
  OPERATION_POLICY: 'OperationPolicy',
  PRIVACY_POLICY: 'PrivacyPolicy',
  LOGIN: 'Login',
  SIGN_UP: 'SignUp',
  HOME: 'Home',
  PHOTO_HOME: 'PhotoHome',
  MESSAGE_HOME: 'MessageHome',
  ACTIVITY: 'Activity',
  MYPAGE_NAV: 'MyPageNav',
  MYPAGE_MAIN: 'MyPageMain',
  MYPAGE_FAMILY: '우리 가족',
  MYPAGE_MY: '내 프로필',
  EDIT_MY_PROFILE: 'EditMyProfile',
  EDIT_FAMILY_PROFILE: 'EditFamilyProfile',
  DAILY_EMOTIONS_PAST: 'DailyEmotionsPast',
  PHOTOS_MY: 'PhotosMy',
  USER_INQUIRY_SEND: 'UserInquirySend',
  USER_INQUIRY_LIST: 'UserInquiryList',
  USER_INQUIRY: 'UserInquiry',
  SETTINGS: 'Settings',
  INFOS: 'Infos',
  OPEN_SOURCE_LICENSE: 'OpenSourceLicense',
  OPEN_SOURCE_LICENSE_PAYLOAD: 'OpenSourceLicensePayload',
  PUSH_NOTIF_SETTINGS: 'PushNotifSettings',
  QUIT: 'Quit',
  LETTER_HOME: 'LetterHome',
  LETTER_SEND: 'LetterSend',
  LETTER_COMPLETED: 'LetterCompleted',
  LETTER_BOX_SENT: '보낸 편지함',
  LETTER_BOX_RECEIVED: '받은 편지함',
  LETTER_BOX_NAV: 'LetterBoxNav',
  LETTER_SENT: 'LetterSent',
  LETTER_RECEIVED: 'LetterReceived',
  TIME_CAPSULES: 'TimeCapsules',
  TIME_CAPSULES_NAV: 'TimeCapsulesNav',
  TIME_CAPSULES_SENT: '보낸 타임캡슐',
  TIME_CAPSULES_RECEIVED: '받은 타임캡슐',
  LETTER_THEME_LIST: 'LetterChallengeList',
  LETTER_THEME_DETAIL: 'LetterChallengeDetail',
  LETTER_RECEIVEVD_KEPT: 'LetterReceivedKept',
};

export enum ServiceLinked {
  NONE = 'none',
  LETTER = 'letter',
  PHOTO = 'photo',
  PEDIA = 'pedia',
}

export const OPEN_SOURCE_LICENSE = [
  {
    libraryName: '@bam.tech/react-native-image-resizer',
    version: '3.0.5',
    _license: 'MIT',
    _description: 'Rescale local images with React Native',
    homepage: 'https://github.com/bamlab/react-native-image-resizer#readme',
    author: {
      name: 'Florian Rival',
      email: 'florianr@bam.tech',
      url: 'http://bam.tech',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/bamlab/react-native-image-resizer.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2022 Clément Taboulot\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@invertase/react-native-apple-authentication',
    version: '2.2.2',
    _license: 'Apache-2.0',
    _description:
      'A complete Apple Authentication services API for React Native iOS apps.',
    homepage: 'https://github.com/invertase/react-native-apple-authentication',
    author: {
      name: 'Invertase',
      email: 'oss@invertase.io',
      url: 'http://invertase.io',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/invertase/react-native-apple-authentication.git',
    },
    _licenseContent:
      'Apache-2.0 License\n------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io> & Contributors\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this library except in compliance with the License.\n\nYou may obtain a copy of the Apache-2.0 License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n\n\nCreative Commons Attribution 3.0 License\n----------------------------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io> & Contributors\n\nDocumentation and other instructional materials provided for this project\n(including on a separate documentation repository or it\'s documentation website) are\nlicensed under the Creative Commons Attribution 3.0 License. Code samples/blocks\ncontained therein are licensed under the Apache License, Version 2.0 (the "License"), as above.\n\nYou may obtain a copy of the Creative Commons Attribution 3.0 License at\n\n    https://creativecommons.org/licenses/by/3.0/\n',
  },
  {
    libraryName: '@notifee/react-native',
    version: '5.7.0',
    _license: 'Apache-2.0',
    _description:
      'Notifee - a feature rich notifications library for React Native.',
    homepage: 'https://github.com/invertase/notifee#readme',
    author: {
      name: 'Invertase',
      email: 'oss@invertase.io',
      url: 'http://invertase.io',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/invertase/notifee.git',
    },
    _licenseContent:
      'Apache-2.0 License\n------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io>\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this library except in compliance with the License.\n\nYou may obtain a copy of the Apache-2.0 License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n\n\n\nCreative Commons Attribution 3.0 License\n----------------------------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io>\n\nDocumentation and other instructional materials provided for this project\n(including on a separate documentation repository or it\'s documentation website) are\nlicensed under the Creative Commons Attribution 3.0 License. Code samples/blocks\ncontained therein are licensed under the Apache License, Version 2.0 (the "License"), as above.\n\nYou may obtain a copy of the Creative Commons Attribution 3.0 License at\n\n    https://creativecommons.org/licenses/by/3.0/\n\n\n\nNotifee CORE License\n--------------------\n\nThe Notifee "core" submodule on Android/iOS (e.g. `android/libs/notifee_core_release.aar`) is not Open Source\nbut is distributed in minified & obfuscated form. A purchased license is required to use Notifee Core in\nrelease builds and is subject to the Notifee License terms which can be found at:\n\n   https://notifee.app/license-terms\n',
  },
  {
    libraryName: '@react-native-async-storage/async-storage',
    version: '1.17.11',
    _license: 'MIT',
    _description:
      'Asynchronous, persistent, key-value storage system for React Native.',
    homepage:
      'https://github.com/react-native-async-storage/async-storage#readme',
    author: {name: 'Krzysztof Borowy', email: 'hello@krizzu.dev'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-native-async-storage/async-storage.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2015-present, Facebook, Inc.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.',
  },
  {
    libraryName: '@react-native-camera-roll/camera-roll',
    version: '5.2.3',
    _license: 'MIT',
    _description: 'React Native Camera Roll for iOS & Android',
    homepage:
      'https://github.com/react-native-cameraroll/react-native-cameraroll#readme',
    author: {name: 'Bartol Karuza', email: 'bartol.k@gmail.com'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-native-cameraroll/react-native-cameraroll.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2015-present, Facebook, Inc.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-native-clipboard/clipboard',
    version: '1.11.1',
    _license: 'MIT',
    _description:
      'React Native Clipboard API for macOS, iOS, Android, and Windows',
    homepage: 'https://github.com/react-native-clipboard/clipboard#readme',
    author: {name: 'M.Haris Baig', email: 'harisbaig100@gmail.com'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-native-clipboard/clipboard.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2015-present, Facebook, Inc.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.',
  },
  {
    libraryName: '@react-native-firebase/analytics',
    version: '16.7.0',
    _license: 'Apache-2.0',
    _description:
      'React Native Firebase - The analytics module provides out of the box support with Google Analytics for Firebase. Integration with the Android & iOS allows for in-depth analytical insight reporting, such as device information, location, user actions and more.',
    author: {
      name: 'Invertase',
      email: 'oss@invertase.io',
      url: 'http://invertase.io',
    },
    repository: {
      type: 'git',
      url: 'https://github.com/invertase/react-native-firebase/tree/main/packages/analytics',
    },
    _licenseContent:
      'Apache-2.0 License\n------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io> & Contributors\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this library except in compliance with the License.\n\nYou may obtain a copy of the Apache-2.0 License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n\n\nCreative Commons Attribution 3.0 License\n----------------------------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io> & Contributors\n\nDocumentation and other instructional materials provided for this project\n(including on a separate documentation repository or it\'s documentation website) are\nlicensed under the Creative Commons Attribution 3.0 License. Code samples/blocks\ncontained therein are licensed under the Apache License, Version 2.0 (the "License"), as above.\n\nYou may obtain a copy of the Creative Commons Attribution 3.0 License at\n\n    https://creativecommons.org/licenses/by/3.0/\n',
  },
  {
    libraryName: '@react-native-firebase/app',
    version: '16.7.0',
    _license: 'Apache-2.0',
    _description:
      'A well tested, feature rich Firebase implementation for React Native, supporting iOS & Android. Individual module support for Admob, Analytics, Auth, Crash Reporting, Cloud Firestore, Database, Dynamic Links, Functions, Messaging (FCM), Remote Config, Storage and more.',
    author: {
      name: 'Invertase',
      email: 'oss@invertase.io',
      url: 'http://invertase.io',
    },
    repository: {
      type: 'git',
      url: 'https://github.com/invertase/react-native-firebase/tree/main/packages/app',
    },
    _licenseContent:
      'Apache-2.0 License\n------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io>\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this library except in compliance with the License.\n\nYou may obtain a copy of the Apache-2.0 License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n\n\nCreative Commons Attribution 3.0 License\n----------------------------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io>\n\nDocumentation and other instructional materials provided for this project\n(including on a separate documentation repository or it\'s documentation website) are\nlicensed under the Creative Commons Attribution 3.0 License. Code samples/blocks\ncontained therein are licensed under the Apache License, Version 2.0 (the "License"), as above.\n\nYou may obtain a copy of the Creative Commons Attribution 3.0 License at\n\n    https://creativecommons.org/licenses/by/3.0/\n',
  },
  {
    libraryName: '@react-native-firebase/messaging',
    version: '16.7.0',
    _license: 'Apache-2.0',
    _description:
      'React Native Firebase - React Native Firebase provides native integration of Firebase Cloud Messaging (FCM) for both Android & iOS. FCM is a cost free service, allowing for server-device and device-device communication. The React Native Firebase Messaging module provides a simple JavaScript API to interact with FCM.',
    author: {
      name: 'Invertase',
      email: 'oss@invertase.io',
      url: 'http://invertase.io',
    },
    repository: {
      type: 'git',
      url: 'https://github.com/invertase/react-native-firebase/tree/main/packages/messaging',
    },
    _licenseContent:
      'Apache-2.0 License\n------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io> & Contributors\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this library except in compliance with the License.\n\nYou may obtain a copy of the Apache-2.0 License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n\n\nCreative Commons Attribution 3.0 License\n----------------------------------------\n\nCopyright (c) 2016-present Invertase Limited <oss@invertase.io> & Contributors\n\nDocumentation and other instructional materials provided for this project\n(including on a separate documentation repository or it\'s documentation website) are\nlicensed under the Creative Commons Attribution 3.0 License. Code samples/blocks\ncontained therein are licensed under the Apache License, Version 2.0 (the "License"), as above.\n\nYou may obtain a copy of the Creative Commons Attribution 3.0 License at\n\n    https://creativecommons.org/licenses/by/3.0/\n',
  },
  {
    libraryName: '@react-native-seoul/kakao-login',
    version: '5.2.6',
    _license: 'MIT',
    _description: 'React Native Module for Kakao Login',
    homepage:
      'https://github.com/react-native-seoul/react-native-kakao-login#readme',
    author: {name: 'dooboolab'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-native-seoul/react-native-kakao-login.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2018 dooboolab\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-native-seoul/naver-login',
    version: '2.3.1',
    _license: 'MIT',
    _description: 'React Native Module for Naver Login',
    homepage:
      'https://github.com/react-native-seoul/react-native-naver-login#readme',
    author: {name: 'dooboolab, Jongwoo Moon'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-native-seoul/react-native-naver-login.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2018 dooboolab\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-navigation/bottom-tabs',
    version: '6.5.5',
    _license: 'MIT',
    _description: 'Bottom tab navigator following iOS design guidelines',
    homepage: 'https://github.com/react-navigation/react-navigation#readme',
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-navigation/react-navigation.git',
      directory: 'packages/bottom-tabs',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Navigation Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-navigation/elements',
    version: '1.3.15',
    _license: 'MIT',
    _description: 'UI Components for React Navigation',
    homepage: 'https://reactnavigation.org',
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-navigation/react-navigation.git',
      directory: 'packages/elements',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Navigation Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-navigation/material-top-tabs',
    version: '6.6.0',
    _license: 'MIT',
    _description:
      'Integration for the animated tab view component from react-native-tab-view',
    homepage: 'https://reactnavigation.org/docs/material-top-tab-navigator/',
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-navigation/react-navigation.git',
      directory: 'packages/material-top-tabs',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Navigation Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-navigation/native',
    version: '6.1.4',
    _license: 'MIT',
    _description: 'React Native integration for React Navigation',
    homepage: 'https://reactnavigation.org',
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-navigation/react-navigation.git',
      directory: 'packages/native',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Navigation Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-navigation/native-stack',
    version: '6.9.10',
    _license: 'MIT',
    _description: 'Native stack navigator using react-native-screens',
    homepage: 'https://github.com/software-mansion/react-native-screens#readme',
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-navigation/react-navigation.git',
      directory: 'packages/native-stack',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Navigation Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@react-navigation/stack',
    version: '6.3.14',
    _license: 'MIT',
    _description:
      'Stack navigator component for iOS and Android with animated transitions and gestures',
    homepage: 'https://reactnavigation.org/docs/stack-navigator/',
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-navigation/react-navigation.git',
      directory: 'packages/stack',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Navigation Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@tanstack/react-query',
    version: '4.24.9',
    _license: 'MIT',
    _description:
      'Developer tools to interact with and visualize the TanStack/react-query cache',
    homepage: 'https://tanstack.com/query',
    author: {name: 'tannerlinsley'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/tanstack/query.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2021-present Tanner Linsley\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: '@utae/react-native-kakao-share-link',
    version: '1.2.0',
    _license: 'MIT',
    _description:
      '리액트 네이티브로 사용하는 카카오톡으로 공유하기. Kakao SDK v2를 사용한 카카오 링크(공유).',
    homepage: 'https://github.com/utae/react-native-kakao-share-link#readme',
    author: {
      name: 'utae',
      email: 'utae92@gmail.com',
      url: 'https://github.com/utae',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/utae/react-native-kakao-share-link.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2020 millo-L\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'axios',
    version: '0.27.2',
    _license: 'MIT',
    _description: 'Promise based HTTP client for the browser and node.js',
    homepage: 'https://axios-http.com',
    author: {name: 'Matt Zabriskie'},
    repository: {type: 'git', url: 'git+https://github.com/axios/axios.git'},
    _licenseContent:
      'Copyright (c) 2014-present Matt Zabriskie\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\nTHE SOFTWARE.\n',
  },
  {
    libraryName: 'expo',
    version: '46.0.20',
    _license: 'MIT',
    _description: 'The Expo SDK',
    homepage: 'https://github.com/expo/expo/tree/main/packages/expo',
    author: {name: 'Expo'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/expo/expo.git',
      directory: 'packages/expo',
    },
    _licenseContent:
      'The MIT License (MIT)\nCopyright (c) 2015-present 650 Industries, Inc. (aka Expo)\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n    \nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n    \nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.',
  },
  {
    libraryName: 'jwt-decode',
    version: '3.1.2',
    _license: 'MIT',
    _description: 'Decode JWT tokens, mostly useful for browser applications.',
    homepage: 'https://github.com/auth0/jwt-decode#readme',
    author: {
      name: 'Jose F. Romaniello',
      email: 'jfromaniello@gmail.com',
      url: 'http://joseoncode.com',
    },
    repository: {type: 'git', url: 'git://github.com/auth0/jwt-decode.git'},
    _licenseContent:
      'The MIT License (MIT)\n \nCopyright (c) 2015 Auth0, Inc. <support@auth0.com> (http://auth0.com)\n \nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n \nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n \nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'mobx',
    version: '6.8.0',
    _license: 'MIT',
    _description: 'Simple, scalable state management.',
    homepage: 'https://mobx.js.org/',
    author: {name: 'Michel Weststrate'},
    repository: {type: 'git', url: 'git+https://github.com/mobxjs/mobx.git'},
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2015 Michel Weststrate\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'mobx-react-lite',
    version: '3.4.0',
    _license: 'MIT',
    _description:
      'Lightweight React bindings for MobX based on React 16.8+ and Hooks',
    homepage: 'https://mobx.js.org',
    author: {name: 'Daniel K.'},
    repository: {type: 'git', url: 'git+https://github.com/mobxjs/mobx.git'},
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2015 Michel Weststrate\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'prop-types',
    version: '15.8.1',
    _license: 'MIT',
    _description: 'Runtime type checking for React props and similar objects.',
    homepage: 'https://facebook.github.io/react/',
    repository: {
      type: 'git',
      url: 'git+https://github.com/facebook/prop-types.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2013-present, Facebook, Inc.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react',
    version: '18.0.0',
    _license: 'MIT',
    _description: 'React is a JavaScript library for building user interfaces.',
    homepage: 'https://reactjs.org/',
    repository: {
      type: 'git',
      url: 'git+https://github.com/facebook/react.git',
      directory: 'packages/react',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) Facebook, Inc. and its affiliates.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-dom',
    version: '18.0.0',
    _license: 'MIT',
    _description: 'React package for working with the DOM.',
    homepage: 'https://reactjs.org/',
    repository: {
      type: 'git',
      url: 'git+https://github.com/facebook/react.git',
      directory: 'packages/react-dom',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) Facebook, Inc. and its affiliates.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-hook-form',
    version: '7.43.1',
    _license: 'MIT',
    _description:
      'Performant, flexible and extensible forms library for React Hooks',
    homepage: 'https://www.react-hook-form.com',
    author: {email: 'bluebill1049@hotmail.com'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-hook-form/react-hook-form.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2019-present Beier(Bill) Luo\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native',
    version: '0.69.7',
    _license: 'MIT',
    _description: 'A framework for building native apps using React',
    homepage: 'https://github.com/facebook/react-native#readme',
    repository: {
      type: 'git',
      url: 'git+https://github.com/facebook/react-native.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) Meta Platforms, Inc. and affiliates.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-animated-pagination-dot',
    version: '0.4.0',
    _license: 'MIT',
    _description: 'test',
    homepage:
      'https://github.com/Soomgo-Mobile/react-native-animated-pagination-dot#readme',
    author: {name: 'Pratt Yeon', email: 'rouge3351@gmail.com'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/Soomgo-Mobile/react-native-animated-pagination-dot.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2019 rouge3351\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-fast-image',
    version: '8.6.3',
    _license: '(MIT AND Apache-2.0)',
    _description: '🚩 FastImage, performant React Native image component.',
    homepage: 'https://github.com/DylanVann/react-native-fast-image#readme',
    author: {
      name: 'Dylan Vann',
      email: 'dylan@dylanvann.com',
      url: 'https://dylanvann.com',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/DylanVann/react-native-fast-image.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 Dylan Vann\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-fs',
    version: '2.20.0',
    _license: 'MIT',
    _description: 'Native filesystem access for react-native',
    homepage: 'https://github.com/itinance/react-native-fs#readme',
    author: {
      name: 'Johannes Lumpe',
      email: 'johannes@lum.pe',
      url: 'https://github.com/johanneslumpe',
    },
    repository: {
      type: 'git',
      url: 'git+ssh://git@github.com/itinance/react-native-fs.git',
    },
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2015 Johannes Lumpe\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-gesture-handler',
    version: '2.5.0',
    _license: 'MIT',
    _description:
      'Experimental implementation of a new declarative API for gesture handling in react-native',
    homepage:
      'https://github.com/software-mansion/react-native-gesture-handler#readme',
    author: {name: 'Krzysztof Magiera', email: 'krzys.magiera@gmail.com'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/software-mansion/react-native-gesture-handler.git',
    },
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2016 Software Mansion <swmansion.com>\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-image-zoom-viewer',
    version: '3.0.1',
    _license: 'MIT',
    _description: 'react native image viewer,大图浏览',
    homepage: 'https://github.com/ascoders/react-native-image-viewer#readme',
    author: {name: 'ascoders'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/ascoders/react-native-image-viewer.git',
    },
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2015 ascoders\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-modal',
    version: '13.0.1',
    _license: 'MIT',
    _description: 'An enhanced React Native modal',
    homepage: 'https://github.com/react-native-community/react-native-modal',
    author: {name: 'Mazzarolo Matteo'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-native-community/react-native-modal.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Native Community\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-pager-view',
    version: '6.1.4',
    _license: 'MIT',
    _description: 'React Native wrapper for Android and iOS ViewPager',
    homepage: 'https://github.com/callstack/react-native-pager-view#readme',
    author: {
      name: 'troZee',
      email: 'hello@callstack.com',
      url: 'https://github.com/callstack',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/callstack/react-native-pager-view.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2021 Callstack\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-restart',
    version: '0.0.24',
    _license: 'MIT',
    _description:
      'Sometimes you want to reload your app bundle during app runtime. This package will allow you to do it.',
    homepage: 'https://github.com/avishayil/react-native-restart#readme',
    author: {
      name: 'Avishay Bar',
      email: 'avishay.il@gmail.com',
      url: 'https://github.com/avishayil',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/avishayil/react-native-restart.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2020 Avishay Bar\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-safe-area-context',
    version: '4.3.1',
    _license: 'MIT',
    _description:
      'A flexible way to handle safe area, also works on Android and web.',
    homepage:
      'https://github.com/th3rdwave/react-native-safe-area-context#readme',
    author: {name: 'Janic Duplessis', email: 'janicduplessis@gmail.com'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/th3rdwave/react-native-safe-area-context.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2019 Th3rd Wave\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-screens',
    version: '3.15.0',
    _license: 'MIT',
    _description: 'Native navigation primitives for your React Native app.',
    homepage: 'https://github.com/software-mansion/react-native-screens#readme',
    author: {name: 'Krzysztof Magiera', email: 'krzys.magiera@gmail.com'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/software-mansion/react-native-screens.git',
    },
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2018 Software Mansion <swmansion.com>\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-tab-view',
    version: '3.5.0',
    _license: 'MIT',
    _description: 'Tab view component for React Native',
    homepage:
      'https://github.com/react-navigation/react-navigation/tree/main/packages/react-native-tab-view#readme',
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-navigation/react-navigation.git',
      directory: 'packages/react-native-tab-view',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2017 React Native Community\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-web',
    version: '0.18.12',
    _license: 'MIT',
    _description: 'React Native for Web',
    homepage: 'https://github.com/necolas/react-native-web#readme',
    author: {name: 'Nicolas Gallagher'},
    repository: {
      type: 'git',
      url: 'git://github.com/necolas/react-native-web.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) Nicolas Gallagher.\nCopyright (c) Meta Platforms, Inc. and affiliates.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'react-native-webview',
    version: '11.26.1',
    _license: 'MIT',
    _description:
      'React Native WebView component for iOS, Android, macOS, and Windows',
    homepage:
      'https://github.com/react-native-webview/react-native-webview#readme',
    author: {name: 'Jamon Holmgren', email: 'jamon@infinite.red'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/react-native-webview/react-native-webview.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2015-present, Facebook, Inc.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n',
  },
  {
    libraryName: 'styled-components',
    version: '5.3.6',
    _license: 'MIT',
    _description:
      'Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress',
    homepage: 'https://styled-components.com',
    author: {name: 'Glen Maddern'},
    repository: {
      type: 'git',
      url: 'git+https://github.com/styled-components/styled-components.git',
    },
    _licenseContent:
      'MIT License\n\nCopyright (c) 2016-present Glen Maddern and Maximilian Stoiber\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n    \nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n    \nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.',
  },
  {
    libraryName: 'react-native-date-picker',
    version: '4.2.9',
    _license: 'MIT',
    homepage: 'https://github.com/henninghall/react-native-date-picker',
    _licenseContent:
      'MIT License\nCopyright (c) 2018 Henning Hall\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n     \nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n     \nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.',
  },

  {
    libraryName: 'react-native-keyboard-aware-scroll-view',
    version: '0.9.5',
    _license: 'MIT',
    homepage:
      'https://github.com/APSL/react-native-keyboard-aware-scroll-view#readme',
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2015 APSL\n      \nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n      \nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n      \nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.',
  },
  {
    libraryName: 'react-native-view-shot',
    version: '3.6.0',
    _license: 'MIT',
    homepage: 'https://github.com/gre/react-native-view-shot',
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2016 Gaëtan Renaudeau\n      \nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n      \nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n      \nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.',
  },
  {
    libraryName: 'react-native-device-info',
    version: '10.6.0',
    _license: 'MIT',
    homepage:
      'https://github.com/react-native-device-info/react-native-device-info',
    _licenseContent:
      'The MIT License (MIT)\n\nCopyright (c) 2015 Rebecca Hughes\n      \nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n      \nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n      \nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n      SOFTWARE.',
  },
];
