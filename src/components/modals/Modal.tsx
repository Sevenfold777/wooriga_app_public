/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StatusBar, useWindowDimensions} from 'react-native';
import RNModal from 'react-native-modal';
import styled from 'styled-components/native';
import {Colors} from '../../Config';
import {RowContainer} from '../common/Common';
import propTypes from 'prop-types';

const ModalContainer = styled.View`
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  overflow: hidden;
`;

const ConfirmModalText = styled.Text`
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
  onClose: () => void;
  onConfirm?: () => void;
  onCloseEnd?: () => void;
  closeText?: string;
  confirmExist?: boolean;
  confirmText?: string;
  confirmDisabled?: boolean;
  children: React.ReactNode;
};

export default function Modal({
  isVisible,
  children,
  onClose,
  onConfirm,
  onCloseEnd,
  closeText = '닫기',
  confirmText = '확인',
  confirmExist = true,
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
          {confirmExist ? (
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              onPress={onConfirm}
              disabled={confirmDisabled}>
              <ConfirmModalText>{confirmText}</ConfirmModalText>
            </ConfirmModalBtn>
          ) : (
            <></>
          )}
        </RowContainer>
      </ModalContainer>
    </RNModal>
  );
}

Modal.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  onConfirm: propTypes.func,
  onCloseEnd: propTypes.func,
  closeText: propTypes.string,
  confirmText: propTypes.string,
  confirmExist: propTypes.bool,
  confirmDisabled: propTypes.bool,
};
