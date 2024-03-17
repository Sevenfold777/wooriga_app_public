import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { Colors } from "../../Config";

const Wrapper = styled.View`
  padding: 10px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  padding: 0px 5px;
`;

const TitleText = styled.Text`
  font-family: "nanum-bold";
`;

const PayloadContainer = styled.View`
  /* padding: 10px; */
  margin-top: 10px;
  padding: 20px;
  background-color: ${Colors.borderLight};
`;

const PayloadText = styled.Text`
  font-family: "nanum-regular";
  font-size: 12px;
`;

export default function OpenSourceLicensePayload({
  navigation,
  route: { params },
}) {
  return (
    <ScreenLayout>
      <Wrapper>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <TitleContainer>
            <TitleText>{params?.license.libraryName}</TitleText>
          </TitleContainer>

          <TitleContainer style={{ marginTop: 5, marginHorizontal: 15 }}>
            <PayloadText>- </PayloadText>
            <PayloadText>
              {params?.license.homepage || params?.license.repository.url}
            </PayloadText>
          </TitleContainer>

          <PayloadContainer>
            <PayloadText>{params?.license._licenseContent}</PayloadText>
          </PayloadContainer>
        </ScrollView>
      </Wrapper>
    </ScreenLayout>
  );
}
