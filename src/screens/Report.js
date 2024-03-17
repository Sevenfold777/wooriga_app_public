import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
import Modal from "react-native-modal";
import { ModalContainer } from "../components/DailyEmotion";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createReportApi, ReportType } from "../api/ReportApi";

import { View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import Completed from "../components/Completed";
import { SelectionContainer } from "./Auth/SignUp";
import { Colors } from "../Config";

const Wrapper = styled.View`
  height: 100%;
  padding: 10px;
`;

const Container = styled.View`
  margin-bottom: 30px;
`;

const TagContainer = styled.View`
  justify-content: center;
  margin-bottom: 10px;
  padding: 0px 12px;
`;

const TagText = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
`;

const ReasonContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin: 0px 5px;
  padding: 12px 15px;
  border: 0.5px solid ${Colors.borderDark};
  border-radius: 25px;
  height: 50px;
  align-items: center;
`;

const ReasonText = styled.Text`
  font-family: "nanum-regular";
`;

const InputContainer = styled.View`
  height: 120px;
  background-color: white;
  border-radius: 15px;
  border: 0.5px solid ${Colors.borderDark};
  margin: 0px 5px;
`;

const Input = styled.TextInput`
  font-family: "nanum-regular";
  height: 100%;
  padding: 12px;
  color: black;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  /* border: 0.5px solid ${Colors.borderDark}; */

  padding: 15px;
  margin: 0px 2px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export default function Report({ navigation, route: { params } }) {
  const [reasonModal, setReasonModal] = useState(false);
  const [reasonPressed, setReasonPressed] = useState("사유 선택");
  const [reportSent, setReportSent] = useState(false);

  const report = useMutation(createReportApi, {
    onSuccess: () => {},
  });
  const { control, watch, handleSubmit } = useForm();

  const onValid = ({ payload }) => {
    setReportSent(true);
    report.mutate({
      targetType: params?.targetType,
      targetId: params?.targetId,
      reportType: reasonPressed,
      ...(payload && { payload }),
    });
  };

  if (reportSent) {
    return (
      <ScreenLayout>
        <Completed
          mainText="신고가 접수되었습니다."
          subText="운영진의 검토 후, 신고를 처리합니다."
          toBack={() => navigation.goBack()}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <DismissKeyboard>
        <Wrapper>
          <Container>
            <TagContainer>
              <TagText>신고 항목</TagText>
            </TagContainer>
            <ReasonContainer onPress={() => setReasonModal(true)}>
              <ReasonText style={{ flex: 1 }}>{reasonPressed}</ReasonText>
              <Ionicons
                name={reasonModal ? "chevron-up" : "chevron-down"}
                size={16}
              />
            </ReasonContainer>
          </Container>

          <Container>
            <TagContainer>
              <TagText>상세 사유</TagText>
            </TagContainer>
            <InputContainer>
              <Controller
                control={control}
                name="payload"
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChangeText={onChange}
                    value={value}
                    placeholder={`(${
                      reasonPressed === ReportType.ETC ? "필수" : "선택"
                    }) 상세 사유를 입력해주세요.`}
                    multiline={true}
                    textAlignVertical="top"
                  />
                )}
                rules={{
                  required: reasonPressed === ReportType.ETC ? true : false,
                }}
              />
            </InputContainer>
          </Container>

          <View style={{ paddingHorizontal: 5, flexDirection: "row" }}>
            <Button
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: Colors.borderLight }}
            >
              <ReasonText
                style={{
                  marginHorizontal: 5,
                }}
              >
                취소
              </ReasonText>
              {/* <Ionicons name="download-outline" color="white" size={20} /> */}
            </Button>

            <Button
              onPress={handleSubmit(onValid)}
              style={{
                backgroundColor: Colors.main,
                opacity:
                  !Object.values(ReportType).includes(reasonPressed) ||
                  (reasonPressed === ReportType.ETC && !watch("payload"))
                    ? 0.5
                    : 1,
              }}
              disabled={
                !Object.values(ReportType).includes(reasonPressed) ||
                (reasonPressed === ReportType.ETC && !watch("payload"))
              }
            >
              <ReasonText
                style={{
                  marginHorizontal: 5,
                }}
              >
                접수
              </ReasonText>
            </Button>
          </View>

          <Modal
            isVisible={reasonModal}
            onBackdropPress={() => {
              setReasonModal(false);
            }}
            onSwipeComplete={() => {
              setReasonModal(false);
            }}
            onBackButtonPress={() => {
              setReasonModal(false);
            }}
            swipeDirection="down"
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            backdropTransitionOutTiming={0}
          >
            <ModalContainer
              style={{ paddingVertical: 30, paddingHorizontal: 10 }}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 0, right: 0, padding: 10 }}
                onPress={() => setReasonModal(false)}
              >
                <Ionicons name="close" size={22} color={Colors.borderDark} />
              </TouchableOpacity>

              {Object.values(ReportType).map((reason, index) => (
                <SelectionContainer
                  key={index}
                  onPress={() => {
                    setReasonPressed(reason);
                    setReasonModal(false);
                  }}
                >
                  <ReasonText style={{ flex: 1 }}>{reason}</ReasonText>
                  {reason === reasonPressed && (
                    <Ionicons name="checkmark" size={15} />
                  )}
                </SelectionContainer>
              ))}
            </ModalContainer>
          </Modal>
        </Wrapper>
      </DismissKeyboard>
    </ScreenLayout>
  );
}
