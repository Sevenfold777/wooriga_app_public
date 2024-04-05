import {useMutation} from '@tanstack/react-query';
import React, {useEffect} from 'react';
import {DevSettings, Text, View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../components/common/ScreenLayout';
import {joinFamilyApi} from '../api/FamilyApi';
import styled from 'styled-components/native';

import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ROUTE_NAME} from '../Strings';
import authStore from '../stores/AuthStore';
import {CommonActions} from '@react-navigation/native';
import {SignedInScreenProps} from '../navigators/types';

const UploadingText = styled.Text`
  padding: 15px;
  font-family: 'nanum-regular';
  text-align: center;
  line-height: 20px;
  white-space: pre-line;
`;

export default function FamilyJoin({
  navigation,
  route: {params},
}: SignedInScreenProps<'FamilyJoin'>) {
  const joinFamily = useMutation(joinFamilyApi, {
    onSuccess: async data => {
      const result = data?.data;
      console.log(result);

      if (result?.ok) {
        authStore.loginAction({
          accessToken: result?.accessToken,
          refreshToken: result?.refreshToken,
        });

        await AsyncStorage.setItem('familyJoinResult', 'true');
        RNRestart.Restart();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: ROUTE_NAME.MAIN_TAB_NAV,
              },
            ],
          }),
        );
      }
    },
  });

  /** refetch when navigated with mutation */
  useEffect(() => {
    const familyJoinProcess = async () => {
      const familyJoinResult = await AsyncStorage.getItem('familyJoinResult');

      // 이미 가입 완료했으면
      if (JSON.parse(familyJoinResult)) {
        await AsyncStorage.setItem('familyJoinResult', 'false'); // 가입이력 삭제
        navigation.setParams(); // family token param 삭제
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: ROUTE_NAME.MAIN_TAB_NAV,
              },
            ],
          }),
        );
      } else {
        // 가입 완료한 이력이 없으면 가입
        joinFamily.mutate(params?.id);
      }
    };

    familyJoinProcess();
  }, []);

  return (
    <ScreenLayout>
      {joinFamily.isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 80,
          }}>
          <ActivityIndicator />
          <UploadingText>
            {'가족에 가입 중입니다.\n잠시만 기다려주세요...'}
          </UploadingText>
        </View>
      )}
    </ScreenLayout>
  );
}
