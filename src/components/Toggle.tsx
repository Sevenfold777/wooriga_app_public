import React from 'react';
import PropTypes from 'prop-types';
import {Keyboard} from 'react-native';
import styled from 'styled-components/native';
import {Colors} from '../Config';

const ToggleContainer = styled.View`
  margin: 10px 10px 0px 10px;
  align-items: center;
  justify-content: center;
`;

const ToggleWrapper = styled.View<{unFocusedColor: string}>`
  flex-direction: row;
  display: flex;
  align-items: center;
  border-radius: 30px;
  background-color: ${props => props.unFocusedColor};
`;

const ToggleButton = styled.TouchableOpacity<{isFocused: boolean}>`
  align-items: center;
  justify-content: center;
  /* height: 30px; */
  padding: 10px 16px;
  border-radius: 30px;
  background-color: ${props => (props.isFocused ? Colors.main : 'transparent')};
`;

const ToggleText = styled.Text<{isFocused: boolean}>`
  font-family: 'nanum-bold';
  color: ${props => (props.isFocused ? 'white' : 'black')};
`;

type Props = {
  toggleState: boolean;
  toggleFunc: () => void;
  unFocusedColor?: string;
  textA: string;
  textB: string;
};

export default function Toggle({
  toggleState,
  toggleFunc,
  unFocusedColor = 'white',
  textA,
  textB,
}: Props) {
  return (
    <ToggleContainer>
      <ToggleWrapper unFocusedColor={unFocusedColor}>
        <ToggleButton
          isFocused={!toggleState}
          onPress={() => {
            toggleFunc(!toggleState);
            Keyboard.dismiss();
          }}>
          <ToggleText isFocused={false}>{textA}</ToggleText>
        </ToggleButton>
        <ToggleButton
          isFocused={toggleState}
          onPress={() => {
            toggleFunc(!toggleState);
            Keyboard.dismiss();
          }}>
          <ToggleText isFocused={false}>{textB}</ToggleText>
        </ToggleButton>
      </ToggleWrapper>
    </ToggleContainer>
  );
}

Toggle.propTypes = {
  toggleState: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  unFocusedColor: PropTypes.string,
  textA: PropTypes.string.isRequired,
  textB: PropTypes.string.isRequired,
};
