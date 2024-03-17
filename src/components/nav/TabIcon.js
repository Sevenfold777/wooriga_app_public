import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PropTypes, { string } from "prop-types";

export default function TabIcon({ iconName, isFocused }) {
  return (
    <Ionicons name={isFocused ? iconName : `${iconName}-outline`} size={25} />
  );
}

TabIcon.propTypes = {
  iconName: PropTypes.string.isRequired,
  isFocused: PropTypes.bool.isRequired,
};
