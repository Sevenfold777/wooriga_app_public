import React from 'react';
import styled from 'styled-components/native';
import ScreenLayout from '../../components/ScreenLayout';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';

const Container = styled.View`
  padding: 10px 15px;
`;

const InquiryContainer = styled.View`
  height: 200px;
  background-color: white;
  border-radius: 15px;
  border: 0.5px solid ${Colors.borderDark};
  margin-bottom: 20px;
`;

const TitleContainer = styled.View`
  /* margin: 10px 10px 15px 10px; */
`;

const TitleText = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
  padding: 10px;
`;

const InquiryPayload = styled.Text`
  padding: 12px;
  color: black;
  font-size: 16px;
  height: 100%;
  /* font-family: "nanum-regular"; */
`;

export default function UserInquiry({
  navigation,
  route: {params},
}: SignedInScreenProps<'UserInquiry'>) {
  const inquiry = params?.inquiry;

  return (
    <ScreenLayout>
      <Container>
        <TitleContainer>
          <TitleText>{`Q. ${inquiry.title}`}</TitleText>
        </TitleContainer>
        <InquiryContainer>
          <InquiryPayload>{inquiry.payload}</InquiryPayload>
        </InquiryContainer>
        <TitleContainer>
          <TitleText>{`A. 답변`}</TitleText>
        </TitleContainer>
        <InquiryContainer>
          <InquiryPayload>{inquiry.reply}</InquiryPayload>
        </InquiryContainer>
      </Container>
    </ScreenLayout>
  );
}
