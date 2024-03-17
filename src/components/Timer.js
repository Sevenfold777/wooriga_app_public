import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { AppState } from "react-native";
import PropTypes from "prop-types";

const TimeText = styled.Text`
  /* padding: 0px 5px; */
`;

export default function Timer({
  targetTime,
  decoratorText,
  fontSize = 14,
  isBold = false,
}) {
  const initialTime = new Date(targetTime - new Date());

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
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // console.log("became foreground");
        const newTime = new Date(targetTime - new Date());
        setMinutes(newTime > 0 ? newTime.getMinutes() : 0);
        setSeconds(newTime > 0 ? newTime.getSeconds() : 0);
      }
      //   else {
      //     console.log("became background");
      //   }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  return (
    <TimeText
      style={{ fontSize, fontFamily: isBold ? "nanum-bold" : "nanum-regular" }}
    >
      {`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )} ${decoratorText}`}
    </TimeText>
  );
}

Timer.propTypes = {
  targetTime: PropTypes.object.isRequired,
  decoratorText: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};
