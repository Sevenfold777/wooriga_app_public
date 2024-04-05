import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {MainTabParams, SignedInParams} from '../navigators/types';

type Props = {
  width: number;
  url: string;
  payloadType: string;
  payloadPath: keyof SignedInParams | keyof MainTabParams | string;
  description?: string;
};

export default function BannerBar({
  width,
  url,
  payloadType,
  payloadPath,
  description,
}: Props) {
  const navigation = useNavigation();

  const onPress = () => {
    payloadType === 'webview'
      ? navigation.navigate('BannersPayload', {
          url: payloadPath,
          ...(description && {title: description}),
        })
      : navigation.navigate(payloadPath);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <FastImage
        source={{uri: url}}
        style={{width, aspectRatio: 2000 / 414}}
        resizeMode="cover"
      />
    </TouchableWithoutFeedback>
  );
}

BannerBar.propTypes = {
  width: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  payloadType: PropTypes.string.isRequired,
  payloadPath: PropTypes.string.isRequired,
  description: PropTypes.string,
};
