import styled from 'styled-components/native';

export const Indicator = styled.View<{focused: boolean}>`
  margin: 0px 3px;
  background-color: ${props => (props.focused ? '#dfdfdf' : '#262626')};
  width: 8px;
  height: 8px;
  border-radius: 4px;
`;

export const IndicatorWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
