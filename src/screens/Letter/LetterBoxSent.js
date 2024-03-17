import React, { useEffect, useState } from "react";
import { Letter, LetterBox } from "../../components/letter/LetterBox";
import ScreenLayout from "../../components/ScreenLayout";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  View,
} from "react-native";
import { findLettersSentApi } from "../../api/LetterApi";
import { useQuery } from "@tanstack/react-query";
import { NoContentContainer, NoContentText } from "../../components/NoContent";
import familyStore from "../../stores/FamilyStore";

export default function LetterBoxSent({ navigation, route }) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-query: get letters */
  const {
    data,
    isLoading: lettersIsLoading,
    refetch: refetchLetters,
  } = useQuery(["LettersSent", { prev }], () => findLettersSentApi({ prev }), {
    onSuccess: ({ data }) => {
      if (data.length === 0) {
        setIsLast(true);
      } else {
        setPrev(prev + 1);
        setLetters([...letters, ...data]);
      }

      setQueryEnable(false);
      setIsLoading(false);
    },
    enabled: queryEnable,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setLetters([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetchLetters();

    setRefreshing(false);
  };

  const renderLetter = ({ item: letter }) => (
    <Letter
      id={letter.id}
      isRead={letter.isRead}
      title={letter.title}
      receiveDate={new Date(letter.receiveDate)}
      target={
        familyStore.members[letter.receiver?.id] || letter.receiver?.userName
      }
      isSent={true}
      isTimeCapsule={letter.isTimeCapsule}
      updatedAt={new Date(letter.updatedAt)}
      isTemp={letter.isTemp}
    />
  );

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener(
      "isDeleted",
      ({ letterId }) => {
        const newLetters = letters.filter((letter) => letterId !== letter.id);
        setLetters(newLetters);
      }
    );

    return () => unsubscribe.remove();
  }, [letters]);

  if (letters.length === 0 && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        data={letters}
        renderItem={renderLetter}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 15 }}
        style={{ marginTop: 15 }}
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
        ListEmptyComponent={() => (
          <NoContentContainer style={{ paddingVertical: 200 }}>
            <NoContentText>
              {"아직 보낸 편지가 없습니다\n가족과 편지를 주고 받아 보세요"}
            </NoContentText>
          </NoContentContainer>
        )}
      />
    </ScreenLayout>
  );
}
