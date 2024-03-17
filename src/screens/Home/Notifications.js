import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import {
  ConfirmModalBtn,
  ConfirmModalContainer,
  ConfirmModalText,
  DetailModalAction,
  DetailModalContainer,
  DetailModalText,
} from "../../components/DetailModal";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../components/ScreenLayout";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import NoContent from "../../components/NoContent";
import {
  deleteNotificationApi,
  findReceivedNotificationsApi,
} from "../../api/NotificationApi";
import { timeFormatter } from "../../components/Comment";
import { Colors } from "../../Config";
import { METHOD, _promise } from "../../api/ApiConfig";

const NoticationsContainer = styled.TouchableOpacity`
  padding: 10px;
  border: 1px solid ${Colors.borderLight};
  border-radius: 15px;
  margin: 2px 5px;
`;

const Container = styled.View`
  align-items: center;
  flex-direction: row;
`;

const DateText = styled.Text`
  flex: 1;
  padding: 5px 5px 0px 5px;
  font-family: "nanum-bold";
`;

const NoticationsText = styled.Text`
  flex: 1;
  padding: 5px;
  margin-right: 15px;
  font-family: "nanum-regular";
`;

const DetailBtn = styled.TouchableOpacity`
  padding: 5px;
  justify-content: center;
  align-items: center;
`;

const TimeWritten = styled.Text`
  padding: 0px 5px;
  font-size: 10px;
  font-family: "nanum-regular";
`;

/// 현재 동일한 사항이 3번 렌더링 되는 문제:

export default function Notifications({ navigation }) {
  const { height: pageHeight } = useWindowDimensions();

  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-query */
  // 1. get Noticationss sent
  const {
    data: notifs,
    // isLoading,
    refetch: refetchNotications,
  } = useQuery(
    ["ReceivedNotifications", { prev }],
    () => findReceivedNotificationsApi({ prev }),
    {
      onSuccess: ({ data }) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setNotifications([...notifications, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },

      enabled: queryEnable,
    }
  );

  // 2. delete Noticationss
  const deleteNotications = useMutation(deleteNotificationApi, {
    onSuccess: async () => {
      setRefreshing(true);

      setNotifications([]);
      setPrev(0);
      setQueryEnable(true);
      setIsLast(false);

      await refetchNotications();

      setRefreshing(false);
    },
  });

  const [isDetailModal, setDetailModal] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [detailTarget, setDetailTarget] = useState(); // id: number
  const [needConfirm, setNeedConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setNotifications([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetchNotications();
    setRefreshing(false);
  };

  const renderNotifications = ({ item: notification }) => {
    // const dateObj = new Date(notification.createdAt);
    // const now = new Date();

    // const date =
    //   now.getFullYear() === dateObj.getFullYear()
    //     ? `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
    //     : `${dateObj.getFullYear()}년 ${
    //         dateObj.getMonth() + 1
    //       }월 ${dateObj.getDate()}일`;
    const formattedTime = timeFormatter(notification.createdAt);

    const screen = notification.screen;
    const param = notification.param;

    return (
      <NoticationsContainer
        key={notifications.id}
        onPress={async () => {
          if (Boolean(screen)) {
            navigation.navigate(screen, param && { ...JSON.parse(param) });
          }
        }}
      >
        <Container>
          <DateText>{notification.title}</DateText>
          <TimeWritten>{formattedTime}</TimeWritten>
        </Container>
        <Container>
          <NoticationsText numberOfLines={1}>
            {notification.body}
          </NoticationsText>
          <DetailBtn
            onPress={() => {
              setDetailTarget(notification.id);
              setDetailModal(true);
            }}
          >
            <Ionicons name="ellipsis-vertical" size={14} />
          </DetailBtn>
        </Container>
      </NoticationsContainer>
    );
  };

  const memoized = useMemo(() => renderNotifications, [notifications]);

  if (notifications.length === 0) {
    if (isLast) {
      return <NoContent payload={"도착한 알림이 없습니다"} />;
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
        // data={myNoticationss?.data}
        data={notifications}
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
        style={{ height: "100%" }}
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
          <View style={{ alignItems: "center" }}>
            <Ionicons name="remove" size={30} />
          </View>

          {/** 2. 메세지 전송 취소 */}
          <DetailModalAction
            onPress={() => {
              setDetailModal(false);
              setNeedConfirm(true);
            }}
          >
            <DetailModalText>{"알림 삭제"}</DetailModalText>
          </DetailModalAction>
        </DetailModalContainer>
      </Modal>

      <Modal
        isVisible={isConfirmModal}
        // onBackdropPress={() => setConfirmModal(false)}
        // onSwipeComplete={() => setConfirmModal(false)}
        // swipeDirection="down"

        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onModalHide={() => setNeedConfirm(false)}
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight}
      >
        <ConfirmModalContainer>
          <ConfirmModalText style={{ padding: 20 }}>
            정말 삭제하시겠습니까?
          </ConfirmModalText>
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
                deleteNotications.mutate({ id: detailTarget });
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
