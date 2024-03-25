import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, View} from 'react-native';
import styled from 'styled-components/native';
import {BGColors, BottomPhrases} from '../../Config';
import assetStore from '../../stores/AssetStore';
import {ROUTE_NAME} from '../../Strings';
import PropTypes from 'prop-types';

// const Container = styled.TouchableWithoutFeedback``;

const MessageContainer = styled.View`
  padding: 0 10px;
`;

const MessageBackground = styled.ImageBackground`
  justify-content: center;
  align-items: center;
  aspect-ratio: ${4 / 3};
  border-radius: 5px;
  width: 300px;
`;

const MessagePayload = styled.Text`
  text-align: center;
  font-size: 22px;
  font-family: 'kangwon-font';
`;

const PromotePayload = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.6;
`;

export default function MessageMiddle({messageId, payload, emotion}) {
  const navigation = useNavigation();
  const route = useRoute();

  const messageLines = payload.split(/\n/g);
  const thumbnailMessage = messageLines[1]
    ? messageLines[0].concat('\n', messageLines[1])
    : messageLines[0];

  return (
    <Container
      onPress={() => {
        route.name === ROUTE_NAME.MESSAGE_KEEP_PUBLIC
          ? navigation.navigate(ROUTE_NAME.MESSAGE_PUBLIC, {messageId})
          : navigation.navigate(ROUTE_NAME.MESSAGE_FAMILY, {messageId});
      }}>
      <MessageContainer>
        <MessageBackground style={{backgroundColor: BGColors[emotion]}}>
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              paddingTop: 50,
            }}>
            <View style={{flex: 2}}>
              {[ROUTE_NAME.MESSAGE_KEEP_PUBLIC].includes(route.name) ? (
                <Image
                  source={{
                    uri: assetStore.messagePublicEmos[emotion],
                  }}
                  resizeMode="contain"
                  style={{
                    width: 125,
                    height: 40,
                    margin: 5,
                  }}
                />
              ) : (
                <Image
                  source={{uri: assetStore.messageEmotions[emotion]}}
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    margin: 5,
                  }}
                />
              )}
            </View>
            <MessagePayload
              numberOfLines={2}
              style={{flex: 5}}
              allowFontScaling={false}>
              {thumbnailMessage}
            </MessagePayload>
            <PromotePayload>{BottomPhrases[emotion]}</PromotePayload>
          </View>
        </MessageBackground>
      </MessageContainer>
    </Container>
  );
}

MessageMiddle.propTypes = {
  messageId: PropTypes.number.isRequired,
  payload: PropTypes.string.isRequired,
  emotion: PropTypes.string.isRequired,
};
