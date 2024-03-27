import React from 'react';
import styled from 'styled-components/native';
import {BGColors, BottomPhrases, Colors} from '../../Config';
import assetStore from '../../stores/AssetStore';
import {Indicator, IndicatorWrapper} from '../CarouselIndicator';
import ActionIcon from './ActionIcon';
import {RowContainer} from '../Common';
import {Action, Actions, Emotion, EmotionWrapper} from './Message';

const Container = styled.View``;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  aspect-ratio: ${4 / 3};
  padding-top: 60px;
`;

const MessagePayload = styled.Text`
  text-align: center;
  font-size: 28px;
  font-family: 'kangwon-font';
  flex: 5;
`;

const PromotePayload = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.6;
`;

const CommentNum = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
`;

export default function NoMessage() {
  const emotion = 'noMessage';

  return (
    <Container>
      <MessageContainer style={{backgroundColor: BGColors[emotion]}}>
        <EmotionWrapper>
          <Emotion
            source={{uri: assetStore.messageEmotions[emotion]}}
            resizeMode="contain"
          />
        </EmotionWrapper>
        <MessagePayload numberOfLines={2} allowFontScaling={false}>
          {'오늘 도착한\n이야기가 없습니다'}
        </MessagePayload>

        <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
      </MessageContainer>

      <Actions>
        <RowContainer style={{position: 'absolute', left: 10}}>
          <Action onPress={() => {}} disabled={true}>
            <ActionIcon
              iconName="heart"
              isClicked={false}
              color={Colors.heart}
            />
            <CommentNum />
          </Action>

          <Action onPress={() => {}} disabled={true}>
            <ActionIcon iconName="chatbubble-ellipses" isClicked={false} />
            <CommentNum>{0}</CommentNum>
          </Action>
        </RowContainer>

        <Container>
          <IndicatorWrapper>
            <Indicator focused={true} />
          </IndicatorWrapper>
          <CommentNum />
        </Container>
      </Actions>
    </Container>
  );
}
