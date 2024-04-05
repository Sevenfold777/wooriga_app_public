import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {AppState} from 'react-native';
import propTypes from 'prop-types';

const TimeText = styled.Text<{fontSize: number; isBold: boolean}>`
  font-size: ${props => props.fontSize}px;
  font-family: ${props => (props.isBold ? 'nanum-bold' : 'nanum-regular')};
`;

type Props = {
  targetTime: Date;
  decoratorText: string;
  fontSize?: number;
  isBold?: boolean;
};

export default function Timer({
  targetTime,
  decoratorText,
  fontSize = 14,
  isBold = false,
}: Props) {
  const initialTime = new Date(targetTime.getTime() - new Date().getTime());

  const [minutes, setMinutes] = useState(initialTime.getMinutes());
  const [seconds, setSeconds] = useState(initialTime.getSeconds());

  useEffect(() => {
    const countDown = setInterval(() => {
      // 초 countdown
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      // minute countdown
      else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countDown);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000); // for every 1000ms

    return () => clearInterval(countDown);
  }, [minutes, seconds]);

  /** handling fore/background */
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const newTime = new Date(targetTime.getTime() - new Date().getTime());
        setMinutes(newTime.getTime() > 0 ? newTime.getMinutes() : 0);
        setSeconds(newTime.getTime() > 0 ? newTime.getSeconds() : 0);
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  return (
    <TimeText isBold={isBold} fontSize={fontSize}>
      {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
        2,
        '0',
      )} ${decoratorText}`}
    </TimeText>
  );
}

Timer.propTypes = {
  targetTime: propTypes.object.isRequired,
  decoratorText: propTypes.string.isRequired,
  fontSize: propTypes.number,
  isBold: propTypes.bool,
};
