import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import ActionIcon from "./ActionIcon";
import DismissKeyboard from "../DismissKeyboard";
import assetStore from "../../stores/AssetStore";
import PropTypes from "prop-types";
import {
  DeviceEventEmitter,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import authStore from "../../stores/AuthStore";
import { Image } from "react-native";
import { BGColors, BottomPhrases, Colors, EMOTIONS_NOBACK } from "../../Config";

import { Ionicons } from "@expo/vector-icons";

import { Indicator, IndicatorWrapper } from "../CarouselIndicator";
import PagerView from "react-native-pager-view";
import PaginationDot from "react-native-animated-pagination-dot";
import { ROUTE_NAME } from "../../Strings";

/** styled-components */
export const Container = styled.View``;

export const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  aspect-ratio: ${4 / 3};
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
  font-family: "kangwon-font";
`;

export const PromotePayload = styled.Text`
  font-family: "nanum-regular";
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
  padding: 0 10px;
`;

export const Action = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const CommentNum = styled.Text`
  font-family: "nanum-regular";
  font-size: 12px;
`;

export const SharedCountContainer = styled.View`
  flex-direction: row;
  /* position: absolute;
  right: 5px;
  top: 5px; */
  justify-content: center;
  align-items: center;
  background-color: rgba(1, 1, 1, 0.2);
  padding: 5px 20px;
  border-radius: 7px;
`;

export const SharedCountText = styled.Text`
  margin-left: 3px;
  font-family: "nanum-regular";
  font-size: 13px;
  color: white;
`;

export default function Message({
  id,
  payload,
  emotion,
  commentsCount,
  metoosCount,
  isMetoo,
  isKept,
  toggleMetoo,
  toggleKeep,
  onLastPage = () => {},
}) {
  const pagerRef = useRef();

  const [kept, setKept] = useState(isKept);
  const [metoo, setMetoo] = useState(isMetoo);
  const [commentsCnt, setCommentsCnt] = useState(commentsCount);
  const [metoosCnt, setMetoosCnt] = useState(metoosCount);

  useEffect(() => {
    setCommentsCnt(commentsCount);
    setMetoosCnt(metoosCount);
    setMetoo(isMetoo);
    setKept(isKept);
  }, [commentsCount, metoosCount, isMetoo, isKept]);

  const navigation = useNavigation();
  const route = useRoute();

  /** for scrollable multi page Messages */
  const { width: pageWidth } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);

  // format Message
  const messageLines = payload.split(/\n/g);
  const messageByPage = [];
  messageLines.forEach((line, index) => {
    if (index % 2 === 0) {
      messageLines[index + 1]
        ? messageByPage.push(
            messageLines[index].concat("\n", messageLines[index + 1])
          )
        : messageByPage.push(messageLines[index]);
    }
  });

  const renderMessage = ({ payload, emotion }) => (
    <MessageContainer
      style={{ width: pageWidth, backgroundColor: BGColors[emotion] }}
    >
      <MessageBackground>
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            paddingTop: 60,
          }}
        >
          <View style={{ flex: 2 }}>
            <Image
              source={{
                uri: assetStore.messageEmotions[emotion],
              }}
              resizeMode="contain"
              style={{
                width: 50,
                height: 50,
                margin: 12,
              }}
            />
          </View>

          <View style={{ flex: 5 }}>
            <MessagePayload numberOfLines={2} allowFontScaling={false}>
              {payload}
            </MessagePayload>
          </View>

          <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
        </View>
      </MessageBackground>
    </MessageContainer>
  );

  useEffect(() => {
    pagerRef?.current.setPageWithoutAnimation(0);
  }, [id]);

  useEffect(() => {
    if (route.name === ROUTE_NAME.MESSAGE_FAMILY) {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (isKept !== kept) {
          toggleKeep(id, !kept);
          DeviceEventEmitter.emit("isKept", { id, isKept: !kept });
        }
      });

      return unsubscribe;
    }
  }, [navigation, kept]);

  return (
    <Container>
      <View style={{ width: pageWidth, aspectRatio: 4 / 3 }}>
        <PagerView
          initialPage={0}
          style={{ flex: 1 }}
          onPageSelected={(e) => {
            setCurrentPage(e.nativeEvent.position);

            if (e.nativeEvent.position === messageByPage.length - 1) {
              onLastPage();
            }
          }}
          ref={pagerRef}
        >
          {messageByPage.map((message, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                if (
                  [
                    ROUTE_NAME.MESSAGE_HOME,
                    ROUTE_NAME.MESSAGES_PAST,
                    ROUTE_NAME.MESSAGE_TODAYS,
                  ].includes(route.name)
                ) {
                  navigation.navigate(ROUTE_NAME.MESSAGE_FAMILY, {
                    messageId: id,
                  });
                } else if ([ROUTE_NAME.MESSAGE_BOARD].includes(route.name)) {
                  navigation.navigate(ROUTE_NAME.MESSAGE_PUBLIC, {
                    messageId: id,
                  });
                } else {
                  Keyboard.dismiss();
                }
              }}
            >
              {renderMessage({ payload: message, emotion })}
            </TouchableWithoutFeedback>
          ))}
        </PagerView>
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Actions
          style={{
            borderBottomColor: "#aeaeae",
            borderBottomWidth: 0.3,
          }}
        >
          <View
            style={{ flexDirection: "row", position: "absolute", left: 10 }}
          >
            <Action
              onPress={() => {
                const newMetoosCnt = metoo ? metoosCnt - 1 : metoosCnt + 1;
                toggleMetoo(id, metoo, newMetoosCnt);

                setMetoosCnt(newMetoosCnt);
                setMetoo(!metoo);
              }}
            >
              <ActionIcon
                iconName="heart"
                isClicked={metoo}
                color={Colors.heart}
              />
              <CommentNum>{metoosCnt}</CommentNum>
            </Action>

            <Action
              onPress={() => {
                if (
                  [
                    ROUTE_NAME.MESSAGE_HOME,
                    ROUTE_NAME.MESSAGES_PAST,
                    ROUTE_NAME.MESSAGE_TODAYS,
                  ].includes(route.name)
                ) {
                  navigation.navigate(ROUTE_NAME.MESSAGE_FAMILY, {
                    messageId: id,
                  });
                } else if ([ROUTE_NAME.MESSAGE_BOARD].includes(route.name)) {
                  navigation.navigate(ROUTE_NAME.MESSAGE_PUBLIC, {
                    messageId: id,
                  });
                }
              }}
              disabled={route.name === ROUTE_NAME.MESSAGE_FAMILY}
            >
              <ActionIcon iconName="chatbubble-ellipses" isClicked={false} />
              <CommentNum>{commentsCnt}</CommentNum>
            </Action>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IndicatorWrapper>
              <PaginationDot
                activeDotColor="#262626"
                curPage={currentPage}
                maxPage={messageByPage.length}
              />
            </IndicatorWrapper>
            <CommentNum></CommentNum>
          </View>

          <Action
            onPress={() => {
              if (route.name === ROUTE_NAME.MESSAGE_HOME) {
                toggleKeep(id, kept);
              }
              setKept(!kept);
            }}
            style={{ alignItems: "flex-end", position: "absolute", right: 10 }}
          >
            <ActionIcon
              iconName="bookmark"
              isClicked={kept}
              color={Colors.main}
            />
          </Action>
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
  metoosCount: PropTypes.number.isRequired,
  isMetoo: PropTypes.bool.isRequired,
  isKept: PropTypes.bool.isRequired,
  toggleMetoo: PropTypes.func.isRequired,
  toggleKeep: PropTypes.func.isRequired,
  onLastPage: PropTypes.func,
};
