import React from 'react';
import styled from 'styled-components/native';
import propTypes from 'prop-types';
import {Colors} from '../../Config';

const Container = styled.TouchableOpacity`
  justify-content: center;
  align-items: flex-start;
`;

const ChatBubble = styled.View<{color: string}>`
  padding: 10px 20px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
`;

const BubbleArrow = styled.View<{color: string}>`
  width: 0px;
  height: 0px;
  background-color: transparent;
  border-style: solid;
  border-top-width: 0px;
  border-right-width: 3px;
  border-bottom-width: 7px;
  border-left-width: 3px;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: ${props => props.color};
  border-left-color: transparent;
`;

const PayloadText = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
`;

type Props = {
  payload: string;
  color?: string;
  onPress?: () => void;
  pressDisabled?: boolean;
  arrowLeft?: number;
};

export default function GuideModal({
  payload,
  color = Colors.borderLight,
  onPress = () => {},
  pressDisabled = false,
  arrowLeft = 40,
}: Props) {
  return (
    <Container onPress={onPress} disabled={pressDisabled}>
      <BubbleArrow color={color} style={{marginLeft: arrowLeft}} />
      <ChatBubble color={color}>
        <PayloadText allowFontScaling={false}>{payload}</PayloadText>
      </ChatBubble>
    </Container>
  );
}

GuideModal.propTypes = {
  payload: propTypes.string.isRequired,
  color: propTypes.string,
  onPress: propTypes.func,
  pressDisabled: propTypes.bool,
  arrowLeft: propTypes.number,
};
