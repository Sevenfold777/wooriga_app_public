import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  DeviceEventEmitter,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { METHOD, _promise } from "../../api/ApiConfig";
import authStore from "../../stores/AuthStore";
import Message from "../message/Message";
import PropTypes from "prop-types";
import MessageSmall from "../message/MessageSmall";
import { ROUTE_NAME } from "../../Strings";

const BoardContainer = styled.View`
  padding: 15px 10px;
  /* margin-bottom: 20px; */
`;

const BoardTitleWrapper = styled.TouchableWithoutFeedback``;

const BoardTitle = styled.Text`
  padding: 5px 10px;
  font-size: 16px;
  font-family: "nanum-bold";
`;

const BoardItems = styled.View`
  padding: 10px 0px;
`;

export default function Board({ id, title, url, orderBy }) {
  const [messages, setMessages] = useState([]);

  /** react-query */
  const {
    data: boardItems,
    isLoading,
    refetch: refetchBoard,
  } = useQuery(
    ["board", url],
    () => _promise(METHOD.GET, `${url}${url.includes("?") ? "&" : "?"}limit=5`),
    {
      onSuccess: ({ data }) => {
        setMessages(data);
      },
    }
  );

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await refetchBoard();
        }

        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener(
      "MessageSentToFamily",
      ({ messageId, sharedCount }) => {
        const indexToChange = boardItems?.data.findIndex(
          (message) => message.id === messageId
        );

        if (indexToChange !== -1) {
          const newMessages = messages.map((message, index) => {
            if (index === indexToChange) {
              const newMessage = message;

              newMessage.sharedCount = sharedCount;

              return newMessage;
            } else {
              return message;
            }
          });

          setMessages(newMessages);
        }
      }
    );

    return () => unsubscribe.remove();
  }, [messages]);

  /** navigation */
  const navigation = useNavigation();

  return (
    <BoardContainer key={id}>
      <BoardTitleWrapper
        onPress={() =>
          navigation.navigate(ROUTE_NAME.MESSAGE_BOARD, {
            id,
            url,
            title: orderBy === "recommend" ? authStore.userName + title : title,
          })
        }
      >
        <BoardTitle>
          {orderBy === "recommend" ? authStore.userName + title : title}
        </BoardTitle>
      </BoardTitleWrapper>
      <BoardItems>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {messages.map((message) => (
              <MessageSmall
                key={message.id}
                messageId={message.id}
                payload={message.payload}
                emotion={message.emotion}
                sharedCount={message.sharedCount}
              />
            ))}
          </ScrollView>
        )}
      </BoardItems>
    </BoardContainer>
  );
}

Board.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};
