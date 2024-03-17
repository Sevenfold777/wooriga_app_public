import {CommonActions, useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import RNRestart from 'react-native-restart';
import {loginApi} from '../../../api/AuthApi';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authStore from '../../../stores/AuthStore';
import {_promise} from '../../../api/ApiConfig';
import familyStore from '../../../stores/FamilyStore';
import {joinFamilyApi} from '../../../api/FamilyApi';
import BaseButton from './BaseButton';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {ROUTE_NAME} from '../../../Strings';
import {Colors} from '../../../Config';
import Toast from '../../Toast';

export default function AppleButton({familyJoinToken}) {
  const navigation = useNavigation();

  const loginWithToken = useMutation(loginApi);

  /** apple Login */

  const loginApple = async props => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const creadentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (creadentialState === appleAuth.State.AUTHORIZED) {
      // Authenticated
      const {email, identityToken, nonce, fullName, authorizationCode} =
        appleAuthRequestResponse;

      // get Name
      const userName = fullName?.familyName + fullName?.givenName;

      const decoded = await jwt_decode(identityToken);

      loginWithToken.mutate(
        {token: identityToken, nonce, provider: 'apple'},
        {
          onSuccess: async data => {
            const {
              data: {ok, accessToken, refreshToken, signUpRequired, error},
            } = data;

            if (!ok && signUpRequired) {
              navigation.navigate(ROUTE_NAME.SIGN_UP, {
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
                if (
                  navigation.getState().routes[0].name ===
                  ROUTE_NAME.MAIN_TAB_NAV
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
    }
  };

  return (
    <BaseButton
      bgColor="#000000"
      logoPath={require('../../../../assets/images/apple.png')}
      onPress={() => loginApple()}
      textPayload={'Apple로 로그인'}
      textColor={Colors.white}
    />
  );
}

AppleButton.propTypes = {
  familyJoinToken: PropTypes.string,
};
