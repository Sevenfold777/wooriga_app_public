import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled from "styled-components/native";
import { findFamilyEmotionsApi } from "../../api/DailyEmotionApi";
import DailyEmotion, {
  Container,
  Emotion,
  EmotionModalText,
  EmotionModalTextContainer,
  EmotionModalWrapper,
  EmotionOwner,
  EmotionWrapper,
  Header,
  HeaderWrapper,
  ModalContainer,
} from "../../components/DailyEmotion";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../components/ScreenLayout";
import authStore from "../../stores/AuthStore";
import familyStore from "../../stores/FamilyStore";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import { Colors, EMOTION_KOREAN } from "../../Config";
import { FlatList } from "react-native";
import useFamily from "../../hooks/useFamily";
import { findMyFamilyApi } from "../../api/FamilyApi";
import { useWindowDimensions } from "react-native";
import assetStore from "../../stores/AssetStore";
import { ROUTE_NAME } from "../../Strings";
import NoContent from "../../components/NoContent";

function DailyEmotionsPast({ navigation }) {
  const family = Object.keys(familyStore.members).filter(
    (memberId) => parseInt(memberId) !== authStore.userId
  );

  const { width: pageWidth, height: pageHeight } = useWindowDimensions();

  const { data: myFamily, isLoading: familyIsLoading } = useQuery(
    ["MyFamily", true],
    () => findMyFamilyApi(true)
  );

  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [emotions, setEmotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** { date: Date, emotions: {userId: number, type: string}[] } */
  const {
    data: pastEmotions,
    isLoading: emotionsIsLoading,
    refetch: refetchEmotions,
  } = useQuery(
    ["familyEmotionsAll", { prev }],
    () => findFamilyEmotionsApi({ prev }),
    {
      onSuccess: ({ data }) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setEmotions([...emotions, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: queryEnable,
    }
  );

  const [isFamilyModal, setFamilyModal] = useState(false);
  const [familyPressed, setFamilyPressed] = useState({});

  const renderEmotion = ({ id, type, isMe, date }) => {
    return (
      <EmotionWrapper key={id}>
        <TouchableWithoutFeedback
          onPress={() => {
            setFamilyPressed({ id, type, date });
            setFamilyModal(true);
          }}
        >
          <Emotion
            type={assetStore.emotionsRound[type]}
            source={{ uri: assetStore.emotionsRound[type] }}
            pageWidth={pageWidth}
          />
        </TouchableWithoutFeedback>
        <EmotionOwner style={{ maxWidth: (pageWidth - 100) / 4 }}>
          {isMe ? authStore.userName : familyStore.members[id]}
        </EmotionOwner>
      </EmotionWrapper>
    );
  };

  const renderFamilyModal = () => (
    <Modal
      isVisible={isFamilyModal}
      onBackdropPress={() => {
        setFamilyModal(false);
      }}
      onSwipeComplete={() => {
        setFamilyModal(false);
      }}
      onBackButtonPress={() => {
        setFamilyModal(false);
      }}
      swipeDirection="down"
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={pageHeight + StatusBar.currentHeight + 10}
    >
      <ModalContainer>
        <TouchableOpacity
          style={{ position: "absolute", top: 0, right: 0, padding: 10 }}
          onPress={() => setFamilyModal(false)}
        >
          <Ionicons name="close" size={22} color={Colors.borderDark} />
        </TouchableOpacity>

        <EmotionModalWrapper>
          <EmotionWrapper>
            <Emotion
              type={assetStore.emotionsRound[familyPressed?.type]}
              source={{ uri: assetStore.emotionsRound[familyPressed?.type] }}
              pageWidth={pageWidth}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            {familyPressed?.id === authStore.userId ? (
              <EmotionOwner>{authStore.userName}</EmotionOwner>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => {
                  setFamilyModal(false);
                  navigation.navigate(ROUTE_NAME.CHANGE_NICKNAME, {
                    id: familyPressed?.id,
                    name: familyPressed?.userName,
                    nickname: familyStore.members[familyPressed?.id],
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <EmotionOwner>
                    {familyStore.members[familyPressed?.id]}
                  </EmotionOwner>
                </View>
              </TouchableWithoutFeedback>
            )}
          </EmotionWrapper>

          <EmotionModalTextContainer>
            <EmotionModalText>
              {familyPressed?.type === "null"
                ? `${familyPressed?.date}의 감정을 선택하지 않았습니다!`
                : `${familyPressed?.date}의 감정은 ${
                    EMOTION_KOREAN[familyPressed?.type]
                  }입니다!`}
            </EmotionModalText>
          </EmotionModalTextContainer>
        </EmotionModalWrapper>
      </ModalContainer>
    </Modal>
  );

  const renderEmotions = ({ item: emotion }) => {
    const dateObj = new Date(emotion.date);
    const now = new Date();

    const date =
      now.getFullYear() === dateObj.getFullYear()
        ? `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
        : `${dateObj.getFullYear()}년 ${
            dateObj.getMonth() + 1
          }월 ${dateObj.getDate()}일`;

    const meFound = emotion.emotions.find(
      (member) => authStore.userId === member.userId
    );

    const myEmotion = meFound
      ? renderEmotion({
          id: authStore.userId,
          type: meFound.type,
          isMe: true,
          date,
        })
      : renderEmotion({ id: authStore.userId, type: "null", isMe: true, date });

    return (
      <Container key={emotion.date}>
        <HeaderWrapper>
          <Header>{`${date}`}</Header>
        </HeaderWrapper>
        <ScrollView
          style={{ paddingVertical: 5 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ alignItems: "flex-start" }}
        >
          {myEmotion}

          {family.map((memberId) => {
            const userFound = emotion.emotions.find(
              (member) => memberId === member.userId.toString()
            );

            const result = userFound
              ? renderEmotion({ id: memberId, type: userFound.type, date })
              : renderEmotion({ id: memberId, type: "null", date });

            return result;
          })}
        </ScrollView>
      </Container>
    );
  };

  const memoized = useMemo(() => renderEmotions, [emotions]);

  if ((emotions.length === 0 || familyIsLoading) && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        data={emotions}
        renderItem={memoized}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!isLast && !isLoading) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.01}
        scrollEnabled={!isLoading}
        ListHeaderComponent={() => <DailyEmotion />}
      />
      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}

      {renderFamilyModal()}
    </ScreenLayout>
  );
}

export default observer(DailyEmotionsPast);
