import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import {BGColors, BottomPhrases} from '../../Config';
import assetStore from '../../stores/AssetStore';
import PropTypes from 'prop-types';
import {EmotionWrapper} from './Message';

const MessageContainer = styled.View`
  margin: 0px 10px;
  justify-content: center;
  align-items: center;
  aspect-ratio: ${4 / 3};
  border-radius: 5px;
  width: 300px;
  padding-top: 50px;
`;

const MessagePayload = styled.Text`
  text-align: center;
  font-size: 22px;
  font-family: 'kangwon-font';
  flex: 5;
`;

const Emotion = styled.Image`
  width: 40px;
  height: 40px;
  margin: 5px;
`;

const PromotePayload = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.6;
`;

type Props = {
  messageId: number;
  payload: string;
  emotion: keyof typeof BGColors;
};

export default function MessageMiddle({messageId, payload, emotion}: Props) {
  const navigation = useNavigation();

  const messageLines = payload.split(/\n/g);
  const thumbnailMessage = messageLines[1]
    ? messageLines[0].concat('\n', messageLines[1])
    : messageLines[0];

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('MessageFamily', {messageId})}>
      <MessageContainer style={{backgroundColor: BGColors[emotion]}}>
        <EmotionWrapper>
          <Emotion
            source={{uri: assetStore.messageEmotions[emotion]}}
            resizeMode="contain"
          />
        </EmotionWrapper>
        <MessagePayload numberOfLines={2} allowFontScaling={false}>
          {thumbnailMessage}
        </MessagePayload>
        <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
      </MessageContainer>
    </TouchableWithoutFeedback>
  );
}

MessageMiddle.propTypes = {
  messageId: PropTypes.number.isRequired,
  payload: PropTypes.string.isRequired,
  emotion: PropTypes.string.isRequired,
};
