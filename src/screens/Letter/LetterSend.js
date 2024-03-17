import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { BGColors, Colors, EMOTION_KOREAN } from "../../Config";
import assetStore from "../../stores/AssetStore";
import { ROUTE_NAME } from "../../Strings";
import { Ionicons } from "@expo/vector-icons";
import Toast from "../../components/Toast";
import letterStore from "../../stores/LetterStore";
import Modal from "react-native-modal";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  Emotion,
  EmotionWrapper,
  ModalContainer,
} from "../../components/DailyEmotion";

import {
  Prompt,
  PromptText,
  SelectionContainer,
  TargetContainer,
} from "../../components/letter/Letter";

import { observer } from "mobx-react-lite";
import DismissKeyboard from "../../components/DismissKeyboard";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import {
  ConfirmModalBtn,
  ConfirmModalContainer,
  ConfirmModalText,
} from "../../components/DetailModal";
import Toggle from "../../components/Toggle";
import {
  Input,
  InputContainer,
  PayloadContainer,
  PayloadText,
} from "../Auth/SignUp";
import {
  DetailModalContainer,
  DetailModalRow,
  DetailModalText,
  EmotionImg,
  HeaderContainer,
  HeaderText,
} from "../../components/letter/Letter";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation, useQuery } from "@tanstack/react-query";
import { findMyFamilyApi, inviteFamilyApi } from "../../api/FamilyApi";
import familyStore from "../../stores/FamilyStore";
import { StartBtn, StartBtnText } from "../../components/letter/Letter";
import { RowContainer } from "../../components/Common";
import {
  deleteLetterApi,
  editLetterApi,
  sendLetterApi,
} from "../../api/LetterApi";
import { Animated } from "react-native";
import GuideModal from "../../components/Modals/GuideModal";
import InviteModal from "../../components/Invite";
import { INVITATION_URL } from "../../api/ApiConfig";

const LetterContainer = styled.View`
  padding: 20px;
`;

const LetterInput = styled.TextInput`
  font-family: "kangwon-font";
  font-size: 24px;
  line-height: 32px;
  margin: 0px 10px;
`;

const SendTarget = styled.TouchableOpacity`
  margin: 0px 3px;
  padding: 5px 10px;
  border-radius: 15px;
`;

function LetterSend({ navigation, route: { params } }) {
  const now = new Date();
  const dateString = `${now.getFullYear()}년 ${
    now.getMonth() + 1
  }월 ${now.getDate()}일`;

  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const [isTempSaved, setTempSaved] = useState(Boolean(params?.isTempSaved));
  const [isEdit, setEdit] = useState(Boolean(params?.isEdit));
  const [letterId, setLetterId] = useState(params?.letterId);

  /** useQuery */
  const { data: myFamily, isLoading: familyLoading } = useQuery(
    ["MyFamily", true],
    () => findMyFamilyApi(true),
    {
      onSuccess: ({ data }) => {
        const familyMembers = data?.users.map((user) => {
          return {
            id: user.id,
            name: familyStore.members[user.id] || user.userName,
          };
        });

        letterStore.setTargetsList(familyMembers);

        if (params?.targetId) {
          const idx = familyMembers.findIndex(
            (target) => target.id === params.targetId
          );

          if (idx !== -1) selectTargets(idx);
        }
      },
      enabled: letterStore.targetsList.length === 0,
    }
  );

  const [inviteLink, setInviteLink] = useState("");
  const [inviteModal, setInviteModal] = useState(false);
  const inviteFamily = useMutation(inviteFamilyApi, {
    onSuccess: (data) => {
      setInviteLink(`${INVITATION_URL}/?family=${data?.data.token}`);
    },
  });

  const createLetter = useMutation(sendLetterApi);
  const editLetter = useMutation(editLetterApi);
  const deleteLetter = useMutation(deleteLetterApi);

  const { width: pageWidth, height: pageHeight } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const [isTitleEditted, setTitleEditted] = useState(false);

  // for timeCapsule
  const [isTimeCapsule, setTimeCapsule] = useState(letterStore.isTimeCapsule);
  const [isTimeCapsuleModal, setTimeCapsuleModal] = useState(false);
  const [isDateModal, setDateModal] = useState(false);
  const [isTimeModal, setTimeModal] = useState(false);
  const [targetDateTime, setTargetDateTime] = useState(
    letterStore.isTimeCapsule ? letterStore.timeCapsuleTime : undefined
  );
  const [tempDateTime, setTempDateTime] = useState(
    letterStore.isTimeCapsule ? letterStore.timeCapsuleTime : new Date()
  );
  const [isConfirmPressed, setConfirmPressed] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isLetterInfoModal, setLetterInfoModal] = useState(false);
  const [isTargetModal, setTargetModal] = useState(false);
  const [defaultTimePressed, setDefaultTimePressed] = useState(false);
  const [onRoll, setOnRoll] = useState(false);

  const [isDetailModal, setDetailModal] = useState(false);

  const [isBirthGuide, setBirthGuide] = useState(false);

  // guide modal
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const defaultTitle = `사랑하는 ${
    letterStore.sendTargets.length === 0
      ? "OO"
      : letterStore.sendTargets.length === letterStore.targetsList.length
      ? "우리가족"
      : letterStore.sendTargets.map((target, index) =>
          index === 0
            ? letterStore.targetsList[target].name
            : " " + letterStore.targetsList[target].name
        )
  }에게`.slice(0, 18);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <TouchableOpacity
            style={{ paddingHorizontal: 7 }}
            onPress={() => {
              Keyboard.dismiss();
              setTimeCapsuleModal(true);
            }}
          >
            <Ionicons name="alarm-outline" size={24} />
          </TouchableOpacity>
          {!(isEdit && !isTempSaved) && (
            <TouchableOpacity
              style={{ paddingHorizontal: 8 }}
              onPress={() => setDetailModal(true)}
            >
              <Ionicons name="ellipsis-vertical" size={18} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.main,
              padding: 8,
              borderRadius: 5,
              marginLeft: 7,
              marginRight: 15,
              opacity:
                letterStore.sendTargets.length === 0 ||
                (isTimeCapsule && !targetDateTime) ||
                !letterStore.letterPayload
                  ? 0.5
                  : 1,
            }}
            disabled={
              letterStore.sendTargets.length === 0 ||
              (isTimeCapsule && !targetDateTime) ||
              !letterStore.letterPayload
            }
            onPress={() => {
              // 임시저장된 편지는 임시저장 record는 삭제

              const mutateParam = {
                title: letterStore.letterTitle || defaultTitle,
                payload: letterStore.letterPayload,
                emotion: letterStore.letterEmotion,
                isTemp: false,
                isTimeCapsule: isTimeCapsule,
                ...(isTimeCapsule && { receiveDate: targetDateTime }),
                receivers: letterStore.targetsList
                  .filter((target, index) =>
                    letterStore.sendTargets.includes(index)
                  )
                  .map((target) => target.id),
                ...(letterStore.theme && {
                  themeId: letterStore.theme?.id,
                }),
              };

              const onSuccess = (data) => {
                const result = data?.data;

                if (result?.ok) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        {
                          name: ROUTE_NAME.MAIN_TAB_NAV,
                          state: {
                            routes: [{ name: ROUTE_NAME.LETTER_HOME }],
                          },
                        },
                        {
                          name: ROUTE_NAME.LETTER_COMPLETED,
                          params: {
                            isTimeCapsule,
                            receiveDate: JSON.stringify(targetDateTime),
                            letterId: result?.id,
                            targetString: `${letterStore.sendTargets.map(
                              (target, index) =>
                                index === 0
                                  ? letterStore.targetsList[target].name
                                  : " " + letterStore.targetsList[target].name
                            )}`,
                          },
                        },
                      ],
                    })
                  );
                } else {
                  Toast({ message: "편지를 전송할 수 없습니다" });
                }
              };

              if (!isTempSaved) {
                if (isEdit) {
                  editLetter.mutate(
                    { id: letterId, ...mutateParam },
                    {
                      onSuccess,
                    }
                  );
                } else {
                  createLetter.mutate(mutateParam, {
                    onSuccess,
                  });
                }
              } else {
                deleteLetter.mutate({ id: letterId });

                createLetter.mutate(mutateParam, {
                  onSuccess,
                });
              }
            }}
          >
            <Text style={{ color: "white", fontFamily: "nanum-regular" }}>
              전송
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [
    isTimeCapsule,
    targetDateTime,
    letterStore.letterPayload,
    letterStore.sendTargets,
    isTitleEditted,
  ]);

  // reset mobx letter states
  useEffect(() => {
    if (params?.isBirth) {
      setBirthGuide(true);
      const birthday = new Date(params?.birthday);
      birthday.setHours(0);
      birthday.setMinutes(0);

      letterStore.setTimeCapsule(true);
      letterStore.setTimeCapsuleTime(birthday);
      setTimeCapsule(true);
      setTargetDateTime(birthday);
      setTempDateTime(birthday);
    }

    // guide fadeout
    setTimeout(() => {
      fadeOut();
      setBirthGuide(false);
    }, 7000);

    return () => {
      letterStore.resetLetter();
    };
  }, []);

  if (familyLoading || createLetter.isLoading || editLetter.isLoading) {
    return (
      <ScreenLayout safeAreaColor={BGColors[letterStore.letterEmotion]}>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout safeAreaColor={BGColors[letterStore.letterEmotion]}>
      <DismissKeyboard>
        <>
          <EmotionImg
            source={{
              uri: assetStore.messageEmotions[letterStore.letterEmotion],
            }}
            resizeMode="contain"
          />

          <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={40} // only affect IOS
            extraHeight={-200}
            keyboardShouldPersistTaps="handled"
            enableResetScrollToCoords={false}
          >
            <View>
              <View style={{ backgroundColor: "white", paddingHorizontal: 10 }}>
                <Prompt style={{ marginTop: 0 }}>
                  <RowContainer>
                    <PromptText>받는 사람</PromptText>
                    {letterStore.sendTargets.length === 0 && (
                      <View
                        style={{
                          backgroundColor: Colors.balanceA,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 10,
                          padding: 2,
                          marginHorizontal: 5,
                        }}
                      >
                        <Ionicons name="alert" color={Colors.white} size={10} />
                      </View>
                    )}
                  </RowContainer>
                </Prompt>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    marginHorizontal: 15,
                    paddingVertical: 10,
                  }}
                  keyboardShouldPersistTaps="handled"
                >
                  {letterStore.targetsList.length === 0 ? (
                    <SendTarget
                      onPress={() => {
                        inviteFamily.mutate();
                        setInviteModal(!inviteModal);
                      }}
                      style={{
                        backgroundColor: Colors.borderLight,
                      }}
                    >
                      <PayloadText>
                        가족을 초대해서 편지를 전해 보아요
                      </PayloadText>
                    </SendTarget>
                  ) : (
                    letterStore.targetsList.map((target, index) => (
                      <SendTarget
                        key={index}
                        onPress={() => {
                          selectTargets(index);
                          // setTargetModal(false);
                        }}
                        style={{
                          backgroundColor: letterStore.sendTargets.includes(
                            index
                          )
                            ? Colors.main
                            : Colors.borderLight,
                        }}
                      >
                        <PayloadText>{target.name}</PayloadText>
                      </SendTarget>
                    ))
                  )}
                </ScrollView>

                <Prompt style={{ marginTop: 0 }}>
                  <PromptText>편지지 선택</PromptText>
                </Prompt>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{ paddingVertical: 10 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {Object.keys(EMOTION_KOREAN).map((emotion) => (
                    <EmotionWrapper key={emotion}>
                      <TouchableOpacity
                        onPress={() => {
                          // chooseEmotion(emotion);
                          letterStore.setLetterEmotion(emotion);
                          Keyboard.dismiss();
                        }}
                      >
                        <Emotion
                          source={{ uri: assetStore.emotionsRound[emotion] }}
                          style={
                            letterStore.letterEmotion !== emotion && {
                              borderColor: "rgba(0, 0, 0, 0.1)",
                            }
                          }
                          // pageWidth={pageWidth + 20}
                          pageWidth={pageWidth - 30}
                        />
                      </TouchableOpacity>
                    </EmotionWrapper>
                  ))}
                </ScrollView>
              </View>

              <LetterContainer>
                <HeaderContainer>
                  <TextInput
                    value={letterStore.letterTitle}
                    onChangeText={(text) => {
                      letterStore.setLetterTitle(text);
                    }}
                    onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                      if (!isTitleEditted) setTitleEditted(true);
                    }}
                    // placeholder={`편지 제목`}
                    placeholder={defaultTitle}
                    maxLength={18}
                    style={{
                      flex: 1,
                      fontFamily: "kangwon-font",
                      fontSize: 24,
                      marginHorizontal: 10,
                    }}
                    allowFontScaling={false}
                  />

                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={() => setDeleteModal(true)}
                  >
                    <Ionicons name="trash-outline" size={22} />
                  </TouchableOpacity>
                </HeaderContainer>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderColor: Colors.borderDark,
                    width: "100%",
                    height: 10,
                    marginBottom: 10,
                  }}
                />

                <LetterInput
                  value={letterStore.letterPayload}
                  onChangeText={(text) => {
                    letterStore.setLetterPayload(text);
                  }}
                  textAlignVertical="top"
                  multiline={true}
                  allowFontScaling={false}
                  style={{
                    minHeight: (pageWidth * 4) / 3,
                  }}
                  maxLength={1000}
                  placeholder="마음을 담은 편지를 작성해주세요"
                />
              </LetterContainer>
            </View>
          </KeyboardAwareScrollView>

          {params?.isBirth && targetDateTime && (
            <Animated.View
              style={[
                { position: "absolute", right: 15, top: 0 },
                { opacity: fadeAnim },
              ]}
            >
              <GuideModal
                onPress={() => {
                  fadeAnim.setValue(0);
                  setBirthGuide(false);
                  setTimeCapsuleModal(true);
                }}
                arrowLeft={50}
                pressDisabled={!isBirthGuide}
                payload={`${
                  targetDateTime.getMonth() + 1
                }월 ${targetDateTime.getDate()}일 ${`${targetDateTime.getHours()}`.padStart(
                  2,
                  "0"
                )}:${`${targetDateTime.getMinutes()}`.padStart(2, "0")} 공개`}
                color={Colors.sub}
              />
            </Animated.View>
          )}
        </>
      </DismissKeyboard>

      <Modal
        isVisible={isTimeCapsuleModal && !isDateModal && !isTimeModal}
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => {
          setTimeCapsuleModal(false);
        }}
        onBackdropPress={() => {
          setTimeCapsuleModal(false);
        }}
        onSwipeComplete={() => {
          setTimeCapsuleModal(false);
        }}
        swipeDirection="down"
        onModalHide={() => {
          if (isConfirmPressed) {
            setDateModal(true);
            setConfirmPressed(false);
          } else if (defaultTimePressed) {
            setTimeModal(true);
            setDefaultTimePressed(false);
          } else {
            if (!targetDateTime) {
              setTimeCapsule(false);
            }
          }
        }}
        animationIn="fadeInUp"
        animationOut="fadeOut"
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <ModalContainer>
          <View
            style={{
              width: "100%",
              paddingHorizontal: 20,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <Prompt>
              <PromptText>타임캡슐 설정</PromptText>
            </Prompt>
            <View style={{ alignItems: "flex-start" }}>
              <Toggle
                toggleState={isTimeCapsule}
                toggleFunc={setTimeCapsule}
                unFocusedColor={Colors.borderLight}
                textA="지금 전송"
                textB="타임캡슐"
              />
            </View>

            <Prompt>
              <PromptText>공개날짜 선택</PromptText>
            </Prompt>
            <SelectionContainer
              style={{ borderColor: Colors.borderLight, borderWidth: 1 }}
              onPress={() => {
                setTimeCapsule(true);
                setTimeCapsuleModal(false);
                setConfirmPressed(true);
              }}
            >
              <PayloadText>
                {!isTimeCapsule
                  ? "지금 전송"
                  : targetDateTime
                  ? `${targetDateTime.getFullYear()}년 ${
                      targetDateTime.getMonth() + 1
                    }월 ${targetDateTime.getDate()}일 `
                  : "날짜 선택"}
              </PayloadText>
            </SelectionContainer>
            {isTimeCapsule && (
              <TouchableOpacity
                onPress={() => {
                  setTimeCapsuleModal(false);
                  setDefaultTimePressed(true);
                }}
              >
                <RowContainer
                  style={{
                    paddingHorizontal: 15,
                    marginLeft: 15,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "nanum-bold",
                      fontSize: 13,
                      color: "#3d6acb",
                    }}
                  >
                    {targetDateTime
                      ? `공개시간: ${String(targetDateTime.getHours()).padStart(
                          2,
                          "0"
                        )}시 ${String(targetDateTime.getMinutes()).padStart(
                          2,
                          "0"
                        )}분`
                      : `공개시간: 08시 00분`}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={"#3d6acb"}
                  />
                </RowContainer>
              </TouchableOpacity>
            )}
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
                Keyboard.dismiss();
                setTimeCapsuleModal(false);
              }}
            >
              <ConfirmModalText>닫기</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ModalContainer>
      </Modal>

      <Modal
        isVisible={
          !isTimeCapsuleModal && isDateModal && !isTimeModal && isTimeCapsule
        }
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => setDateModal(false)}
        // onBackdropPress={() => {
        //   setDateModal(false);
        // }}
        // onSwipeComplete={() => {
        //   setDateModal(false);
        // }}
        // swipeDirection="down"
        onModalHide={() => {
          if (!isConfirmPressed) {
            setTempDateTime(targetDateTime ? targetDateTime : new Date());
          }
          setTimeCapsuleModal(true);

          setConfirmPressed(false);

          // if (!targetDateTime) {
          //   setTimeCapsule(false);
          // }
        }}
        animationIn="fadeInUp"
        animationOut="fadeOut"
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <ModalContainer>
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <TouchableWithoutFeedback onPress={() => setOnRoll(true)}>
              <DatePicker
                date={tempDateTime}
                onDateChange={(date) => {
                  date.setSeconds(0);
                  setTempDateTime(date);
                  setOnRoll(false);
                }}
                mode="date"
                minimumDate={new Date()}
                maximumDate={oneYearLater}
                androidVariant="nativeAndroid"
                // androidVariant="iosClone"
                timeZoneOffsetInMinutes={9 * 60}
                textColor={"#000000"}
                locale="ko"
              />
            </TouchableWithoutFeedback>
            <RowContainer>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                style={{ marginRight: 5 }}
              />
              <PayloadText>1년 뒤 오늘까지 선택할 수 있습니다</PayloadText>
            </RowContainer>
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
                setDateModal(false);
              }}
            >
              <ConfirmModalText>취소</ConfirmModalText>
            </ConfirmModalBtn>
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              disabled={onRoll}
              onPress={() => {
                setConfirmPressed(true);
                // setTargetDateTime(tempDateTime);
                if (!targetDateTime) {
                  tempDateTime.setHours(8);
                  tempDateTime.setMinutes(0);
                }
                setTargetDateTime(tempDateTime);
                setDateModal(false);
              }}
            >
              <ConfirmModalText>확인</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ModalContainer>
      </Modal>

      <Modal
        isVisible={
          !isTimeCapsuleModal && !isDateModal && isTimeModal && isTimeCapsule
        }
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => setTimeModal(false)}
        // onBackdropPress={() => {
        //   setTimeModal(false);
        // }}
        // onSwipeComplete={() => {
        //   setTimeModal(false);
        // }}
        // swipeDirection="down"
        onModalHide={() => {
          if (!isConfirmPressed) {
            setTempDateTime(targetDateTime ? targetDateTime : new Date());
          }
          setTimeCapsuleModal(true);
          setConfirmPressed(false);
        }}
        animationIn="fadeInUp"
        animationOut="fadeOut"
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <ModalContainer>
          <View style={{ paddingVertical: 30 }}>
            <TouchableWithoutFeedback onPress={() => setOnRoll(true)}>
              <DatePicker
                date={tempDateTime}
                onDateChange={(date) => {
                  setTempDateTime(date);
                  setOnRoll(false);
                }}
                mode="time"
                minimumDate={new Date()}
                androidVariant="nativeAndroid"
                // androidVariant="iosClone"
                timeZoneOffsetInMinutes={9 * 60}
                textColor={"#000000"}
                locale="ko"
                minuteInterval={30}
              />
            </TouchableWithoutFeedback>
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
                setTimeModal(false);
              }}
            >
              <ConfirmModalText>취소</ConfirmModalText>
            </ConfirmModalBtn>
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              disabled={onRoll}
              onPress={() => {
                setConfirmPressed(true);
                setTargetDateTime(tempDateTime);
                setTimeModal(false);
              }}
            >
              <ConfirmModalText>확인</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ModalContainer>
      </Modal>

      <Modal
        isVisible={isDeleteModal}
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => {
          setDeleteModal(false);
        }}
        onBackdropPress={() => {
          setDeleteModal(false);
        }}
        onSwipeComplete={() => {
          setDeleteModal(false);
        }}
        swipeDirection="down"
        animationIn="fadeInUp"
        animationOut="fadeOut"
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <ConfirmModalContainer>
          <View style={{ padding: 30 }}>
            <ConfirmModalText>
              {"작성한 내용을 삭제하시겠습니까?"}
            </ConfirmModalText>
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
                setDeleteModal(false);
              }}
            >
              <ConfirmModalText>취소</ConfirmModalText>
            </ConfirmModalBtn>
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              onPress={() => {
                letterStore.setLetterPayload("");
                letterStore.setLetterTitle("");
                setDeleteModal(false);
              }}
            >
              <ConfirmModalText>확인</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ConfirmModalContainer>
      </Modal>

      <Modal
        isVisible={isLetterInfoModal}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => {
          Keyboard.dismiss();
          setLetterInfoModal(false);
        }}
        onBackButtonPress={() => {
          Keyboard.dismiss();
          setLetterInfoModal(false);
        }}
        onSwipeComplete={() => {
          Keyboard.dismiss();
          setLetterInfoModal(false);
        }}
        onModalHide={() => {
          if (isConfirmPressed) {
            setTargetModal(true);
          }
          setConfirmPressed(false);
        }}
        // swipeDirection="down"
        animationIn="fadeInUp"
        animationOut="fadeOut"
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <ModalContainer>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              <Prompt>
                <PromptText>받는 사람</PromptText>
              </Prompt>
              <InputContainer
                onPress={() => {
                  Keyboard.dismiss();
                  setConfirmPressed(true);
                  setLetterInfoModal(false);
                }}
                disabled={isEdit && !isTempSaved}
                style={
                  isEdit &&
                  !isTempSaved && {
                    backgroundColor: Colors.borderLight,
                    opacity: 0.5,
                  }
                }
              >
                <PayloadText numberOfLines={1} ellipsizeMode="tail">
                  {letterStore.sendTargets.length === 0
                    ? "선택"
                    : letterStore.sendTargets.length === 1
                    ? letterStore.targetsList[letterStore.sendTargets[0]].name
                    : `${letterStore.sendTargets.map((target, index) =>
                        index === 0
                          ? letterStore.targetsList[target].name
                          : " " + letterStore.targetsList[target].name
                      )}`}
                </PayloadText>
              </InputContainer>

              <Prompt>
                <PromptText>제목</PromptText>
              </Prompt>
              <PayloadContainer>
                <Input
                  value={letterStore.letterTitle}
                  onChangeText={(text) => {
                    letterStore.setLetterTitle(text);
                  }}
                  placeholder={`# ${dateString}, ${
                    letterStore.sendTargets.length === 0
                      ? "OO"
                      : letterStore.sendTargets.map((target, index) =>
                          index === 0
                            ? letterStore.targetsList[target].name
                            : " " + letterStore.targetsList[target].name
                        )
                  } 님에게 쓰는 편지`}
                  maxLength={30}
                />
              </PayloadContainer>
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
                  Keyboard.dismiss();
                  setLetterInfoModal(false);
                }}
              >
                <ConfirmModalText>닫기</ConfirmModalText>
              </ConfirmModalBtn>
            </View>
          </ModalContainer>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        isVisible={isTargetModal}
        // onBackButtonPress={() => setTargetModal(false)}
        // onSwipeComplete={() => setTargetModal(false)}
        // onBackdropPress={() => setTargetModal(false)}
        // swipeDirection="down"
        onModalHide={() => setLetterInfoModal(true)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <ModalContainer>
          <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
            {letterStore.targetsList.map((target, index) => (
              <TargetContainer
                key={index}
                onPress={() => {
                  selectTargets(index);
                  // setTargetModal(false);
                }}
              >
                <PayloadText style={{ flex: 1 }}>{target.name}</PayloadText>
                {letterStore.sendTargets.includes(index) && (
                  <Ionicons name="checkmark" size={15} />
                )}
              </TargetContainer>
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
                setTargetModal(false);
              }}
            >
              <ConfirmModalText>완료</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ModalContainer>
      </Modal>

      <Modal
        isVisible={isDetailModal}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => {
          setDetailModal(false);
        }}
        onBackButtonPress={() => setDetailModal(false)}
        onModalHide={() => {}}
        backdropOpacity={0}
        animationIn="fadeIn"
        animationOut="fadeOut"
        statusBarTranslucent
        style={{ position: "absolute", top: headerHeight, right: 0 }}
      >
        <DetailModalContainer>
          <DetailModalRow
            style={{ opacity: isEdit && !isTempSaved ? 0.5 : 1 }}
            disabled={isEdit && !isTempSaved}
            onPress={() => {
              setDetailModal(false);

              const mutateParam = {
                title: letterStore.letterTitle,
                payload: letterStore.letterPayload,
                emotion: letterStore.letterEmotion,
                isTimeCapsule: isTimeCapsule,
                ...(isTimeCapsule && { receiveDate: targetDateTime }),
                receivers: [-1],
                ...(letterStore.theme && {
                  themeId: letterStore.theme?.id,
                }),
                isTemp: true,
              };

              const onSuccess = (data) => {
                const result = data?.data;

                if (result?.ok) {
                  setEdit(true);
                  setLetterId(result?.id);
                  setTempSaved(true);
                  Toast({ message: "임시 저장되었습니다" });
                }
              };

              if (!isTempSaved && !isEdit) {
                createLetter.mutate(mutateParam, {
                  onSuccess,
                });
              } else if (isTempSaved) {
                editLetter.mutate(
                  {
                    id: letterId,
                    ...mutateParam,
                  },
                  { onSuccess }
                );
              }
            }}
          >
            <DetailModalText>임시 저장</DetailModalText>
          </DetailModalRow>
        </DetailModalContainer>
      </Modal>

      <InviteModal
        inviteModal={inviteModal}
        inviteLink={inviteLink}
        setInviteModal={setInviteModal}
      />
    </ScreenLayout>
  );
}

export default observer(LetterSend);

const selectTargets = (targetIndex) => {
  letterStore.sendTargets.includes(targetIndex)
    ? letterStore.setSendTargets(
        letterStore.sendTargets.filter((target) => target !== targetIndex)
      )
    : letterStore.setSendTargets([...letterStore.sendTargets, targetIndex]);
  // switch (targetIndex) {
  //   // case 0:
  //   //   letterStore.sendTargets.includes(targetIndex)
  //   //     ? letterStore.setSendTargets([])
  //   //     : letterStore.setSendTargets([0]);

  //   //   break;
  //   case 0:
  //     letterStore.sendTargets.length === letterStore.targetsList.length - 2
  //       ? letterStore.setSendTargets([])
  //       : letterStore.setSendTargets(
  //           Object.keys(letterStore.targetsList)
  //             .slice(1)
  //             .map((item) => parseInt(item))
  //         );

  //     break;

  //   default:
  //     letterStore.sendTargets.includes(targetIndex)
  //       ? letterStore.setSendTargets(
  //           letterStore.sendTargets.filter(
  //             (target) => target !== targetIndex && target !== 0
  //           )
  //         )
  //       : letterStore.setSendTargets([
  //           ...letterStore.sendTargets.filter((target) => target !== 0),
  //           targetIndex,
  //         ]);
  //     break;
  // }
};
