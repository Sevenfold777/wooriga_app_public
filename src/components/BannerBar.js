import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";
import { findBannersBarApi } from "../api/BannerApi";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { ROUTE_NAME } from "../Strings";

export default function BannerBar({
  width,
  url,
  payloadType,
  payloadPath,
  description,
}) {
  const navigation = useNavigation();

  const onPress = () => {
    payloadType === "webview"
      ? navigation.navigate(ROUTE_NAME.BANNERS_PAYLOAD, {
          url: payloadPath,
          ...(description && { title: description }),
        })
      : navigation.navigate(payloadPath);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <FastImage
        source={{ uri: url }}
        style={{ width, aspectRatio: 2000 / 414 }}
        resizeMode="cover"
      />
    </TouchableWithoutFeedback>
  );
}

BannerBar.propTypes = {
  width: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  payloadType: PropTypes.string.isRequired,
  payloadPath: PropTypes.string.isRequired,
  description: PropTypes.string,
};
