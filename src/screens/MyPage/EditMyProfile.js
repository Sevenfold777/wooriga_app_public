import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import { editUserApi, myProfile } from "../../api/UsersApi";
import { ModalContainer } from "../../components/DailyEmotion";
import ScreenLayout from "../../components/ScreenLayout";
import useMe from "../../hooks/useMe";
import authStore from "../../stores/AuthStore";
import {
  Container,
  Input,
  InputContainer,
  LoadingText,
  LunarBtn,
  LunarBtnText,
  PayloadContainer,
  PayloadText,
  SelectionContainer,
  TagText,
  Wrapper,
  getAge,
} from "../Auth/SignUp";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../Config";
import {
  ConfirmModalBtn,
  ConfirmModalText,
} from "../../components/DetailModal";
import { RowContainer } from "../../components/Common";
import Toast from "../../components/Toast";

const HeaderRightBtn = styled.TouchableOpacity`
  background-color: ${Colors.main};
  padding: 8px;
  border-radius: 5px;
  margin-right: 8px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export default function EditMyProfile({ navigation }) {
  const { height: pageHeight } = useWindowDimensions();

  const positions = ["할아버지", "할머니", "아빠", "엄마", "아들", "딸"];

  const { data: me, isLoading } = useQuery(["Me"], myProfile, {
    onSuccess: ({ data: user }) => {
      setPosionPressed(user.position);
      setValue("userName", user.userName);
      setValue("birthday", user.birthday.replace(/-/g, "").slice(0, 8));
      setBirthLunar(user.isBirthLunar);
    },
  });

  const [positionModal, setPositionModal] = useState(false);
  const [positionPressed, setPosionPressed] = useState(me?.data.position);

  const [isBirthLunar, setBirthLunar] = useState(
    me?.data.isBirthLunar || false
  );

  // console.log(me);

  const { control, handleSubmit, watch, formState, setValue } = useForm({
    defaultValues: {},
  });

  const onValid = ({ userName, birthday }) => {
    const birthdayString = `${birthday.slice(0, 4)}-${birthday.slice(
      4,
      6
    )}-${birthday.slice(6)}`;

    // invalid date type
    if (isNaN(new Date(birthdayString))) {
      Toast({ message: "잘못된 생일 형식입니다." });
      return;
    } // 만 14세 이상 체크
    else if (getAge(birthdayString) < 14) {
      Toast({
        message: "본 서비스는 만 14세 이상부터 이용가능합니다.",
      });
      return;
    } else if (new Date(birthdayString).getFullYear() < 1900) {
      Toast({ message: "잘못된 생일 형식입니다." });
      return;
    }

    navigation.setOptions({ headerLeft: null, gestureEnabled: false });

    editUser.mutate({
      position: positionPressed,
      isBirthLunar,
      userName,
      birthday,
    });
  };

  const editUser = useMutation(editUserApi, {
    onSuccess: () => {
      navigation.goBack();
    },
  });

  /** set header right Button */
  const HeaderRight = () => (
    <HeaderRightBtn
      onPress={handleSubmit(onValid)}
      disabled={
        (me?.data.position === positionPressed &&
          me?.data.isBirthLunar === isBirthLunar &&
          me?.data.birthday.replace(/-/g, "").slice(0, 8) ===
            watch("birthday") &&
          me?.data.userName === watch("userName")) ||
        editUser.isLoading
      }
    >
      <Text style={{ color: "white", fontFamily: "nanum-regular" }}>수정</Text>
    </HeaderRightBtn>
  );

  useEffect(() => {
    navigation.setOptions({ headerRight: HeaderRight });
  }, [positionPressed, isBirthLunar, watch("userName"), watch("birthday")]);

  if (editUser.isLoading) {
    return (
      <ScreenLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          <ActivityIndicator
            style={{ alignItems: "center", justifyContent: "center" }}
          />
          <LoadingText>
            {"개인 정보를 수정 중입니다.\n잠시만 기다려주세요."}
          </LoadingText>
        </View>
      </ScreenLayout>
    );
  }

  if (isLoading) {
    return (
      <ScreenLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          <ActivityIndicator
            style={{ alignItems: "center", justifyContent: "center" }}
          />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <Wrapper>
            <Container>
              <TagText>이메일 ID</TagText>
              <PayloadContainer
                style={{ backgroundColor: Colors.borderLight, opacity: 0.5 }}
              >
                <PayloadText>{me.data.email}</PayloadText>
              </PayloadContainer>
            </Container>

            <Container>
              <TagText>이름</TagText>
              <PayloadContainer>
                <Controller
                  control={control}
                  name="userName"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      placeholder="이름을 입력해주세요."
                      maxLength={5}
                    />
                  )}
                  rules={{ required: { message: "이름을 입력해주세요" } }}
                />
              </PayloadContainer>
            </Container>

            <Container>
              <RowContainer style={{ alignItems: "flex-end" }}>
                <TagText style={{ flex: 1 }}>생년월일</TagText>
                <RowContainer
                  style={{
                    overflow: "hidden",
                    borderRadius: 15,
                    marginLeft: 10,
                    marginRight: 20,
                    backgroundColor: Colors.borderLight,
                  }}
                >
                  <LunarBtn
                    style={{
                      backgroundColor: isBirthLunar
                        ? Colors.borderLight
                        : Colors.main,
                    }}
                    onPress={() => setBirthLunar(!isBirthLunar)}
                  >
                    <LunarBtnText>양력</LunarBtnText>
                  </LunarBtn>
                  <LunarBtn
                    style={{
                      backgroundColor: isBirthLunar
                        ? Colors.main
                        : Colors.borderLight,
                    }}
                    onPress={() => setBirthLunar(!isBirthLunar)}
                  >
                    <LunarBtnText>음력</LunarBtnText>
                  </LunarBtn>
                </RowContainer>
              </RowContainer>
              <PayloadContainer>
                <Controller
                  control={control}
                  name="birthday"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      placeholder="생일 8자리 입력 (예: 19980924)"
                      maxLength={8}
                      keyboardType="number-pad"
                      style={{ flex: 1 }}
                    />
                  )}
                  rules={{
                    minLength: {
                      value: 8,
                      message: "생년월일 8자리를 입력해주세요.",
                    },
                    maxLength: 8,
                    required: true,
                  }}
                />
                {/* <PayloadText>
              {new Date(me.data.birthday).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </PayloadText> */}
              </PayloadContainer>
            </Container>

            <Container>
              <TagText>우리 가족에서 나는?</TagText>
              <InputContainer onPress={() => setPositionModal(true)}>
                <PayloadText
                  style={{
                    color:
                      positionPressed === "선택" ? Colors.borderDark : "black",
                  }}
                >
                  {positionPressed}
                </PayloadText>
              </InputContainer>
            </Container>

            <Modal
              isVisible={positionModal}
              onBackButtonPress={() => {
                setPositionModal(false);
              }}
              onBackdropPress={() => {
                setPositionModal(false);
              }}
              onSwipeComplete={() => {
                setPositionModal(false);
              }}
              swipeDirection="down"
              animationIn="fadeInUp"
              animationOut="fadeOutDown"
              backdropTransitionOutTiming={0}
              deviceHeight={pageHeight + StatusBar.currentHeight + 10}
              statusBarTranslucent
            >
              <ModalContainer>
                <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                  {positions.map((position, index) => (
                    <SelectionContainer
                      key={index}
                      onPress={() => {
                        setPosionPressed(position);
                        setPositionModal(false);
                      }}
                    >
                      <PayloadText style={{ flex: 1 }}>{position}</PayloadText>
                      {position === positionPressed && (
                        <Ionicons name="checkmark" size={15} />
                      )}
                    </SelectionContainer>
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    borderTopWidth: 0.3,
                    borderTopColor: Colors.borderDark,
                  }}
                >
                  <ConfirmModalBtn
                    onPress={() => {
                      setPositionModal(false);
                    }}
                  >
                    <ConfirmModalText>닫기</ConfirmModalText>
                    {/* <ConfirmModalText>완료</ConfirmModalText> */}
                  </ConfirmModalBtn>
                </View>
              </ModalContainer>
            </Modal>
          </Wrapper>
        </ScrollView>
      </TouchableWithoutFeedback>
    </ScreenLayout>
  );
}
