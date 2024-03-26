import React from 'react';
import {StatusBar, useWindowDimensions} from 'react-native';
import RNModal from 'react-native-modal';
import styled from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from '../../Config';
import {useHeaderHeight} from '@react-navigation/elements';

const ModalContainer = styled.View`
  background-color: rgb(255, 255, 255);
  border-radius: 15px;
  overflow: hidden;
  padding: 0px 20px;
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
  flex: 1;
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

type ModalLhProps = {
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

type ItemProps = {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  payload: string;
  subPayload?: string;
  onPress(): void;
  isSelected: boolean;
};

export function ModalItem({
  iconName,
  payload,
  iconSize = 22,
  subPayload,
  onPress,
  isSelected = false,
}: ItemProps) {
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
      {isSelected ? <Ionicons name="checkmark" size={iconSize} /> : <></>}
    </ItemContainer>
  );
}

export default function ModalLh({
  title,
  isVisible,
  children,
  onClose,
  onConfirm,
  onCloseEnd,
  closeText = '취소',
  confirmText = '확인',
  confirmDisabled,
}: ModalLhProps) {
  const {width: pageWidth, height: pageHeight} = useWindowDimensions();
  const deviceHeight = StatusBar.currentHeight
    ? pageHeight + StatusBar.currentHeight + 10
    : pageHeight + 100;

  const headerHeight = useHeaderHeight();

  return (
    <RNModal
      isVisible={isVisible}
      //   backdropOpacity={0}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      onModalHide={onCloseEnd}
      swipeDirection="down"
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={deviceHeight}
      //   style={{justifyContent: 'flex-start', margin: 10}}
      style={{
        position: 'absolute',
        left: 0,
        top: headerHeight + 50,
        width: 200,
      }}>
      <ModalContainer>
        {title ? (
          <Title>
            <TitleText>{title}</TitleText>
          </Title>
        ) : (
          <></>
        )}

        <ItemList>{children}</ItemList>
      </ModalContainer>
    </RNModal>
  );
}
