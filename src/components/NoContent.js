import React from "react";
import styled from "styled-components/native";
import ScreenLayout from "./ScreenLayout";
import PropTypes from "prop-types";

export const NoContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const NoContentText = styled.Text`
  padding: 5px 0px;
  font-family: "nanum-regular";
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

export default function NoContent({ payload }) {
  return (
    <ScreenLayout>
      <NoContentContainer>
        <NoContentText>{payload}</NoContentText>
      </NoContentContainer>
    </ScreenLayout>
  );
}

NoContent.propTypes = {
  payload: PropTypes.string.isRequired,
};
