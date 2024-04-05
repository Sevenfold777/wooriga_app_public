import React from 'react';
import PropTypes from 'prop-types';
import BaseButton from './BaseButton';
import {Platform} from 'react-native';
import NaverLogin from '@react-native-seoul/naver-login';
import {useMutation} from '@tanstack/react-query';
import {loginApi} from '../../../api/AuthApi';
import authStore from '../../../stores/AuthStore';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Toast from '../../Toast';

const iosKeys = {
  serviceUrlScheme: 'wooriganaver',
  consumerKey: 'u9MgMqwCB8P0eHr6yKuj',
  consumerSecret: 'KptLSbjgiz',
  appName: '우리가',
};

const androidKeys = {
  consumerKey: 'u9MgMqwCB8P0eHr6yKuj',
  consumerSecret: 'KptLSbjgiz',
  appName: '우리가',
};

const initials = Platform.OS === 'ios' ? iosKeys : androidKeys;

type NaverKeys = {
  serviceUrlScheme?: string;
  consumerKey: string;
  consumerSecret: string;
  appName: string;
};

export default function NaverButton({
  familyJoinToken,
}: {
  familyJoinToken: string;
}) {
  const navigation = useNavigation();

  const loginWithToken = useMutation(loginApi);

  const loginNaver = async (props: NaverKeys) => {
    const {successResponse} = await NaverLogin.login(props);
    if (!successResponse?.accessToken) {
      return;
    }

    const user = await NaverLogin.getProfile(successResponse.accessToken);

    loginWithToken.mutate(
      {token: successResponse.accessToken, provider: 'naver'},
      {
        onSuccess: async data => {
          const {
            data: {ok, accessToken, refreshToken, signUpRequired, error},
          } = data;

          if (!ok && signUpRequired) {
            navigation.navigate('SignUp', {
              userName: user.response.name,
              email: user.response.email,
              ...(familyJoinToken && {familyId: familyJoinToken}),
              provider: 'naver',
              token: accessToken,
            });
          } else if (!ok && !signUpRequired && error === 'INACTIVE ID') {
            Toast({message: '사용할 수 없는 계정입니다'});
          } else if (ok) {
            // 2. mobx 활용 - 전역 login State === true
            await authStore.loginAction({accessToken, refreshToken});
            // 완료 후 navigation 전환 --> LoggedInNav

            if (familyJoinToken) {
              if (navigation.getState()?.routes[0].name === 'MainTabNav') {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'FamilyJoin',
                        params: {id: familyJoinToken},
                      },
                    ],
                  }),
                );
              }
            }
          }
        },
      },
    );
  };

  return (
    <BaseButton
      bgColor="#1DC800"
      logoPath={require('../../../../assets/images/naver.png')}
      onPress={() => loginNaver(initials)}
      textPayload={'네이버로 로그인'}
      textColor="black"
    />
  );
}

NaverButton.propTypes = {
  familyJoinToken: PropTypes.string,
};
