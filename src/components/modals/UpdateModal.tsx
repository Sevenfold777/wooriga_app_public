import React from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {openURL} from '../../helper';
import Modal from './Modal';
import {TitleContainer, TitleText} from '../common/Common';
import propTypes from 'prop-types';

const Wrapper = styled.View`
  padding: 20px 25px 20px 25px;
`;

const SubTextContainer = styled.View`
  padding: 5px 10px;
`;

const SubText = styled.Text`
  font-family: 'nanum-regular';
  line-height: 18px;
`;

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
};

export default function UpdateModal({isVisible, setVisible}: Props) {
  const APPSTORE_URL =
    'https://apps.apple.com/us/app/%EC%9A%B0%EB%A6%AC%EA%B0%80/id1665530266';
  const PLAYSTORE_URL =
    'https://play.google.com/store/apps/details?id=com.wooriga.appservice';

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => setVisible(false)}
      onConfirm={() => {
        openURL(Platform.OS === 'android' ? PLAYSTORE_URL : APPSTORE_URL);
        setVisible(false);
      }}>
      <Wrapper>
        <TitleContainer>
          <TitleText>업데이트 알림</TitleText>
        </TitleContainer>

        <SubTextContainer>
          <SubText>
            사용 가능한 새로운 업데이트가 있습니다. 스토어로 이동하시겠습니까?
          </SubText>
        </SubTextContainer>
      </Wrapper>
    </Modal>
  );
}

UpdateModal.propTypes = {
  isVisible: propTypes.bool.isRequired,
  setVisible: propTypes.func.isRequired,
};
