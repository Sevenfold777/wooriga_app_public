import React from 'react';
import {Image} from 'react-native';
import {TouchableWithoutFeedback, useWindowDimensions} from 'react-native';
import styled from 'styled-components/native';
import {BGColors, Colors} from '../../Config';
import assetStore from '../../stores/AssetStore';
import {
  Container,
  MessageContainer,
  MessagePayload,
  Actions,
  Emotion,
  EmotionWrapper,
  PayloadWrapper,
} from './Message';
import {Ionicons} from '@expo/vector-icons';
import propTypes from 'prop-types';
import Clipboard from '@react-native-clipboard/clipboard';
import KakaoShareLink from '@utae/react-native-kakao-share-link';

const InviteText = styled.Text`
  font-family: 'nanum-regular';
  padding: 5px 10px;
`;

const SubContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(1, 1, 1, 0.2);
  padding: 5px 20px;
  border-radius: 7px;
  margin: 10px;
`;

const SubText = styled.Text`
  margin: 0px 3px 0px 5px;
  font-family: 'nanum-regular';
  font-size: 13px;
  color: white;
`;

const SendBtn = styled.TouchableOpacity<{isLeft: boolean}>`
  justify-content: center;
  align-items: center;
  padding: 10px;
  flex: 1;
  flex-direction: row;
  border-right-color: ${Colors.borderLight};
  border-right-width: ${props => (props.isLeft ? 0.5 : 0)};
`;

type Props = {
  inviteLink: string;
};

export default function InviteMessage({inviteLink}: Props) {
  const {width: pageWidth} = useWindowDimensions();

  const emotion = 'comfort';
  const CLIPBOARD_TEXT = '초대 링크 보내기';
  const KAKAO_TEXT = '카카오톡 공유';

  const sendKakaoMessage = async () => {
    try {
      const response = await KakaoShareLink.sendFeed({
        content: {
          title: '우리가',
          imageUrl:
            'https://wooriga-dev.s3.ap-northeast-2.amazonaws.com/emotions/invitation.jpeg',
          link: {webUrl: inviteLink, mobileWebUrl: inviteLink},
          description: '우리가족에 초대되었습니다.',
        },
        buttons: [
          {
            title: '초대 확인하기',
            link: {webUrl: inviteLink, mobileWebUrl: inviteLink},
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => sendKakaoMessage()}>
      <Container>
        <MessageContainer
          style={{width: pageWidth, backgroundColor: BGColors[emotion]}}>
          <EmotionWrapper>
            <Emotion
              source={{uri: assetStore.messageEmotions[emotion]}}
              resizeMode="contain"
            />
          </EmotionWrapper>

          <PayloadWrapper>
            <MessagePayload numberOfLines={2} allowFontScaling={false}>
              {'가족을 초대해서\n우리가에서 이야기 해요'}
            </MessagePayload>

            <SubContainer>
              <SubText allowFontScaling={false}>{CLIPBOARD_TEXT}</SubText>
              <Ionicons name="paper-plane" color={Colors.white} />
            </SubContainer>
          </PayloadWrapper>
        </MessageContainer>

        <Actions>
          <SendBtn
            isLeft={true}
            onPress={() => {
              Clipboard.setString(inviteLink);
            }}>
            <Ionicons name="copy-outline" size={25} style={{margin: 5}} />
            <InviteText>초대 링크 복사</InviteText>
          </SendBtn>

          <SendBtn onPress={() => sendKakaoMessage()}>
            <Image
              source={require('../../../assets/images/kakao.png')}
              style={{width: 24, height: 20}}
              resizeMode="contain"
            />
            <InviteText>{KAKAO_TEXT}</InviteText>
          </SendBtn>
        </Actions>
      </Container>
    </TouchableWithoutFeedback>
  );
}

InviteMessage.propTypes = {
  inviteLink: propTypes.string.isRequired,
};
