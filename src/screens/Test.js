import React from "react";
import ScreenLayout from "../components/ScreenLayout";
import styled from "styled-components/native";
import { BGColors, Colors } from "../Config";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Prompt, PromptText } from "../components/letter/Letter";
import DailyEmotion from "../components/DailyEmotion";
import Modal from "react-native-modal";
import { RowContainer } from "../components/Common";
import { Ionicons } from "@expo/vector-icons";

const ScheduleContainer = styled.View``;

const ScheduleDayContainer = styled.TouchableOpacity`
  align-items: center;
  background-color: #fcdcc2;
  padding: 25px 10px 10px 10px;
  margin: 0px 10px;
  border-radius: 10px;
  width: 70px;
  /* height: 100px; */
`;

const ScheduleDay = styled.View`
  justify-content: center;
  align-items: center;
  /* padding: 5px;
  border-radius: 10px; */
  background-color: #fccea9;
  /* position: absolute;
  left: -5px;
  top: -5px; */

  border-radius: 30px;
  padding: 10px;
  width: ${(props) => (props.pageWidth - 40) / 7 - 10};
  margin: 0px 5px;
  aspect-ratio: 1;
`;

const ScheduleDayText = styled.Text`
  font-family: "nanum-regular";
`;

const ScheduleItem = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${BGColors.sad};
  width: 100%;
  border-radius: 10px;
`;

const ScheduleItemText = styled.Text`
  font-family: "nanum-regular";
`;

const TalkContainer = styled.View`
  padding: 10px;
`;

const TalkItem = styled.View`
  border-radius: 15px;
  padding: 30px 20px 20px 20px;
  margin: 10px 20px;
  background-color: ${(props) =>
    props.isMe ? BGColors.passion : BGColors.comfort};
`;

const TalkText = styled.Text`
  font-family: "kangwon-font";
  font-size: 20px;
  line-height: 28px;
  margin: 0px 10px;
`;

const Talker = styled.View`
  position: absolute;
  padding: 10px 20px;
  background-color: ${Colors.white};
  top: -5px;
  border-radius: 15px;
  border: 1px solid ${Colors.borderLight};
`;

const TalkerText = styled.Text`
  font-family: "nanum-bold";
`;

export default function Test({}) {
  const { width: pageWidth } = useWindowDimensions();

  return (
    <ScreenLayout>
      <ScheduleContainer style={{ marginBottom: 10 }}>
        <Prompt style={{ marginBottom: 15, marginLeft: 15 }}>
          <PromptText>우리가 일정</PromptText>
        </Prompt>
        <ScrollView
          horizontal={true}
          style={{
            padding: 10,
            marginHorizontal: 10,
            borderRadius: 10,
            backgroundColor: "#fceccf",
          }}
          showsHorizontalScrollIndicator={false}
        >
          {["월", "화", "수", "목", "금", "토", "일"].map((day, idx) => (
            // <ScheduleDayContainer key={idx}>
            //   <ScheduleItem>
            //     <ScheduleItemText>아빠</ScheduleItemText>
            //   </ScheduleItem>
            <ScheduleDay
              id={idx}
              pageWidth={pageWidth}
              style={{
                borderWidth: 2,
                borderColor: idx % 3 === 0 ? Colors.main : Colors.borderDark,
                backgroundColor:
                  idx % 3 === 0 ? Colors.sub : Colors.borderLight,
              }}
            >
              <ScheduleDayText>{day}</ScheduleDayText>
            </ScheduleDay>

            // </ScheduleDayContainer>
          ))}
        </ScrollView>
      </ScheduleContainer>

      <DailyEmotion />

      <Prompt>
        <PromptText>가족에게 한 마디</PromptText>
      </Prompt>

      <TalkContainer>
        <TalkItem isMe={false}>
          <Talker style={false ? { right: -10 } : { left: -10 }}>
            <TalkerText>아빠</TalkerText>
          </Talker>
          <TalkText>{"오늘은 조금 피곤하네\n우리 가족 모두 화이팅"}</TalkText>
        </TalkItem>

        <TalkItem isMe={false}>
          <Talker style={false ? { right: -10 } : { left: -10 }}>
            <TalkerText>형</TalkerText>
          </Talker>
          <TalkText>{"저녁 먹고 들어가요 갑자기 약속이 생겼네"}</TalkText>
        </TalkItem>

        <TalkItem isMe={true}>
          <Talker style={true ? { right: -10 } : { left: -10 }}>
            <TalkerText>나</TalkerText>
          </Talker>
          <TalkText>{"다들 수고~"}</TalkText>
        </TalkItem>
      </TalkContainer>

      <Modal isVisible={false}>
        <ScheduleContainer
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 10,
          }}
        >
          <Prompt>
            <PromptText>10. 18. 월요일 일정</PromptText>
          </Prompt>
          <View style={{ padding: 10 }}>
            <View
              style={{
                padding: 15,
                backgroundColor: Colors.sub,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <RowContainer>
                <Ionicons name="checkmark" />
                <ScheduleDayText style={{ flex: 1, marginLeft: 5 }}>
                  건대에서 저녁 약속
                </ScheduleDayText>
                <View
                  style={{
                    backgroundColor: "#fccea9",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <ScheduleDayText>상열</ScheduleDayText>
                </View>
              </RowContainer>
            </View>

            <View
              style={{
                padding: 15,
                backgroundColor: Colors.sub,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <RowContainer>
                <Ionicons name="checkmark" />
                <ScheduleDayText style={{ flex: 1, marginLeft: 5 }}>
                  학교에서 공부
                </ScheduleDayText>
                <View
                  style={{
                    backgroundColor: "#fccea9",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <ScheduleDayText>재원</ScheduleDayText>
                </View>
              </RowContainer>
            </View>

            <View
              style={{
                padding: 15,
                backgroundColor: Colors.sub,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <RowContainer>
                <Ionicons name="checkmark" />
                <ScheduleDayText style={{ flex: 1, marginLeft: 5 }}>
                  운동 밤새 해
                </ScheduleDayText>
                <View
                  style={{
                    backgroundColor: "#fccea9",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <ScheduleDayText>윤민</ScheduleDayText>
                </View>
              </RowContainer>
            </View>
          </View>
        </ScheduleContainer>
      </Modal>
    </ScreenLayout>
  );
}
