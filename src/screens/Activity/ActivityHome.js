import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, AppState, useWindowDimensions } from "react-native";
import { Image } from "react-native";
import styled from "styled-components/native";
import { findBalanceGameRecommendedApi } from "../../api/BalanceGameApi";
import ScreenLayout from "../../components/ScreenLayout";
import { Colors } from "../../Config";
import assetStore from "../../stores/AssetStore";
import balanceGameStore from "../../stores/BalanceGameStore";
import { ROUTE_NAME } from "../../Strings";

const ActivityContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  /* align-items: center; */
  padding: 10px 0px;
  margin: 0px 10px 10px 10px;
  background-color: ${Colors.sub};
  border-radius: 5px;
`;

const Column = styled.View`
  padding: 10px 20px;
`;

const ActivityTitle = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
  padding: 5px 0px;
`;

const ActivitySubtitle = styled.Text`
  font-family: "nanum-regular";
  padding: 0px 5px;
`;

const ActivityThumbnail = styled.Image`
  width: 70px;
  height: 70px;
`;

export default function ActivityHome({ navigation }) {
  const { width: pageWidth } = useWindowDimensions();

  const {
    data: game,
    isLoading: balanceGameLoading,
    refetch: refetchBalanceGame,
  } = useQuery(["BalanceGameRecommend"], findBalanceGameRecommendedApi, {
    onSuccess: (data) => {
      balanceGameStore.clearGameList();
      balanceGameStore.setGameList({ games: data?.data });
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      balanceGameStore.clearGameList(); // remove prev
      await refetchBalanceGame();
    });

    return unsubscribe;
  }, [navigation]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          balanceGameStore.clearGameList();
          await refetchBalanceGame();
        }

        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, []);

  if (balanceGameLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ActivityContainer
        onPress={() => navigation.navigate(ROUTE_NAME.FAMILYPEDIA_HOME)}
      >
        <Column style={{ flex: 1 }}>
          <ActivityTitle>우리 가족 인물사전</ActivityTitle>
          <ActivitySubtitle>그동안 몰랐던 우리 가족에 대하여</ActivitySubtitle>
        </Column>

        <Column>
          <ActivityThumbnail
            source={{ uri: assetStore.activityThumbnails["familyPedia"] }}
            resizeMode="contain"
          />
        </Column>
      </ActivityContainer>

      <ActivityContainer
        onPress={() => {
          navigation.navigate(ROUTE_NAME.BALANCEGAME_MAIN, {
            currentIndex: balanceGameStore.currentGameIndex,
          });
        }}
      >
        <Column style={{ flex: 1 }}>
          <ActivityTitle>밸런스 게임</ActivityTitle>
          <ActivitySubtitle>우리 가족은 어떻게 생각할까</ActivitySubtitle>
        </Column>

        <Column>
          <ActivityThumbnail
            source={{ uri: assetStore.activityThumbnails["balanceGame"] }}
            resizeMode="contain"
          />
        </Column>
      </ActivityContainer>

      {/* <ActivityContainer>
        <ActivityTitle>홈BTI</ActivityTitle>
        <ActivitySubtitle>
          우리 가족의 MBTI는? 우리의 조합은 어떨까!
        </ActivitySubtitle>
      </ActivityContainer> */}
    </ScreenLayout>
  );
}
