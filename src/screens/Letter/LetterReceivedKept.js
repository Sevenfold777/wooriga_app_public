import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Letter } from "../../components/letter/LetterBox";
import ScreenLayout from "../../components/ScreenLayout";
import { findLettersKeptApi } from "../../api/LetterApi";
import familyStore from "../../stores/FamilyStore";
import NoContent from "../../components/NoContent";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, DeviceEventEmitter } from "react-native";
import { FlatList } from "react-native";

const Wrapper = styled.View`
  padding: 5px 12px;
`;

export default function LetterReceivedKept({ navigation, route }) {
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
  } = useQuery(
    ["LettersReceived", { prev }],
    () => findLettersKeptApi({ prev }),
    {
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
    }
  );

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
      target={familyStore.members[letter.sender.id] || letter.sender.userName}
    />
  );

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener(
      "unkeep",
      ({ letterId }) => {
        const newLetters = letters.filter((letter) => letterId !== letter.id);
        if (!newLetters.length) {
          setIsLast(true);
        }
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
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 15,
          minHeight: "100%",
        }}
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
          <NoContent
            payload={
              "보관한 편지가 없습니다\n기억하고 싶은 편지를 보관해보세요"
            }
          />
        )}
      />
    </ScreenLayout>
  );
}
