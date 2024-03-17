import React, { useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { findPhotoThemeTodayApi } from "../api/PhotosApi";
import { ROUTE_NAME } from "../Strings";
import PropTypes from "prop-types";
import { Colors } from "../Config";

const RecommendContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  background-color: ${Colors.sub};
`;

const RecommendText = styled.Text`
  flex: 1;
  font-family: "nanum-bold";
`;

export default function PhotoThemeRecommend({ isRecommend, setRecommend }) {
  const navigation = useNavigation();
  const route = useRoute();

  const { data: themeToday, isLoading } = useQuery(
    ["PhotoThemeToday"],
    findPhotoThemeTodayApi
  );

  if (isLoading || !themeToday.data) {
    return <></>;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (route.name === ROUTE_NAME.PHOTO_HOME)
          navigation.navigate(ROUTE_NAME.PHOTO_SELECT, { isRecommend });
      }}
    >
      <RecommendContainer>
        <RecommendText>{`오늘의 주제: ${themeToday?.data.title}`}</RecommendText>
        <TouchableWithoutFeedback onPress={() => setRecommend(false)}>
          <View style={{ padding: 3 }}>
            <Ionicons name="close" />
          </View>
        </TouchableWithoutFeedback>
      </RecommendContainer>
    </TouchableWithoutFeedback>
  );
}

PhotoThemeRecommend.propTypes = {
  isRecommend: PropTypes.bool.isRequired,
  setRecommend: PropTypes.func.isRequired,
};
