import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { Colors } from "../../Config";

const Button = styled.TouchableOpacity`
  background-color: ${Colors.borderDark};
  padding: 15px 10px;
  border-radius: 3px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-family: "nanum-bold";
`;

export default function AuthButton({ onPress, disabled, text, isLoading }) {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
}

AuthButton.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
