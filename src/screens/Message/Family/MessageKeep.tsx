/* eslint-disable react-native/no-inline-styles */
import {useQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import {findMessageFamKeptApi} from '../../../api/MessageApi';
import MessageMiddle from '../../../components/message/MessageMiddle';
import NoContent from '../../../components/NoContent';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../../components/common/ScreenLayout';
import {SignedInScreenProps} from '../../../navigators/types';
import {BGColors} from '../../../Config';

const RowWrapper = styled.View`
  margin-bottom: 30px;
`;

const DateText = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
  padding: 15px;
`;

type MessageType = {
  date: string;
  messages: {
    commentsCount: number;
    emotion: keyof typeof BGColors;
    id: number;
    isKept: boolean;
    isMetooed: boolean;
    linkTo: string;
    metoosCount: number;
    payload: string;
    receiveDate: string;
  }[];
};

export default function MessageKeep({}: SignedInScreenProps<'MessageKeep'>) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  const {refetch: refetchMessages} = useQuery(
    ['findFamilyMessageKept', {prev}],
    () => findMessageFamKeptApi({prev}),
    {
      onSuccess: ({data}: {data: MessageType[]}) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);

          // 만약 날짜 같은 것이 추가로 들어오면 date 같은 것은 .messages 배열 이어주기
          const prevTail = messages[messages.length - 1];
          const newHead = data[0];

          if (prevTail?.date === newHead?.date) {
            const messageConcat = {
              date: prevTail.date,
              messages: [...prevTail.messages, ...newHead.messages],
            };

            setMessages([
              ...messages.slice(0, messages.length - 1),
              messageConcat,
              ...data.slice(1),
            ]);
          } else {
            setMessages([...messages, ...data]);
          }
        }

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: queryEnable,
    },
  );

  const now = new Date();

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

  const renderMessages = ({item: messageByDate}: {item: MessageType}) => {
    const dateObj = new Date(messageByDate.date);

    const dateString =
      now.getFullYear() === dateObj.getFullYear()
        ? `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
        : `${dateObj.getFullYear()}년 ${
            dateObj.getMonth() + 1
          }월 ${dateObj.getDate()}일`;

    return (
      <RowWrapper>
        <DateText>{dateString}</DateText>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}>
          {messageByDate.messages.map(message => (
            <MessageMiddle
              key={message.id}
              messageId={message.id}
              payload={message.payload}
              emotion={message.emotion}
            />
          ))}
        </ScrollView>
      </RowWrapper>
    );
  };

  useEffect(() => {
    const keepSubscription = DeviceEventEmitter.addListener(
      'isKept',
      ({id}: {id: number; isKept: boolean}) => {
        const newMessages = messages
          .map(date => {
            const indexToChange = date.messages.findIndex(
              message => message.id === id,
            );

            const newDateMessages = date;

            if (indexToChange !== -1) {
              newDateMessages.messages.splice(indexToChange, 1);
            }

            return newDateMessages;
          })
          .filter(date => date.messages.length !== 0);

        if (!newMessages.length) {
          setIsLast(true);
        }

        setMessages(newMessages);
      },
    );

    return () => keepSubscription.remove();
  }, [messages]);

  if (messages.length === 0 && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        data={messages}
        renderItem={renderMessages}
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
        contentContainerStyle={{minHeight: '100%'}}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <NoContent
            payload={
              '보관한 이야기가 없습니다\n기억하고 싶은 이야기를 보관해보세요'
            }
          />
        )}
      />
      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}
    </ScreenLayout>
  );
}
