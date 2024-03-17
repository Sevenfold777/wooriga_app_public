import styled from "styled-components/native";
import { BGColors, Colors } from "../../Config";
import { AppState, Image } from "react-native";
import assetStore from "../../stores/AssetStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { ROUTE_NAME } from "../../Strings";
import { getLetterNotifApi } from "../../api/LetterApi";
import { useRef } from "react";
import { useEffect } from "react";

const NotifContainer = styled.TouchableOpacity`
  border-top-width: 1px;
  /* border-bottom-width: 1px; */
  border-color: ${Colors.borderLight};
  justify-content: center;
  align-items: center;
  padding: 25px 20px;
  /* margin-bottom: 10px; */
`;

const NotifTextContainer = styled.View`
  width: 280px;
  background-color: ${BGColors.balanceGame};
  padding: 0px 10px;
  border-radius: 10px;
  margin-bottom: 25px;
`;

const NotifText = styled.Text`
  text-align: center;
  font-family: "nanum-regular";
  font-family: "nanum-bold";
  font-size: 15px;
  line-height: 22px;
  padding: 15px;
`;

export default function LetterNotifier({}) {
  const navigation = useNavigation();

  const {
    data: notif,
    isLoading,
    refetch,
  } = useQuery(["LetterHomeNotif"], getLetterNotifApi);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await refetch();
        }

        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <NotifContainer
      onPress={async () => {
        if (!isLoading) {
          [
            ROUTE_NAME.TIME_CAPSULES_SENT,
            ROUTE_NAME.TIME_CAPSULES_RECEIVED,
          ].includes(notif.data.screen)
            ? navigation.navigate(ROUTE_NAME.TIME_CAPSULES_NAV, {
                screen: notif.data.screen,
              })
            : navigation.navigate(
                notif.data.screen,
                notif.data.param && JSON.parse(notif.data.param)
              );

          await refetch();
        }
      }}
    >
      <NotifTextContainer>
        <NotifText allowFontScaling={false}>
          {isLoading ? "" : notif.data.message}
        </NotifText>
      </NotifTextContainer>
      <Image
        source={{ uri: assetStore.activityThumbnails["letter"] }}
        style={{ width: 90, height: 90 }}
        resizeMode="contain"
      />
    </NotifContainer>
  );
}
