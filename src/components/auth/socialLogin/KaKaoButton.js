import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProfile,
  login,
  KakaoOAuthToken,
} from '@react-native-seoul/kakao-login';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import React from 'react';
import {METHOD, _promise} from '../../../api/ApiConfig';
import {loginApi} from '../../../api/AuthApi';
import {joinFamilyApi} from '../../../api/FamilyApi';
import authStore from '../../../stores/AuthStore';
import familyStore from '../../../stores/FamilyStore';
import BaseButton from './BaseButton';
import RNRestart from 'react-native-restart';
import PropTypes from 'prop-types';
import {ROUTE_NAME} from '../../../Strings';
import Toast from '../../Toast';

export default function KakaoButton({familyJoinToken}) {
  const navigation = useNavigation();

  const loginWithToken = useMutation(loginApi);

  const loginKakao = async () => {
    const token = await login();

    const user = await getProfile();

    loginWithToken.mutate(
      {token: token.accessToken, provider: 'kakao'},
      {
        onSuccess: async data => {
          const {
            data: {ok, accessToken, refreshToken, signUpRequired, error},
          } = data;

          if (!ok && signUpRequired) {
            navigation.navigate(ROUTE_NAME.SIGN_UP, {
              userName: user.nickname,
              email: user.email,
              ...(familyJoinToken && {familyId: familyJoinToken}),
              provider: 'kakao',
              token: token.accessToken,
            });
          } else if (!ok && !signUpRequired && error === 'INACTIVE ID') {
            Toast({message: '사용할 수 없는 계정입니다'});
          } else if (ok) {
            // 2. mobx 활용 - 전역 login State === true
            await authStore.loginAction({accessToken, refreshToken});
            // 완료 후 navigation 전환 --> LoggedInNav

            if (familyJoinToken) {
              if (
                navigation.getState().routes[0].name === ROUTE_NAME.MAIN_TAB_NAV
              )
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: ROUTE_NAME.FAMILY_JOIN,
                        params: {id: familyJoinToken},
                      },
                    ],
                  }),
                );
            }
          }
        },
      },
    );
  };

  return (
    <BaseButton
      bgColor="#f1d905"
      logoPath={require('../../../../assets/images/kakao.png')}
      onPress={loginKakao}
      textPayload="카카오톡으로 로그인"
    />
  );
}

KakaoButton.propTypes = {
  familyJoinToken: PropTypes.string,
};
