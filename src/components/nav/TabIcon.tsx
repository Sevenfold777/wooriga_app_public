import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {Colors} from '../../Config';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
};

export default function TabIcon({iconName, isFocused}: Props) {
  let name = iconName;

  if (!isFocused) {
    const outlined = Object.keys(Ionicons.glyphMap).find(
      icon => icon === `${iconName}-outline`,
    ) as keyof typeof Ionicons.glyphMap;

    name = outlined;
  }

  return (
    <Ionicons
      name={name}
      size={25}
      // color={isFocused ? Colors.main : 'black'}
    />
  );
}

TabIcon.propTypes = {
  name: PropTypes.string.isRequired,
  isFocused: PropTypes.bool.isRequired,
};
