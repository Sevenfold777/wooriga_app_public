import React from 'react';
import {StatusBar, useWindowDimensions} from 'react-native';
import RNModal from 'react-native-modal';
import styled from 'styled-components/native';
import {Colors} from '../../Config';
import {RowContainer} from './Common';

const ModalContainer = styled.View`
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  overflow: hidden;
`;

// const ConfirmModalContainer = styled.View`
//   background-color: white;
//   width: 300px;
//   border-radius: 7px;
// `;

const ConfirmModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-family: 'nanum-regular';
`;

const ConfirmModalBtn = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

type Props = {
  isVisible: boolean;
  onClose(): void;
  onConfirm(): void;
  onCloseEnd(): void;
  closeText?: string;
  confirmText?: string;
  confirmDisabled: boolean;
  children: React.ReactNode;
};

export default function Modal({
  isVisible,
  children,
  onClose,
  onConfirm,
  onCloseEnd,
  closeText = '취소',
  confirmText = '확인',
  confirmDisabled,
}: Props) {
  const {height: pageHeight} = useWindowDimensions();
  const deviceHeight = StatusBar.currentHeight
    ? pageHeight + StatusBar.currentHeight + 10
    : pageHeight + 100;

  return (
    <RNModal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      onModalHide={onCloseEnd}
      swipeDirection="down"
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={deviceHeight}>
      <ModalContainer>
        {children}
        <RowContainer
          style={{
            borderTopWidth: 0.3,
            borderTopColor: Colors.borderDark,
          }}>
          <ConfirmModalBtn onPress={onClose}>
            <ConfirmModalText>{closeText}</ConfirmModalText>
          </ConfirmModalBtn>
          <ConfirmModalBtn
            style={{
              borderLeftWidth: 0.3,
              borderLeftColor: Colors.borderDark,
            }}
            onPress={onConfirm}
            disabled={confirmDisabled}>
            <ConfirmModalText>{confirmText}</ConfirmModalText>
          </ConfirmModalBtn>
        </RowContainer>
      </ModalContainer>
    </RNModal>
  );
}
