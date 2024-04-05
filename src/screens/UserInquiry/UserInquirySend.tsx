import {useMutation} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {createInquiryApi, editInquiryApi} from '../../api/UserInquiry';
import Completed from '../../components/Completed';
import DismissKeyboard from '../../components/DismissKeyboard';
import ScreenLayout from '../../components/ScreenLayout';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';

const Wrapper = styled.View`
  padding: 10px;
`;

const Container = styled.View`
  margin-bottom: 30px;
`;

const TagContainer = styled.View`
  justify-content: center;
  margin-bottom: 10px;
  padding: 0px 15px;
`;

const TagText = styled.Text`
  font-size: 16px;
  font-family: 'nanum-bold';
`;

const TitleContainer = styled.View`
  margin: 0px 5px;
`;

const TitleInput = styled.TextInput`
  height: 50px;
  border-radius: 25px;
  padding: 10px 15px;
  border: 0.5px solid ${Colors.borderDark};
  color: black;
  font-family: 'nanum-regular';
`;

const PayloadContainer = styled.View`
  margin: 0px 5px;
`;

const PayloadInput = styled.TextInput`
  height: 150px;
  padding: 12px;
  border-radius: 20px;
  border: 0.5px solid ${Colors.borderDark};
  color: black;
  font-family: 'nanum-regular';
  line-height: 20px;
`;

const SendBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  margin: 0px 5px 10px 5px;
  padding: 12px;
  border-radius: 10px;
  opacity: ${props => (props.disabled ? '0.5' : '1')};
`;

const SendText = styled.Text`
  font-size: 16px;
  font-family: 'nanum-bold';
`;

export default function UserInquirySend({
  navigation,
  route: {params},
}: SignedInScreenProps<'UserInquirySend'>) {
  const {control, handleSubmit, watch, reset} = useForm({
    ...(params?.title &&
      params?.payload && {
        defaultValues: {
          title: params?.title,
          payload: params?.payload,
        },
      }),
  });

  const [isSent, setSent] = useState(false);

  const sendInquiry = useMutation(
    params?.edit ? editInquiryApi : createInquiryApi,
    {
      onSuccess: () => {
        reset();
        setSent(true);
      },
    },
  );

  const onValid = ({title, payload}: {title: string; payload: string}) => {
    sendInquiry.mutate({
      ...(params?.edit && {id: params?.id}),
      title,
      payload,
    });
  };

  const HeaderRight = () => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          width: '90%',
          height: '100%',
        }}
      />
    </TouchableWithoutFeedback>
  );

  useEffect(() => {
    navigation.setOptions({headerRight: HeaderRight});
  }, []);

  if (isSent) {
    return (
      <Completed
        mainText="문의 사항이 접수 완료되었습니다."
        subText="운영진의 확인 후 답변드리겠습니다. 감사합니다."
        toBack={() => navigation.navigate('MainTabNav', {screen: 'MyPageNav'})}
      />
    );
  }

  return (
    <ScreenLayout>
      <DismissKeyboard>
        <Wrapper>
          <Container>
            <TagContainer>
              <TagText>제목</TagText>
            </TagContainer>
            <TitleContainer>
              <Controller
                control={control}
                name="title"
                render={({field: {onChange, value}}) => (
                  <TitleInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="제목을 입력해주세요."
                    autoCapitalize="none"
                  />
                )}
              />
            </TitleContainer>
          </Container>

          <Container>
            <TagContainer>
              <TagText>문의 내용</TagText>
            </TagContainer>
            <PayloadContainer>
              <Controller
                control={control}
                name="payload"
                render={({field: {onChange, value}}) => (
                  <PayloadInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="서비스에 대한 문의사항을 입력해주세요."
                    autoCapitalize="none"
                    multiline={true}
                    textAlignVertical="top"
                  />
                )}
              />
            </PayloadContainer>
          </Container>

          <SendBtn
            onPress={handleSubmit(onValid)}
            disabled={!watch('title') && !watch('payload')}>
            <SendText>
              {sendInquiry.isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                '보내기'
              )}
            </SendText>
          </SendBtn>
        </Wrapper>
      </DismissKeyboard>
    </ScreenLayout>
  );
}
