import styled from "styled-components/native";
import { Colors } from "../../Config";

export const TextInput = styled.TextInput`
  background-color: white;
  padding: 15px 7px;
  border-radius: 4px;
  color: gray;
  margin-bottom: ${(props) => (props.lastOne ? "15" : 8)}px;
  border: 1px solid ${Colors.borderDark};
  font-family: "nanum-regular";
`;
