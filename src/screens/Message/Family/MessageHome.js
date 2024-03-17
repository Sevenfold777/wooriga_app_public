import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  AppState,
  DeviceEventEmitter,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import {
  deleteKeepMessageFamApi,
  deleteMetooMessageFamApi,
  findMessageFamilyTodayAllApi,
  findMessageFamilyTodayApi,
  findMessageLatestApi,
  keepMessageFamApi,
  metooMessageFamApi,
} from "../../../api/MessageApi";
import Message from "../../../components/message/Message";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../../components/ScreenLayout";
import { Ionicons, Octicons } from "@expo/vector-icons";
import RNKakaoAdfit, { KakaoAdfit } from "../../../components/RNKakaoAdfit";
import NoMessage from "../../../components/message/NoMessage";
import { ROUTE_NAME, ServiceLinked } from "../../../Strings";
import { BGColors, Colors } from "../../../Config";
import { findBannersBarApi } from "../../../api/BannerApi";
import BannerBar from "../../../components/BannerBar";
import Modal from "react-native-modal";
import DailyEmotion, { ModalContainer } from "../../../components/DailyEmotion";
import { useHeaderHeight } from "@react-navigation/elements";
import Permissions from "../../../components/Permissions";
import { inviteFamilyApi } from "../../../api/FamilyApi";
import InviteModal from "../../../components/Invite";
import { observer } from "mobx-react-lite";
import familyStore from "../../../stores/FamilyStore";
import InviteMessage from "../../../components/message/InviteMessage";
import { INVITATION_URL } from "../../../api/ApiConfig";
import {
  ConfirmModalBtn,
  ConfirmModalText,
} from "../../../components/DetailModal";
import Tutorial from "../../../components/Tutorial";
import { checkLatestVersion, versionCompare } from "../../../helper";
import UpdateModal from "../../../components/Modals/UpdateModal";
import DeviceInfo from "react-native-device-info";
import authStore from "../../../stores/AuthStore";
import GuideModal from "../../../components/Modals/GuideModal";
import emotionStore from "../../../stores/EmotionStore";
import { RowContainer } from "../../../components/Common";

const MenuContainer = styled.View`
  padding: 30px 10px 0px 10px;
  flex-direction: row;
  align-items: flex-start;
  background-color: ${Colors.white};
  border-radius: 5px;
  //margin-bottom: 10px;
`;

const Menu = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 100px;
  margin: 0px 10px 10px 10px;
`;

const MenuImage = styled.Image`
  border-radius: 100px;
  border: 2px solid rgba(0, 0, 0, 0.2);
`;

const MenuTitle = styled.Text`
  text-align: center;
  font-size: 12px;
  padding: 10px 0px;
  letter-spacing: -1px;
  font-family: "nanum-regular";
  //font-family: "nanum-bold";
`;

const MessageWrapper = styled.TouchableWithoutFeedback``;

const SendMessageBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  border-radius: 10px;
  padding: 8px 15px;
`;

const SendMessageText = styled.Text`
  text-align: center;
  color: white;
  font-family: "nanum-bold";
`;

const TitleContainer = styled.View`
  padding: 5px 7px;
  flex-direction: row;
  align-items: center;
`;

const TitleText = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
  padding: 15px 8px;
`;

function MessageHome({ navigation, route: { params } }) {
  const now = new Date().getTime();

  const { width: pageWidth, height: pageHeight } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const [isTutorial, setTutorial] = useState(false);
  const [isUpdateModal, setUpdateModal] = useState(false);

  /** react-query */
  const {
    data: bannersBar,
    isLoading: bannersBarLoading,
    refetch: refetchBars,
  } = useQuery(["BannersBar", ROUTE_NAME.MESSAGE_HOME], () =>
    findBannersBarApi({ screen: ROUTE_NAME.MESSAGE_HOME })
  );

  const {
    data: message,
    isLoading: messageLoading,
    refetch: refetchMessage,
  } = useQuery(["MessageLatest"], findMessageLatestApi);

  // 5-1. metoo Message
  const metooMessage = useMutation(metooMessageFamApi);

  // 5-2. quit metoo Message
  const deleteMetooMessage = useMutation(deleteMetooMessageFamApi);

  /** function: toggle metoo */
  const toggleMetoo = (id, isMetoo) => {
    isMetoo ? deleteMetooMessage.mutate(id) : metooMessage.mutate(id);
    // metoo ? setMetoosCnt(metoosCnt - 1) : setMetoosCnt(metoosCnt + 1);
    // setMetoo(!metoo);
  };

  // 5-1. keep Message
  const keepMessage = useMutation(keepMessageFamApi);

  // 5-2. quit keep Message
  const deleteKeepMessage = useMutation(deleteKeepMessageFamApi);

  // /** function: toggle keep */
  const toggleKeep = (id, isKept) => {
    isKept ? deleteKeepMessage.mutate(id) : keepMessage.mutate(id);
    // setKept(!kept);
  };

  const [inviteModal, setInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const inviteFamily = useMutation(inviteFamilyApi, {
    onSuccess: (data) => {
      setInviteLink(`${INVITATION_URL}/?family=${data?.data.token}`);
    },
  });

  // guide modal
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const headerRightAnim = useRef(new Animated.Value(1)).current;
  const headerRightSpring = (iter = 1) => {
    const animSeq = [];
    for (let i = 0; i < iter; i++) {
      animSeq.push(
        ...[
          Animated.spring(headerRightAnim, {
            toValue: 1.12,
            friction: 1,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.spring(headerRightAnim, {
            toValue: 1,
            speed: 50,
            useNativeDriver: true,
          }),
        ]
      );
    }

    Animated.sequence(animSeq).start();
  };

  useEffect(() => {
    setTimeout(() => {
      headerRightSpring(2);
    }, 500);
  }, []);

  /** refetch everytime onfocus */
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await refetchMessage();
    });

    return unsubscribe;
  }, [navigation]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    inviteFamily.mutate();

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await refetchMessage();
        }

        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, []);

  // const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => setTutorial(true)}>
            <Ionicons
              name="help-circle-outline"
              size={26}
              color={Colors.borderDark}
              style={{ paddingHorizontal: 7 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTE_NAME.NOTIFICATIONS)}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              style={{ paddingHorizontal: 8 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ROUTE_NAME.MESSAGES_PAST);
            }}
          >
            <Octicons
              name="history"
              size={21}
              style={{ paddingRight: 15, paddingLeft: 7 }}
            />
          </TouchableOpacity>
        </View>
      ),
    });

    // guide fadeout
    setTimeout(() => {
      fadeOut();
    }, 7000);
  }, []);

  useEffect(() => {
    const checkNeedUpdate = async () => {
      const myVersion = DeviceInfo.getVersion();
      const latestVersion = await checkLatestVersion();

      if (versionCompare(myVersion, latestVersion)) {
        setUpdateModal(
          !inviteModal &&
            !isTutorial &&
            !params?.openEmotionSelection &&
            authStore.permissionsChecked
        );
      }
    };

    checkNeedUpdate();
  }, []);

  if (messageLoading || !bannersBar?.data) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <DailyEmotion isTitle={false} />

        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(ROUTE_NAME.MESSAGES_PAST)}
        >
          <RowContainer>
            <TitleContainer style={{ flex: 1 }}>
              <TitleText>오늘의 이야기</TitleText>
            </TitleContainer>

            {[
              ServiceLinked.LETTER,
              ServiceLinked.PEDIA,
              ServiceLinked.PHOTO,
            ].includes(message?.data?.linkTo) && (
              <Animated.View
                style={{ transform: [{ scale: headerRightAnim }] }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.main,
                    padding: 10,
                    marginHorizontal: 15,
                    borderRadius: 10,
                  }}
                  onPress={() =>
                    navigation.navigate(
                      message?.data?.linkTo === ServiceLinked.LETTER
                        ? ROUTE_NAME.LETTER_SEND
                        : message?.data?.linkTo === ServiceLinked.PHOTO
                        ? ROUTE_NAME.PHOTO_SELECT
                        : ROUTE_NAME.FAMILYPEDIA_HOME
                    )
                  }
                >
                  <Text style={{ fontFamily: "nanum-regular", color: "white" }}>
                    {message?.data?.linkTo === ServiceLinked.LETTER
                      ? "편지 보내기"
                      : message?.data?.linkTo === ServiceLinked.PHOTO
                      ? "사진 올리기"
                      : "인물사전"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </RowContainer>
        </TouchableWithoutFeedback>

        {familyStore.inviteNeeded ? (
          <InviteMessage inviteLink={inviteLink} />
        ) : !message.data ? (
          <NoMessage />
        ) : (
          <Message
            id={message.data.id}
            payload={message.data.payload}
            emotion={message.data.emotion}
            commentsCount={message.data.commentsCount}
            metoosCount={message.data.metoosCount}
            isMetoo={message.data.isMetooed}
            isKept={message.data.isKept}
            toggleMetoo={toggleMetoo}
            toggleKeep={toggleKeep}
            onLastPage={headerRightSpring}
          />
        )}

        <BannerBar
          width={pageWidth}
          url={bannersBar.data[now % bannersBar.data.length].url}
          payloadType={
            bannersBar.data[now % bannersBar.data.length].payloadType
          }
          payloadPath={
            bannersBar.data[now % bannersBar.data.length].payloadPath
          }
          description={
            bannersBar.data[now % bannersBar.data.length].description
          }
        />

        {/* <KakaoAdfit /> */}

        <Permissions />

        {!emotionStore.emotionChosen && message.data.linkTo === "none" && (
          <Animated.View
            style={[
              { position: "absolute", left: 15, top: 100 },
              { opacity: fadeAnim },
            ]}
          >
            <GuideModal
              // payload="우리가족에게 내 기분을 알려주세요!"
              payload="가족들에게 내 기분을 알려주세요!"
              color={Colors.sub}
            />
          </Animated.View>
        )}
      </ScrollView>

      <Modal
        isVisible={isTutorial}
        onBackButtonPress={() => setTutorial(false)}
        onBackdropPress={() => setTutorial(false)}
        onSwipeComplete={() => setTutorial(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <ModalContainer>
          <View
            style={{
              paddingTop: 5,
              paddingHorizontal: 10,
            }}
          >
            <TitleContainer
              style={{ marginVertical: 10, marginHorizontal: 15 }}
            >
              <Text style={{ fontFamily: "nanum-bold", fontSize: 16 }}>
                우리가 소개
              </Text>
            </TitleContainer>
            <Tutorial width={pageWidth - 40} />
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
                setTutorial(false);
              }}
            >
              <ConfirmModalText>닫기</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ModalContainer>
      </Modal>

      <UpdateModal isVisible={isUpdateModal} setVisible={setUpdateModal} />
    </ScreenLayout>
  );
}

export default observer(MessageHome);
