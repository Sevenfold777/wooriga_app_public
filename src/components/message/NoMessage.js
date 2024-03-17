import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View } from "react-native";
import { TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { BGColors, BottomPhrases, Colors } from "../../Config";
import assetStore from "../../stores/AssetStore";
import { ROUTE_NAME } from "../../Strings";
import { Indicator, IndicatorWrapper } from "../CarouselIndicator";
import ActionIcon from "./ActionIcon";

const Container = styled.View``;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  aspect-ratio: ${4 / 3};
`;

const MessageBackground = styled.ImageBackground`
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 5;
  //padding: 40% 0;
`;

const MessagePayload = styled.Text`
  text-align: center;
  font-size: 28px;
  font-family: "kangwon-font";
`;

const PromotePayload = styled.Text`
  font-family: "nanum-regular";
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.6;
`;

const Actions = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
`;

const Action = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const CommentNum = styled.Text`
  font-family: "nanum-regular";
  font-size: 12px;
`;

export default function NoMessage() {
  const { width: pageWidth } = useWindowDimensions();
  const navigation = useNavigation();

  const emotion = "noMessage";

  return (
    // <TouchableWithoutFeedback
    //   onPress={() => {
    //     navigation.navigate(ROUTE_NAME.MESSAGE_SEND);
    //   }}
    // >
    <Container>
      <MessageContainer style={{ width: pageWidth }}>
        <MessageBackground
          style={{
            backgroundColor: BGColors[emotion],
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              // justifyContent: "center",
              alignItems: "center",
              paddingTop: 60,
            }}
          >
            <View style={{ flex: 2 }}>
              <Image
                source={{ uri: assetStore.messageEmotions[emotion] }}
                resizeMode="contain"
                style={{
                  width: 50,
                  height: 50,
                  margin: 12,
                }}
              />
            </View>
            <MessagePayload
              numberOfLines={2}
              style={{ flex: 5 }}
              allowFontScaling={false}
            >
              {"오늘 도착한\n이야기가 없습니다"}
            </MessagePayload>

            <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
          </View>
        </MessageBackground>
      </MessageContainer>

      <Actions
        style={{
          borderBottomColor: Colors.borderDark,
          borderBottomWidth: 0.3,
        }}
      >
        <View style={{ flexDirection: "row", position: "absolute", left: 10 }}>
          <View
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActionIcon
              iconName="heart"
              isClicked={false}
              color={Colors.heart}
            />
            <CommentNum>0</CommentNum>
          </View>

          <View
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActionIcon iconName="chatbubble-ellipses" isClicked={false} />
            <CommentNum>0</CommentNum>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IndicatorWrapper>
            <Indicator focused={true} />
          </IndicatorWrapper>
        </View>

        <View
          style={{
            padding: 10,
            justifyContent: "center",
            position: "absolute",
            right: 10,
          }}
        >
          <ActionIcon
            iconName="bookmark"
            isClicked={false}
            color={Colors.main}
          />
        </View>
      </Actions>
    </Container>
    // </TouchableWithoutFeedback>
  );
}
