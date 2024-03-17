import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../Config";
import ScreenLayout from "../ScreenLayout";

/** styled-components */
const Container = styled.View`
  width: 100%;
  height: 90%;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 100%;
  height: 130px;
`;

const SubText = styled.Text`
  font-family: "nanum-regular";
  color: ${Colors.borderDark};
  padding: 10px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;

export default function AuthLayout({ children }) {
  return (
    <ScreenLayout>
      <Container>
        <Logo
          resizeMode="contain"
          source={require("../../../assets/images/appicon.png")}
        />
        <SubText>간편 로그인을 통해 우리가를 시작해보세요</SubText>

        <ButtonContainer>{children}</ButtonContainer>
      </Container>
    </ScreenLayout>
  );
}
