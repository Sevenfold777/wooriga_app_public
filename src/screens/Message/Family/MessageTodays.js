import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  deleteKeepMessageFamApi,
  deleteMetooMessageFamApi,
  findMessageFamilyTodayAllApi,
  keepMessageFamApi,
  metooMessageFamApi,
} from "../../../api/MessageApi";
import Message from "../../../components/message/Message";
import NoContent from "../../../components/NoContent";

import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../../components/ScreenLayout";
import Toast from "../../../components/Toast";
import { MessageWrapper } from "./MessagesPast";

export default function MessageTodays({}) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-query: get messages */
  const {
    data,
    // isLoading,
    refetch: refetchMessages,
  } = useQuery(
    ["MessageTodays", { prev }],
    () => findMessageFamilyTodayAllApi({ prev }),
    {
      onSuccess: ({ data }) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setMessages([...messages, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: queryEnable,
    }
  );

  // 5-1. metoo Message
  const metooMessage = useMutation(metooMessageFamApi);

  // 5-2. quit metoo Message
  const deleteMetooMessage = useMutation(deleteMetooMessageFamApi);

  /** function: toggle metoo */
  const toggleMetoo = (id, isMetoo) => {
    isMetoo ? deleteMetooMessage.mutate(id) : metooMessage.mutate(id);
    // metoo ? setMetoosCnt(metoosCnt - 1) : setMetoosCnt(metoosCnt + 1);
    // setMetoo(!metoo);
  };

  // 5-1. keep Message
  const keepMessage = useMutation(keepMessageFamApi);

  // 5-2. quit keep Message
  const deleteKeepMessage = useMutation(deleteKeepMessageFamApi);

  // /** function: toggle keep */
  const toggleKeep = (id, isKept) => {
    isKept ? deleteKeepMessage.mutate(id) : keepMessage.mutate(id);
    // setKept(!kept);
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setMessages([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetchMessages();

    setRefreshing(false);
  };

  const renderMessages = ({ item: message }) => (
    <MessageWrapper>
      <Message
        id={message.id}
        payload={message.payload}
        emotion={message.emotion}
        commentsCount={message.commentsCount}
        metoosCount={message.metoosCount}
        isMetoo={message.isMetooed}
        isKept={message.isKept}
        toggleMetoo={toggleMetoo}
        toggleKeep={toggleKeep}
      />
    </MessageWrapper>
  );

  /** 메세지 수정 전송 시, refetch */
  useEffect(() => {
    const metooSubscription = DeviceEventEmitter.addListener(
      "isMetooed",
      ({ id, isMetoo, metoosCount }) => {
        const indexToChange = messages.findIndex(
          (message) => message.id === id
        );

        // console.log(id, isMetoo, metoosCount);
        const newMessages = messages.map((message, index) => {
          if (index === indexToChange) {
            const newMessage = message;
            newMessage.metoosCount = metoosCount;
            newMessage.isMetooed = isMetoo;

            return newMessage;
          } else {
            return message;
          }
        });

        setMessages(newMessages);
      }
    );

    return () => metooSubscription.remove();
  }, [messages]);

  useEffect(() => {
    const keepSubscription = DeviceEventEmitter.addListener(
      "isKept",
      ({ id, isKept }) => {
        const indexToChange = messages.findIndex(
          (message) => message.id === id
        );

        // console.log(messages, id, isMetoo, indexToChange);
        const newMessages = messages.map((message, index) => {
          if (index === indexToChange) {
            const newMessage = message;

            newMessage.isKept = isKept;

            return message;
          } else {
            return message;
          }
        });

        setMessages(newMessages);
      }
    );

    return () => keepSubscription.remove();
  }, [messages]);

  useEffect(() => {
    const commentsSubscription = DeviceEventEmitter.addListener(
      "commented",
      ({ id, commentsCount }) => {
        const indexToChange = messages.findIndex(
          (message) => message.id === id
        );

        const newMessages = messages.map((message, index) => {
          if (index === indexToChange) {
            const newMessage = message;

            newMessage.commentsCount = commentsCount;

            return newMessage;
          } else {
            return message;
          }
        });

        setMessages(newMessages);
      }
    );

    return () => commentsSubscription.remove();
  }, [messages]);

  const memoized = useMemo(() => renderMessages, [messages]);

  if (messages.length === 0) {
    if (isLast) {
      return (
        <NoContent
          payload={
            "오늘의 메세지가 없습니다\n가족에게 하고 싶은 말을 전달해보세요"
          }
        />
      );
    }
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  // console.log(messages.length);

  return (
    <ScreenLayout>
      <FlatList
        data={messages}
        renderItem={memoized}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!isLast && !isLoading) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.01}
        scrollEnabled={!isLoading}
      />
      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}
    </ScreenLayout>
  );
}
