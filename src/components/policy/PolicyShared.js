import styled from "styled-components/native";

export const Container = styled.View`
  padding: 10px;
`;

export const TitleText = styled.Text`
  font-family: "nanum-bold";
  font-size: 18px;
`;

export const SubTitleText = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
`;

export const Segment = styled.View`
  padding: 10px;
  margin-bottom: 20px;
`;

export const Body = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;

export const BodyNumber = styled.Text`
  font-size: 12px;
  font-family: "nanum-bold";
  margin-right: 5px;
`;

export const BodyText = styled.Text`
  flex: 1;
  font-family: "nanum-regular";
  font-size: 12px;
`;

export const InnerBody = styled.View`
  padding: 0px 10px;
  margin-bottom: 5px;
  flex-direction: row;
`;

export const TableLayout = styled.View`
  flex: 1;
  border: 0.5px solid #aeaeae;
  /* padding: 10px; */
`;

export const TableRow = styled.View`
  flex-direction: row;
  border-bottom-width: 0.5px;
  border-bottom-color: #aeaeae;
`;

export const TableTag = styled.View`
  border-right-width: 0.5px;
  border-right-color: #aeaeae;
  width: 90px;
`;

export const TablePayload = styled.View`
  flex: 1;
  border-right-width: 0.5px;
  border-right-color: #aeaeae;
`;

export const TableText = styled.Text`
  font-family: "nanum-regular";
  font-size: 12px;
  padding: 10px;
`;

export function Table({ rows }) {
  return (
    <TableLayout>
      {rows.map((row, index) => (
        <TableRow key={index}>
          <TableTag>
            <TableText style={{ textAlign: "center" }}>{row.tag}</TableText>
          </TableTag>
          <TablePayload>
            <TableText>{row.payload}</TableText>
          </TablePayload>
        </TableRow>
      ))}
    </TableLayout>
  );
}
