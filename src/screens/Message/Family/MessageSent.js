import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import DetailModal, {
  ConfirmModalBtn,
  ConfirmModalContainer,
  ConfirmModalText,
  DetailModalAction,
  DetailModalContainer,
  DetailModalText,
} from "../../../components/DetailModal";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../../components/ScreenLayout";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { deleteMessageApi, findMyMessagesApi } from "../../../api/MessageApi";
import Timer from "../../../components/Timer";
import NoContent from "../../../components/NoContent";
import { ROUTE_NAME } from "../../../Strings";
import { Colors } from "../../../Config";

const MessageContainer = styled.TouchableOpacity`
  padding: 10px;
  border: 1px solid ${Colors.borderLight};
  border-radius: 15px;
  margin: 2px 5px;
`;

const Container = styled.View`
  flex-direction: row;
`;

const DateText = styled.Text`
  padding: 0px 5px;
  font-family: "nanum-bold";
`;

const MessageText = styled.Text`
  flex: 1;
  padding: 5px;
  margin-right: 15px;
  font-family: "nanum-regular";
`;

const Status = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  border-radius: 10px;
  width: 60px;
  height: 35px;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 12px;
  font-family: "nanum-regular";
  /* padding: 10px; */
`;

const TotalCount = styled.Text`
  text-align: center;
  padding: 20px;
  font-family: "nanum-regular";
`;

/// 현재 동일한 사항이 3번 렌더링 되는 문제:

export default function MessageSent({ navigation }) {
  const { height: pageHeight } = useWindowDimensions();

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

  /** react-query */
  // 1. get messages sent
  const {
    data: myMessages,
    // isLoading,
    refetch: refetchMessages,
  } = useQuery(
    ["findMyMessages", { prev }],
    () => findMyMessagesApi({ prev }),
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

  // 2. delete Message
  const deleteMessage = useMutation(deleteMessageApi, {
    onSuccess: async () => {
      setRefreshing(true);

      setMessages([]);
      setPrev(0);
      setQueryEnable(true);
      setIsLast(false);

      await refetchMessages();

      setRefreshing(false);
    },
  });

  const [isDetailModal, setDetailModal] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [detailTarget, setDetailTarget] = useState({}); // {id: number,  payload: string}
  const [needConfirm, setNeedConfirm] = useState(false);
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

  /** 메세지 수정 전송 시, refetch */
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "EditCompleted",
      ({ id, payload, emotion, isNow }) => {
        const indexToChange = messages.findIndex(
          (message) => message.id === id
        );

        const newMessages = messages.map((message, index) => {
          if (index === indexToChange) {
            const newMessage = message;

            newMessage.payload = payload;
            newMessage.emotion = emotion;
            if (isNow) {
              newMessage.uploadAt = new Date().toISOString();
            }

            return newMessage;
          } else {
            return message;
          }
        });

        setMessages(newMessages);
      }
    );

    return () => subscription.remove();
  }, [messages]);

  const renderMessages = ({ item: message }) => {
    const dateObj = new Date(message.createdAt);
    const now = new Date();

    const date =
      now.getFullYear() === dateObj.getFullYear()
        ? `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
        : `${dateObj.getFullYear()}년 ${
            dateObj.getMonth() + 1
          }월 ${dateObj.getDate()}일`;

    const timeUploaded = new Date(message.uploadAt);

    const isSent = timeUploaded < now;

    return (
      <MessageContainer
        key={message.id}
        onPress={() => {
          if (isSent) {
            navigation.navigate(ROUTE_NAME.MESSAGE_FAMILY, {
              messageId: message.messageFamily[0].id,
            });
          } else {
            setDetailModal(true);
            setDetailTarget({
              id: message.id,
              payload: message.payload,
              emotion: message.emotion,
            });
          }
        }}
      >
        {isSent ? (
          <DateText>{date}</DateText>
        ) : (
          <Timer targetTime={timeUploaded} decoratorText="후 도착" />
        )}

        <Container>
          <MessageText numberOfLines={1}>{message.payload}</MessageText>
          <Status>
            <StatusText>{isSent ? "완료" : "전송 중"}</StatusText>
          </Status>
        </Container>
      </MessageContainer>
    );
  };

  const memoized = useMemo(() => renderMessages, [messages]);

  if (messages.length === 0) {
    if (isLast) {
      return (
        <NoContent
          payload={
            "보낸 메세지가 없습니다\n가족에게 솔직한 메세지를 보내보세요"
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

  // console.log(messages.length);@Added For Second Submission

  return (
    <ScreenLayout>
      <FlatList
        data={messages}
        renderItem={memoized}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
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

      <Modal
        isVisible={isDetailModal}
        onBackdropPress={() => {
          setDetailModal(false);
        }}
        onSwipeComplete={() => {
          setDetailModal(false);
        }}
        swipeDirection="down"
        onModalHide={() => setConfirmModal(needConfirm)}
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight}
      >
        <DetailModalContainer>
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <View style={{ position: "absolute" }}>
              <Ionicons name="remove" size={30} />
            </View>
          </View>

          {/** 1. 메세지 수정 */}
          <DetailModalAction
            onPress={() => {
              setDetailModal(false);
              navigation.navigate(ROUTE_NAME.MESSAGE_SEND, {
                payload: detailTarget?.payload,
                edit: true,
                id: detailTarget.id,
                emotion: detailTarget.emotion,
              });
            }}
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: Colors.borderLight,
            }}
          >
            <DetailModalText>{"메세지 수정"}</DetailModalText>
          </DetailModalAction>

          {/** 2. 메세지 전송 취소 */}
          <DetailModalAction
            onPress={() => {
              setDetailModal(false);
              setNeedConfirm(true);
            }}
          >
            <DetailModalText>{"메세지 전송 취소"}</DetailModalText>
          </DetailModalAction>
        </DetailModalContainer>
      </Modal>

      <Modal
        isVisible={isConfirmModal}
        onBackdropPress={() => setConfirmModal(false)}
        onSwipeComplete={() => setConfirmModal(false)}
        onBackButtonPress={() => setConfirmModal(false)}
        swipeDirection="down"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onModalHide={() => setNeedConfirm(false)}
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight}
      >
        <ConfirmModalContainer>
          <View style={{ padding: 30 }}>
            <ConfirmModalText>정말 삭제하시겠습니까?</ConfirmModalText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              borderTopWidth: 0.3,
              borderTopColor: Colors.borderDark,
            }}
          >
            <ConfirmModalBtn
              onPress={() => {
                setConfirmModal(false);
              }}
            >
              <ConfirmModalText>취소</ConfirmModalText>
            </ConfirmModalBtn>
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              onPress={() => {
                deleteMessage.mutate(detailTarget.id);
                setConfirmModal(false);
              }}
            >
              <ConfirmModalText>확인</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ConfirmModalContainer>
      </Modal>
    </ScreenLayout>
  );
}
