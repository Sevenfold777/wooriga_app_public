import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import ActionIcon from './ActionIcon';
import assetStore from '../../stores/AssetStore';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BGColors, BottomPhrases, Colors} from '../../Config';
import {IndicatorWrapper} from '../CarouselIndicator';
import PagerView from 'react-native-pager-view';
import PaginationDot from 'react-native-animated-pagination-dot';
import {RowContainer} from '../Common';

/** styled-components */
export const Container = styled.View``;

export const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  aspect-ratio: ${4 / 3};
  padding-top: 60px;
`;

export const MessageBackground = styled.ImageBackground`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  //padding: 40% 0;
`;

export const MessagePayload = styled.Text`
  text-align: center;
  font-size: 28px;
  font-family: 'kangwon-font';
`;

export const PromotePayload = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.6;
`;

export const Actions = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
  border-bottom-color: ${Colors.borderDark};
  border-bottom-width: 0.3px;
`;

export const Action = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const CommentNum = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
`;

export const EmotionWrapper = styled.View`
  flex: 2;
`;

export const PayloadWrapper = styled.View`
  flex: 5;
`;

export const Emotion = styled.Image`
  width: 50px;
  height: 50px;
  margin: 12px;
`;

export const SpringBtn = styled.TouchableOpacity`
  background-color: ${Colors.main};
  padding: 10px;
  margin: 0px 15px;
  border-radius: 10px;
`;

export const SpringBtnText = styled.Text`
  font-family: 'nanum-regular';
  color: white;
`;

type Props = {
  id: number;
  payload: string;
  emotion: keyof typeof BGColors;
  commentsCount: number;
  isKept: boolean;
  toggleKeep: (id: number, kept: boolean) => void;
  onLastPage: () => void;
};

export default function Message({
  id,
  payload,
  emotion,
  commentsCount,
  isKept,
  toggleKeep,
  onLastPage = () => {},
}: Props) {
  const pagerRef = useRef<PagerView>(null);
  useEffect(() => {
    // when refetch
    pagerRef?.current?.setPageWithoutAnimation(0);
  }, [id]);

  /** for scrollable multi page Messages */
  const {width: pageWidth} = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);

  /** navigation and route */
  const navigation = useNavigation();
  const route = useRoute();

  const [kept, setKept] = useState(isKept);
  const [commentsCnt, setCommentsCnt] = useState(commentsCount);

  useEffect(() => {
    setCommentsCnt(commentsCount);

    setKept(isKept);
  }, [commentsCount, isKept]);

  /** format message payload */
  const messageLines = payload.split(/\n/g);
  const messageByPage: string[] = [];
  messageLines.forEach((line: string, index: number) => {
    if (index % 2 === 0) {
      messageLines[index + 1]
        ? messageByPage.push(
            messageLines[index].concat('\n', messageLines[index + 1]),
          )
        : messageByPage.push(messageLines[index]);
    }
  });

  /** render each page */
  const renderMessage = ({
    payload,
    emotion,
  }: {
    payload: string;
    emotion: keyof typeof BGColors;
  }) => (
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
          {payload}
        </MessagePayload>
      </PayloadWrapper>

      <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
    </MessageContainer>
  );

  useEffect(() => {
    if (route.name === 'MessageFamily') {
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        if (isKept !== kept) {
          toggleKeep(id, !kept);
          DeviceEventEmitter.emit('isKept', {id, isKept: !kept});
        }
      });

      return unsubscribe;
    }
  }, [navigation, kept]);

  return (
    <Container>
      <View style={{width: pageWidth, aspectRatio: 4 / 3}}>
        <PagerView
          initialPage={0}
          style={{flex: 1}}
          onPageSelected={e => {
            setCurrentPage(e.nativeEvent.position);

            if (e.nativeEvent.position === messageByPage.length - 1) {
              onLastPage();
            }
          }}
          ref={pagerRef}>
          {messageByPage.map((message, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() =>
                route.name === 'MessageHome'
                  ? navigation.navigate('MessageFamily', {messageId: id})
                  : Keyboard.dismiss()
              }>
              {renderMessage({payload: message, emotion})}
            </TouchableWithoutFeedback>
          ))}
        </PagerView>
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Actions>
          <RowContainer style={{position: 'absolute', left: 10}}>
            <Action
              onPress={() => {
                toggleKeep(id, kept);
                setKept(!kept);
              }}>
              <ActionIcon
                iconName="heart"
                isClicked={kept}
                color={Colors.heart}
              />
              <CommentNum />
            </Action>

            <Action
              onPress={() =>
                navigation.navigate('MessageFamily', {messageId: id})
              }
              disabled={route.name !== 'MessageHome'}>
              <ActionIcon iconName="chatbubble-ellipses" isClicked={false} />
              <CommentNum>{commentsCnt}</CommentNum>
            </Action>
          </RowContainer>

          <Container>
            <IndicatorWrapper>
              <PaginationDot
                activeDotColor="#262626"
                curPage={currentPage}
                maxPage={messageByPage.length}
              />
            </IndicatorWrapper>
            <CommentNum />
          </Container>
        </Actions>
      </TouchableWithoutFeedback>
    </Container>
  );
}

Message.propTypes = {
  id: PropTypes.number.isRequired,
  payload: PropTypes.string.isRequired,
  emotion: PropTypes.string.isRequired,
  commentsCount: PropTypes.number.isRequired,
  isKept: PropTypes.bool.isRequired,
  toggleKeep: PropTypes.func.isRequired,
  onLastPage: PropTypes.func,
};
