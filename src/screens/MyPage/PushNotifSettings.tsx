import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {editUserApi, myProfile} from '../../api/UsersApi';
import Menu from '../../components/myPage/Menu';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import {Colors} from '../../Config';
import useMe from '../../hooks/useMe';
import {MenuContainer} from './MyPage';
import {useQuery, useMutation} from '@tanstack/react-query';
import {ActivityIndicator, Linking} from 'react-native';

const PushContainer = styled.View`
  border: 0.5px solid #aeaeae;
  border-radius: 15px;
  flex-direction: row;
  padding: 10px 10px;
  margin-bottom: 5px;
  align-items: center;
`;

const PushTitle = styled.Text`
  flex: 1;
  font-family: 'nanum-regular';
`;

const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  border-radius: 10px;
  padding: 10px;
  /* width: 60px; */
  /* height: 35px; */
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 12px;
  font-family: 'nanum-regular';
  /* padding: 10px; */
`;

const ToggleContainer = styled.View`
  align-items: flex-end;
  justify-content: center;
  background-color: white;
  /* padding: 10px 0px; */
`;

const ToggleWrapper = styled.View`
  flex-direction: row;
  display: flex;
  align-items: center;
  border-radius: 30px;
  background-color: ${Colors.borderLight};
`;

const ToggleButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  /* height: 30px; */
  padding: 10px 16px;
  border-radius: 30px;
  background-color: ${props => (props.isFocused ? Colors.main : 'transparent')};
`;

const ToggleText = styled.Text`
  font-size: 12px;
  font-family: 'nanum-bold';
  color: ${props => (props.isFocused ? 'white' : 'black')};
`;

export default function PushNofitSettings({navigation}) {
  const [mktOn, setMktOn] = useState(false);

  const {data: me, isLoading} = useQuery(['Me'], myProfile, {
    onSuccess: data => setMktOn(data?.data.mktPushAgreed),
  });

  const editUser = useMutation(editUserApi);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (me?.data.mktPushAgreed !== mktOn) {
        editUser.mutate({
          mktPushAgreed: mktOn,
        });
      }
    });
  }, [navigation, mktOn]);

  if (isLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <MenuContainer>
        <PushContainer>
          <PushTitle>푸시 설정</PushTitle>
          <Button onPress={() => Linking.openSettings()}>
            <ButtonText>바로가기</ButtonText>
          </Button>
        </PushContainer>

        <PushContainer>
          <PushTitle>마케팅 푸시 알림</PushTitle>
          <ToggleContainer>
            <ToggleWrapper>
              <ToggleButton isFocused={mktOn} onPress={() => setMktOn(!mktOn)}>
                <ToggleText isFocused={false}>켜기</ToggleText>
              </ToggleButton>
              <ToggleButton isFocused={!mktOn} onPress={() => setMktOn(!mktOn)}>
                <ToggleText isFocused={false}>끄기</ToggleText>
              </ToggleButton>
            </ToggleWrapper>
          </ToggleContainer>
        </PushContainer>
      </MenuContainer>
    </ScreenLayout>
  );
}
