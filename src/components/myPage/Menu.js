import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { Colors } from "../../Config";

export const MenuBar = styled.TouchableOpacity`
  border: 0.5px solid #aeaeae;
  border-radius: 15px;
  flex-direction: row;
  padding: 15px 10px;
  margin-bottom: 5px;
`;

export const MenuTitle = styled.Text`
  flex: 1;
  font-family: "nanum-regular";
`;

export default function Menu({ payload, action }) {
  return (
    <MenuBar onPress={action}>
      <MenuTitle>{payload}</MenuTitle>
      <Ionicons name="chevron-forward" size={15} color={Colors.borderDark} />
    </MenuBar>
  );
}

Menu.propTypes = {
  payload: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};
