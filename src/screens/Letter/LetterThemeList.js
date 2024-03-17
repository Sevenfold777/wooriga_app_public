import React, { useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { LetterTheme } from "../../components/letter/LetterTheme";
import ScreenLayout from "../../components/ScreenLayout";
import { ActivityIndicator } from "react-native";
import { findLetterThemesApi } from "../../api/LetterApi";
import { useQuery } from "@tanstack/react-query";
import { NoContentContainer, NoContentText } from "../../components/NoContent";

const Wrapper = styled.View`
  margin: 0px 10px;
`;

export default function LetterThemeList({ navigation, route: { params } }) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  const {
    data,
    isLoading: themesLoading,
    refetch: refetchThemes,
  } = useQuery(["themes", prev], () => findLetterThemesApi({ prev }), {
    onSuccess: ({ data }) => {
      if (data.length === 0) {
        setIsLast(true);
      } else {
        setPrev(prev + 1);
        setThemes([...themes, ...data]);
      }

      setQueryEnable(false);
      setIsLoading(false);
    },
    enabled: queryEnable,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setThemes([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetchThemes();

    setRefreshing(false);
  };

  const renderTheme = ({ item: theme }) => (
    <LetterTheme
      id={theme.id}
      title={theme.title}
      hashtags={theme.hashtags}
      isSelect={Boolean(params?.isSelect)}
    />
  );

  if (themes.length === 0 && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        data={themes}
        renderItem={renderTheme}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginHorizontal: 10, paddingBottom: 10 }}
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
            <NoContentText>{"편지 주제를 준비 중입니다"}</NoContentText>
          </NoContentContainer>
        )}
      />
    </ScreenLayout>
  );
}
