import {useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {findFamilyMessagesApi} from '../../../api/MessageApi';
import HomeMessage from '../../../components/message/MessageSmall';
import Message from '../../../components/message/Message';
import MessageMiddle from '../../../components/message/MessageMiddle';
import NoContent from '../../../components/NoContent';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../../components/ScreenLayout';
import Toast from '../../../components/Toast';
import {SignedInScreenProps} from '../../../navigators/types';

export const MessageWrapper = styled.View`
  margin-bottom: 0px;
`;

const DateText = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
  padding: 15px;
`;

export default function MessagePast({}: SignedInScreenProps<'MessagePast'>) {
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

  const {
    data,
    // isLoading,
    refetch: refetchMessages,
  } = useQuery(
    ['findFamilyMessages', {prev}],
    () => findFamilyMessagesApi({prev}),
    {
      onSuccess: ({data}) => {
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

            // console.log(messages.map((message) => message.receiveAt));
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

  const renderMessages = ({item: messageByDate}) => {
    const dateObj = new Date(messageByDate.date);

    const dateString =
      now.getFullYear() === dateObj.getFullYear()
        ? `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
        : `${dateObj.getFullYear()}년 ${
            dateObj.getMonth() + 1
          }월 ${dateObj.getDate()}일`;

    return (
      <View
        style={{
          marginBottom: 30,
        }}>
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
      </View>
    );
  };

  if (messages.length === 0) {
    if (isLast) {
      return (
        <NoContent
          payload={
            '지난 메세지가 없습니다\n가족에게 가족에게 마음을 전달해보세요'
          }
        />
      );
    } else {
      return (
        <ScreenLayout>
          <ActivityIndicator />
        </ScreenLayout>
      );
    }
  }

  return (
    <ScreenLayout>
      <FlatList
        data={messages}
        renderItem={renderMessages}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        onEndReached={({distanceFromEnd}) => {
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
