import { useRoute } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { ROUTE_NAME } from "../Strings";
import PropTypes from "prop-types";

export const ActivityIndicatorWrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
`;

export default function ScreenLayout({ children, safeAreaColor }) {
  const TabNavRoutes = [
    ROUTE_NAME.PHOTO_HOME,
    ROUTE_NAME.MESSAGE_HOME,
    ROUTE_NAME.MYPAGE_NAV,
    ROUTE_NAME.LETTER_HOME,
    ROUTE_NAME.FAMILYPEDIA_HOME,
  ];
  const route = useRoute();

  if (TabNavRoutes.includes(route.name)) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>{children}</View>
    );
  }

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: safeAreaColor || "white" }}
    >
      {children}
    </SafeAreaView>
  );
}

ScreenLayout.propTypes = {
  safeAreaColor: PropTypes.string,
};
