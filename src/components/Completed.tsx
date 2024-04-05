import React from 'react';
import styled from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import ScreenLayout from './common/ScreenLayout';
import PropTypes from 'prop-types';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 150px;
  background-color: white;
`;

const MainText = styled.Text`
  text-align: center;
  padding: 5px;
  font-size: 18px;
  font-family: 'nanum-bold';
`;

const SubText = styled.Text`
  text-align: center;
  padding: 5px;
  font-size: 16px;
  color: #7e7e7e;
  font-family: 'nanum-regular';
`;

const ConfirmText = styled.Text`
  color: #3d6acb;
  padding: 5px;
  font-family: 'nanum-bold';
`;

type Props = {
  mainText: string;
  subText: string;
  toBack: () => void;
};

export default function Completed({mainText, subText, toBack}: Props) {
  return (
    <ScreenLayout>
      <Container>
        <Ionicons name="paper-plane" size={30} style={{padding: 10}} />
        <MainText>{mainText}</MainText>
        <SubText>{subText}</SubText>
        <ConfirmText onPress={toBack}>이전 화면으로 돌아가기</ConfirmText>
      </Container>
    </ScreenLayout>
  );
}

Completed.propTypes = {
  mainText: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  toBack: PropTypes.func.isRequired,
};
