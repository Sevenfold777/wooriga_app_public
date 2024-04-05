import React from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {loginApi} from '../../../api/AuthApi';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import authStore from '../../../stores/AuthStore';
import BaseButton from './BaseButton';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {Colors} from '../../../Config';
import Toast from '../../Toast';

export default function AppleButton({
  familyJoinToken,
}: {
  familyJoinToken: string;
}) {
  const navigation = useNavigation();

  const loginWithToken = useMutation(loginApi);

  /** apple Login */

  const loginApple = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const creadentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (creadentialState === appleAuth.State.AUTHORIZED) {
      // Authenticated
      const {email, identityToken, nonce, fullName} = appleAuthRequestResponse;

      const familyName = fullName?.familyName || '';
      const givenName = fullName?.givenName || '';

      // get Name
      const userName = familyName + givenName;

      if (!identityToken) {
        return;
      }

      const decoded = await jwt_decode(identityToken);

      loginWithToken.mutate(
        {token: identityToken, nonce, provider: 'apple'},
        {
          onSuccess: async data => {
            const {
              data: {ok, accessToken, refreshToken, signUpRequired, error},
            } = data;

            if (!ok && signUpRequired) {
              navigation.navigate('SignUp', {
                userName: userName || '',
                email: email || decoded?.email,
                ...(familyJoinToken && {familyId: familyJoinToken}),
                provider: 'apple',
                token: identityToken,
                nonce,
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
    }
  };

  return (
    <BaseButton
      bgColor="#000000"
      logoPath={require('../../../../assets/images/apple.png')}
      onPress={loginApple}
      textPayload={'Apple로 로그인'}
      textColor={Colors.white}
    />
  );
}

AppleButton.propTypes = {
  familyJoinToken: PropTypes.string,
};
