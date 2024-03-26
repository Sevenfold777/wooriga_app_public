import React from 'react';
import {StatusBar, useWindowDimensions} from 'react-native';
import RNModal from 'react-native-modal';
import styled from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from '../../Config';

const ModalContainer = styled.View`
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  padding: 20px 20px;
`;

const ItemList = styled.View`
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
  min-height: 100px;
`;

const Title = styled.View`
  margin-top: 5px;
  padding: 10px;
`;

const TitleText = styled.Text`
  /* font-family: 'nanum-bold'; */
  font-size: 18px;
`;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 12px 0px;
`;

const ItemIcon = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.borderLight};
  padding: 10px;
  aspect-ratio: 1;
  width: 50px;
  border-radius: 25px;
  margin-right: 15px;
`;

const ItemTextWrapper = styled.View`
  flex: 1;
`;

const ItemText = styled.Text`
  font-size: 16px;
`;

const ItemSubText = styled.Text`
  margin-left: 7px;
`;

const CloseBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 5px;
  position: absolute;
  right: 10px;
  top: 10px;
`;

type BottomSheetProps = {
  title?: string;
  isVisible: boolean;
  onClose(): void;
  onConfirm(): void;
  onCloseEnd(): void;
  closeText?: string;
  confirmText?: string;
  confirmDisabled: boolean;
  children: React.ReactNode;
};

type BottomSheetItemProps = {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  payload: string;
  subPayload?: string;
  onPress(): void;
};

export function BottomSheetItem({
  iconName,
  payload,
  iconSize = 22,
  subPayload,
  onPress,
}: BottomSheetItemProps) {
  return (
    <ItemContainer onPress={onPress}>
      {iconName ? (
        <ItemIcon>
          <Ionicons name={iconName} size={iconSize} />
        </ItemIcon>
      ) : (
        <></>
      )}

      <ItemTextWrapper>
        <ItemText>{payload}</ItemText>
        {subPayload ? <ItemSubText>{subPayload}</ItemSubText> : <></>}
      </ItemTextWrapper>
    </ItemContainer>
  );
}

export default function BottomSheet({
  title,
  isVisible,
  children,
  onClose,
  onConfirm,
  onCloseEnd,
  closeText = '취소',
  confirmText = '확인',
  confirmDisabled,
}: BottomSheetProps) {
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
      deviceHeight={deviceHeight}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <ModalContainer>
        {title ? (
          <Title>
            <TitleText>{title}</TitleText>
          </Title>
        ) : (
          <></>
        )}

        <ItemList>{children}</ItemList>
        <CloseBtn onPress={onClose}>
          <Ionicons name="close" size={25} />
        </CloseBtn>
      </ModalContainer>
    </RNModal>
  );
}
