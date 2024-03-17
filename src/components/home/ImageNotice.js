import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { Indicator, IndicatorWrapper } from "../CarouselIndicator";
import PropTypes from "prop-types";
import { ROUTE_NAME } from "../../Strings";
import { Colors } from "../../Config";

const Container = styled.View`
  width: 100%;
  margin-bottom: 0px;
`;

export default function ImageNotice({ banners }) {
  const homeBanners = [...banners, banners[0]];
  /** Navigation */
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  /** auto scoll */
  const scrollViewRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // 5초마다 다음으로 scroll
    const timeout = setTimeout(() => {
      const nextPage = (currentPage + 1) % homeBanners.length;

      scrollViewRef.current?.scrollTo({
        x: width * nextPage,
        animated: true,
      });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [currentPage]);
  // console.log(new Date().toLocaleTimeString(), currentPage); // for debug

  return (
    <Container>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        ref={scrollViewRef}
        scrollEventThrottle={0}
        onScroll={(e) => {
          const newPage = parseInt(
            parseInt(e.nativeEvent.contentOffset.x) / parseInt(width)
          );

          if (newPage === homeBanners.length - 1) {
            scrollViewRef.current?.scrollTo({
              x: 0,
              animated: false,
            });
            setCurrentPage(0);
          } else if (newPage !== currentPage) {
            setCurrentPage(newPage);
          }
        }}
      >
        {homeBanners.map((banner, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => {
              banner.payloadType === "webview"
                ? navigation.navigate(ROUTE_NAME.BANNERS_PAYLOAD, {
                    url: banner.payloadPath,
                    title: banner.description,
                  })
                : navigation.navigate(banner.payloadPath);
            }}
          >
            <FastImage
              source={{ uri: banner.url }}
              style={{
                width: width - 40 + 40,
                backgroundColor: Colors.borderLight,
                aspectRatio: 393 / 210,
              }}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
      <View
        style={{
          padding: 7,
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <IndicatorWrapper>
          {[...Array(homeBanners.length - 1).keys()].map((page, index) => (
            <Indicator key={index} focused={index === currentPage} />
          ))}
        </IndicatorWrapper>
      </View>
    </Container>
  );
}

ImageNotice.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      description: PropTypes.string,
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      payloadType: PropTypes.string.isRequired,
      payloadPath: PropTypes.string.isRequired,
    })
  ),
};
