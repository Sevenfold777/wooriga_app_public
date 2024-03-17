import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { Colors } from "../../Config";

export default function ActionIcon({
  iconName,
  isClicked = false,
  color = "",
}) {
  return (
    <Ionicons
      name={isClicked ? iconName : `${iconName}-outline`}
      size={24}
      color={isClicked ? color : Colors.black}
    />
  );
}

ActionIcon.propTypes = {
  iconName: PropTypes.string.isRequired,
  isClicked: PropTypes.bool,
  color: PropTypes.string,
};
