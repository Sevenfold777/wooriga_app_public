import React from 'react';
import RNModal from 'react-native-modal';
import styled from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from '../../Config';
import {useHeaderHeight} from '@react-navigation/elements';
import propType from 'prop-types';

const ModalContainer = styled.View`
  background-color: rgb(255, 255, 255);
  border-radius: 15px;
  overflow: hidden;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const ItemContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  background-color: ${Colors.white};
  justify-content: center;
  border-radius: 15px;
  overflow: hidden;
  padding: 15px 20px;
  width: 140px;
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
  font-family: 'nanum-regular';
`;

const ItemSubText = styled.Text`
  margin-left: 7px;
  font-family: 'nanum-regular';
`;

type ModalRhProps = {
  isVisible: boolean;
  onClose: () => void;
  onCloseEnd?: () => void;
  children: React.ReactNode;
};

type ItemProps = {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  payload: string;
  subPayload?: string;
  onPress(): void;
  isSelected?: boolean;
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

export default function ModalRh({
  isVisible,
  children,
  onClose,
  onCloseEnd,
}: ModalRhProps) {
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
      style={{
        position: 'absolute',
        top: headerHeight - 20,
        right: 0,
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}>
      <ModalContainer>{children}</ModalContainer>
    </RNModal>
  );
}

ModalRh.propTypes = {
  isVisible: propType.bool.isRequired,
  onClose: propType.func.isRequired,
  onCloseEnd: propType.func,
};

ModalItem.propTypes = {
  iconName: propType.string,
  iconSize: propType.number,
  payload: propType.string.isRequired,
  subPayload: propType.string,
  onPress: propType.func.isRequired,
  isSelected: propType.bool.isRequired,
};
