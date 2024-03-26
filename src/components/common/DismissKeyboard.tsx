import React from 'react';
import {Keyboard, Platform, TouchableWithoutFeedback} from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function DismissKeyboard({children}: Props) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      style={{flex: 1, height: '100%'}}
      onPress={dismissKeyboard}
      disabled={Platform.OS === 'web'}>
      {children}
    </TouchableWithoutFeedback>
  );
}
