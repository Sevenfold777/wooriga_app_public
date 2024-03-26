import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {Colors} from '../../Config';

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  isClicked?: boolean;
  color?: string;
};

export default function ActionIcon({
  iconName,
  isClicked = false,
  color = '',
}: Props) {
  let icon = iconName;

  if (!isClicked) {
    const outlined = Object.keys(Ionicons.glyphMap).find(
      ic => ic === `${iconName}-outline`,
    ) as keyof typeof Ionicons.glyphMap;

    icon = outlined;
  }
  return (
    <Ionicons name={icon} size={24} color={isClicked ? color : Colors.black} />
  );
}

ActionIcon.propTypes = {
  iconName: PropTypes.string.isRequired,
  isClicked: PropTypes.bool,
  color: PropTypes.string,
};
