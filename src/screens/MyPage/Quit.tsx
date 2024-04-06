import React, {useState} from 'react';
import styled from 'styled-components/native';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import {Colors} from '../../Config';
import {Ionicons} from '@expo/vector-icons';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {quitServiceApi} from '../../api/AuthApi';
import authStore from '../../stores/AuthStore';
import {RowContainer} from '../../components/common/Common';
import {SignedInScreenProps} from '../../navigators/types';

const Container = styled.View`
  padding: 0px 15px;
`;

const TextBold = styled.Text`
  font-family: 'nanum-bold';
  padding: 5px;
`;

const TextRegular = styled.Text`
  font-size: 12px;
  line-height: 14px;
  font-family: 'nanum-regular';
  padding: 5px 12px;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 15px 2px;
  padding: 12px;
  border-radius: 10px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const BtnText = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
  color: white;
`;

const CheckListContainer = styled.View`
  padding: 10px;
  background-color: ${Colors.borderLight};
  border-radius: 10px;
  margin-top: 5px;
`;

const AgreeContainer = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export default function Quit({navigation}: SignedInScreenProps<'Quit'>) {
  const [agree, setAgree] = useState(false);

  const quitService = useMutation(quitServiceApi, {
    onSuccess: () => {
      authStore.logoutAction();
    },
  });

  if (quitService.isLoading) {
    <ScreenLayout>
      <ActivityIndicatorWrapper>
        <ActivityIndicator />
      </ActivityIndicatorWrapper>
    </ScreenLayout>;
  }
  //   회원탈퇴 시 유의사항
  //   • 우리가 서비스 탈퇴시 아래의 이용기록을 이용자가 확인할 수 없게 됩니다.
  //    - 이용자가 작성한 댓글 (댓글 내역)
  //    - 이용자가 접수한 1:1 문의 및 신고 내역 (신고 내역)
  //    - 이용자가 저장한 메세지 (보관함 기능)
  //    - 이용자가 선택한 감정 상태
  //    - 이용자가 등록한 사진

  //  이용자가 작성했던 메세지의 관리
  //   • 회원탈퇴 후 우리가에서 작성된 모든 메세지(댓글 제외)는 삭제되지 않습니다.
  //   • 전송중인 메세지 삭제 또는 수정이 불가합니다.

  //  회원탈퇴 후 정보의 삭제
  //   • 유의사항에서 안내되는 이용기록은 '우리가 개인정보 처리방침'에 의거하여 탈퇴 일로부터 3개월 뒤 삭제됩니다.
  return (
    <ScreenLayout>
      <Container>
        <TextBold style={{fontSize: 16}}>
          우리가를 정말 탈퇴하시겠습니까?
        </TextBold>
        <TextRegular style={{marginLeft: 10, fontSize: 14}}>
          탈퇴 전, 아래의 내용을 확인해주세요
        </TextRegular>

        <CheckListContainer>
          <TextBold>회원탈퇴 시 유의사항</TextBold>
          <TextRegular>
            • 서비스 탈퇴 시 아래의 이용 기록을 확인할 수 없게 됩니다.
          </TextRegular>
          <TextRegular>{'- 이용자가 작성한 편지'}</TextRegular>
          <TextRegular>{'- 이용자가 보관한 이야기 / 편지'}</TextRegular>
          <TextRegular>{'- 이용자가 선택한 감정 상태'}</TextRegular>
          <TextRegular>{'- 이용자가 등록한 사진'}</TextRegular>
          <TextRegular>{'- 이용자가 작성한 댓글'}</TextRegular>
          <TextRegular>{'- 이용자가 접수한 1:1 문의 및 신고 내역'}</TextRegular>

          <TextBold style={{marginTop: 10}}>
            이용자가 수신 / 발신 했던 편지의 관리
          </TextBold>
          <TextRegular>
            • 편지는 수신자, 발신자 모두 회원탈퇴 시 삭제됩니다.
          </TextRegular>
          <TextRegular>
            • 전송한 편지는 삭제 또는 수정이 불가합니다.
          </TextRegular>

          <TextBold style={{marginTop: 10}}>회원탈퇴 후 정보의 삭제</TextBold>
          <TextRegular>
            • 유의사항에서 안내되는 이용기록은 '우리가 개인정보 처리방침'에
            의거하여 탈퇴 일로부터 3개월 뒤 삭제됩니다.
          </TextRegular>
        </CheckListContainer>
        <AgreeContainer>
          <TextBold style={{fontSize: 14}}>(필수)</TextBold>
          <Text style={{fontFamily: 'nanum-regular', marginRight: 10}}>
            위 내용을 확인하였습니다
          </Text>
          <TouchableOpacity onPress={() => setAgree(!agree)}>
            <Ionicons
              name={agree ? 'checkbox-outline' : 'square-outline'}
              size={16}
            />
          </TouchableOpacity>
        </AgreeContainer>
        <RowContainer>
          <Button
            style={{backgroundColor: Colors.borderDark}}
            disabled={!agree}
            onPress={() => {
              if (agree) {
                quitService.mutate();
              }
            }}>
            <BtnText>탈퇴하기</BtnText>
          </Button>
          <Button
            style={{backgroundColor: Colors.main}}
            onPress={() => navigation.goBack()}>
            <BtnText>돌아가기</BtnText>
          </Button>
        </RowContainer>
      </Container>
    </ScreenLayout>
  );
}
