import React from 'react';
import styled from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import {requestMediaPermission, requestNotificationPermission} from '../helper';
import {
  useWindowDimensions,
  View,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import authStore from '../stores/AuthStore';
import {observer} from 'mobx-react-lite';
import {Colors} from '../Config';

export const Container = styled.View`
  background-color: white;
  padding: 15px 5px;
  border-radius: 10px;
`;

export const HeaderContainer = styled.View`
  margin: 5px 0px;
  padding: 0px 10px;
`;

export const HeaderTitle = styled.Text`
  font-family: 'nanum-bold';
  font-size: 18px;
  padding: 5px 0px;
`;

export const HeaderPayload = styled.Text`
  font-family: 'nanum-regular';
  font-size: 16px;
  padding: 5px 10px;
`;

export const Body = styled.View`
  margin: 0px 15px;
`;

export const PermissionListContainer = styled.View`
  padding: 10px;
  background-color: ${Colors.sub};
  border-radius: 10px;
`;

export const PermissionContainer = styled.View`
  flex-direction: row;
  padding: 10px;
`;

export const PermissionColumn = styled.View`
  padding: 0px 10px;
`;

export const PermissionTitle = styled.Text`
  font-size: 16px;
  font-family: 'nanum-bold';
  padding: 2px;
`;

export const PermissionPayload = styled.Text`
  font-family: 'nanum-regular';
  padding: 2px 10px;
`;

const PermissionBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  margin: 15px 0px;
  padding: 12px;
  border-radius: 10px;
`;

const PermissionBtnText = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
  color: white;
`;

const DetailText = styled.Text`
  font-family: 'nanum-regular';
  color: ${Colors.borderDark};
  padding: 0px 5px;
`;

function Permissions() {
  const {height: pageHeight} = useWindowDimensions();

  const permissionRequest = async () => {
    // for Media Library (CameraRoll)
    const mediaPermission = await requestMediaPermission();

    // for Notification: FCM
    await requestNotificationPermission();

    mediaPermission
      ? authStore.setPermission(mediaPermission)
      : Linking.openSettings();
  };

  return (
    <Modal
      // isVisible={false}
      isVisible={!authStore.permissionsChecked}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={
        pageHeight +
        10 +
        (StatusBar.currentHeight ? StatusBar.currentHeight : 100)
      }>
      <Container>
        <HeaderContainer>
          <HeaderContainer>
            <HeaderTitle>우리가 접근권한 안내</HeaderTitle>
            <HeaderPayload>
              원활한 서비스 이용을 위하여 다음의 권한을 허용해주세요.
            </HeaderPayload>
          </HeaderContainer>
        </HeaderContainer>

        <Body>
          <PermissionListContainer>
            <PermissionContainer>
              <Ionicons name="images" size={20} style={{paddingVertical: 2}} />
              <PermissionColumn>
                <PermissionTitle>사진 및 동영상 (필수)</PermissionTitle>
                <PermissionPayload>
                  내 기기에 사진 파일을 저장, 가족 앨범에 업로드하기 위하여 사진
                  및 동영상 접근 허용이 필요합니다.
                </PermissionPayload>
              </PermissionColumn>
            </PermissionContainer>

            <PermissionContainer>
              <Ionicons
                name="notifications"
                size={20}
                style={{paddingVertical: 2}}
              />
              <PermissionColumn>
                <PermissionTitle>알림 (선택)</PermissionTitle>
                <PermissionPayload>
                  우리 가족의 활동을 확인하고, 우리가의 모든 서비스를 활용할 수
                  있도록 하기 위하여 알림 허용이 필요합니다.
                </PermissionPayload>
              </PermissionColumn>
            </PermissionContainer>
          </PermissionListContainer>
          <PermissionBtn onPress={() => permissionRequest()}>
            <PermissionBtnText>권한 허용</PermissionBtnText>
          </PermissionBtn>
          <TouchableOpacity
            style={{flexDirection: 'row', paddingHorizontal: 10}}
            onPress={() => Linking.openSettings()}>
            <DetailText>*</DetailText>
            <DetailText>
              {'수동 접근 권한 변경: 설정 > 우리가 > 권한'}
            </DetailText>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              marginVertical: 5,
            }}>
            <DetailText>*</DetailText>
            <DetailText>
              {'필수 권한에 동의하지 않으면 서비스를 이용하실 수 없습니다'}
            </DetailText>
          </View>
        </Body>
      </Container>
    </Modal>
  );
}

export default observer(Permissions);
