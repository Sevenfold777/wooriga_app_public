import { Platform } from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../Config";
import { InputContainer } from "../../screens/Auth/SignUp";

export const LetterContainer = styled.View`
  padding: 20px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const HeaderText = styled.Text`
  font-family: "kangwon-font";
  font-size: 24px;
  margin: 0px 10px;
`;

export const LetterText = styled.Text`
  font-family: "kangwon-font";
  font-size: 24px;
  /* font-size: ${Platform.OS === "ios" ? "22px" : "24px"}; */
  line-height: 32px;
  margin: 0px 10px;
`;

export const EmotionImg = styled.Image`
  width: 55px;
  height: 50px;
  position: absolute;
  bottom: 0px;
  right: 20px;
`;

export const PageContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 10px;
`;

export const PageText = styled.Text`
  font-family: "nanum-regular";
  color: ${Colors.white};
  font-size: 12px;
`;

export const Actions = styled.View`
  background-color: white;
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-top-width: 0.5px;
  border-color: ${Colors.borderLight};
`;

export const Action = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const DetailModalContainer = styled.View`
  background-color: ${Colors.white};
  justify-content: center;
  border-radius: 15px;
  overflow: hidden;
  border: 0.5px solid ${Colors.borderLight};
  padding: 5px 10px;
  width: 140px;
`;

export const DetailModalRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 10px;
`;

export const DetailModalText = styled.Text`
  font-family: "nanum-regular";
`;

export const Prompt = styled.View`
  margin-top: 10px;
  padding: 10px 10px 0px 10px;
`;

export const PromptText = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
`;

export const SelectionContainer = styled(InputContainer)`
  border-width: 0px;
  background-color: white;
`;

export const TargetContainer = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  padding: 20px 20px;
`;

export const StartBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  padding: 12px;
  border-radius: 10px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

export const StartBtnText = styled.Text`
  /* font-size: 16px; */
  font-family: "nanum-bold";
`;
