import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { BGColors, Colors } from "../../Config";
import { Ionicons } from "@expo/vector-icons";
import { ROUTE_NAME } from "../../Strings";

/** styled-components */
const Container = styled.TouchableOpacity`
  padding: 0px 10px;
`;

const MessageContainer = styled.View``;

const MessageBackground = styled.ImageBackground`
  justify-content: center;
  align-items: center;
  width: 200px;
  aspect-ratio: ${2 / 1};
  border-radius: 5px;
`;

const MessagePayload = styled.Text`
  text-align: center;
  font-size: 20px;
  font-family: "kangwon-font";
  max-width: 80%;
`;

const SharedCountContainer = styled.View`
  flex-direction: row;
  position: absolute;
  right: 5px;
  top: 5px;
  justify-content: center;
  align-items: center;
  background-color: rgba(1, 1, 1, 0.2);
  padding: 5px;
  border-radius: 7px;
`;

const SharedCountText = styled.Text`
  margin-left: 3px;
  font-family: "nanum-regular";
  font-size: 12px;
  color: white;
`;

export default function MessageSmall({
  messageId,
  payload,
  emotion,
  sharedCount,
}) {
  // useNavigation
  const navigation = useNavigation();

  const messageLines = payload.split(/\n/g);
  const thumbnailMessage = messageLines[1]
    ? messageLines[0].concat("\n", messageLines[1])
    : messageLines[0];

  return (
    <Container
      onPress={() =>
        navigation.navigate(ROUTE_NAME.MESSAGE_PUBLIC, { messageId })
      }
    >
      <MessageContainer>
        <MessageBackground
          imageStyle={{ borderRadius: 10 }}
          style={{
            backgroundColor: BGColors[emotion],
          }}
        >
          <MessagePayload numberOfLines={2} allowFontScaling={false}>
            {thumbnailMessage}
          </MessagePayload>
        </MessageBackground>

        <SharedCountContainer>
          <Ionicons name="paper-plane" color={Colors.white} />
          <SharedCountText>{sharedCount}</SharedCountText>
        </SharedCountContainer>
      </MessageContainer>
    </Container>
  );
}

MessageSmall.propTypes = {
  messageId: PropTypes.number.isRequired,
  payload: PropTypes.string.isRequired,
  emotion: PropTypes.string.isRequired,
  sharedCount: PropTypes.number,
};
