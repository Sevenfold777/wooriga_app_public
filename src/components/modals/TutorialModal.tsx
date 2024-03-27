import React from 'react';
import Tutorial from '../Tutorial';
import Modal from './Modal';
import {View} from 'react-native';
import {TitleContainer, TitleText} from '../common/Common';
import propTypes from 'prop-types';

type Props = {
  isTutorial: boolean;
  setTutorial: (isTutorial: boolean) => void;
  pageWidth: number;
};

export default function TutorialModal({
  isTutorial,
  setTutorial,
  pageWidth,
}: Props) {
  return (
    <Modal
      isVisible={isTutorial}
      onClose={() => setTutorial(false)}
      confirmExist={false}>
      <View>
        <TitleContainer style={{marginVertical: 15, marginHorizontal: 20}}>
          <TitleText>우리가 소개</TitleText>
        </TitleContainer>
        <Tutorial width={pageWidth - 40} />
      </View>
    </Modal>
  );
}

TutorialModal.propTypes = {
  isTutorial: propTypes.bool.isRequired,
  setTutorial: propTypes.func.isRequired,
  pageWidth: propTypes.number.isRequired,
};
