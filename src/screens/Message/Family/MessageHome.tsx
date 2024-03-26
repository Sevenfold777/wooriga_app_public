import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  AppState,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {
  deleteKeepMessageFamApi,
  findMessageLatestApi,
  keepMessageFamApi,
} from '../../../api/MessageApi';
import Message from '../../../components/message/Message';
import ScreenLayout from '../../../components/ScreenLayout';
import {Ionicons, Octicons} from '@expo/vector-icons';
import NoMessage from '../../../components/message/NoMessage';
import {ROUTE_NAME, ServiceLinked} from '../../../Strings';
import {Colors} from '../../../Config';
import {findBannersBarApi} from '../../../api/BannerApi';
import BannerBar from '../../../components/BannerBar';
import Modal from 'react-native-modal';
import DailyEmotion, {ModalContainer} from '../../../components/DailyEmotion';
import Permissions from '../../../components/Permissions';
import {inviteFamilyApi} from '../../../api/FamilyApi';
import {observer} from 'mobx-react-lite';
import familyStore from '../../../stores/FamilyStore';
import InviteMessage from '../../../components/message/InviteMessage';
import {INVITATION_URL} from '../../../api/ApiConfig';
import {
  ConfirmModalBtn,
  ConfirmModalText,
} from '../../../components/DetailModal';
import Tutorial from '../../../components/Tutorial';
import {checkLatestVersion, versionCompare} from '../../../helper';
import UpdateModal from '../../../components/Modals/UpdateModal';
import DeviceInfo from 'react-native-device-info';
import authStore from '../../../stores/AuthStore';
import GuideModal from '../../../components/Modals/GuideModal';
import emotionStore from '../../../stores/EmotionStore';
import {
  MainTabScreenProps,
  SignedInScreenProps,
} from '../../../navigators/types';
import {RowContainer} from '../../../components/common/Common';

const TitleContainer = styled.View`
  padding: 5px 7px;
  flex-direction: row;
  align-items: center;
`;

const TitleText = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
  padding: 15px 8px;
`;

const SpringBtn = styled.TouchableOpacity`
  background-color: ${Colors.main};
  padding: 10px;
  margin: 0px 15px;
  border-radius: 10px;
`;

const SpringBtnText = styled.Text`
  font-family: 'nanum-regular';
  color: white;
`;

function MessageHome({
  navigation,
  route: {params},
}: MainTabScreenProps<'MessageHome'>) {
  const now = new Date().getTime();

  const {width: pageWidth, height: pageHeight} = useWindowDimensions();

  /** react-query */
  const {data: bannersBar, isLoading: bannersBarLoading} = useQuery(
    ['BannersBar', ROUTE_NAME.MESSAGE_HOME],
    () => findBannersBarApi({screen: ROUTE_NAME.MESSAGE_HOME}),
  );

  /** Fetch Today's Message */
  const {
    data: message,
    isLoading: messageLoading,
    refetch: refetchMessage,
  } = useQuery(['MessageLatest'], findMessageLatestApi);

  /** refetch everytime onfocus */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await refetchMessage();
    });

    return unsubscribe;
  }, []);

  /** keep Message */
  const keepMessage = useMutation(keepMessageFamApi);
  const deleteKeepMessage = useMutation(deleteKeepMessageFamApi);
  const toggleKeep = (id: number, isKept: boolean) => {
    isKept ? deleteKeepMessage.mutate(id) : keepMessage.mutate(id);
    // setKept(!kept);
  };

  /** invite family */
  const [inviteLink, setInviteLink] = useState('');
  const inviteFamily = useMutation(inviteFamilyApi, {
    onSuccess: data => {
      setInviteLink(`${INVITATION_URL}/?family=${data?.data.token}`);
    },
  });

  /** some states for modals (=> recommendations) */

  const [isUpdateModal, setUpdateModal] = useState(false);

  // 1. tutorial modal
  const [isTutorial, setTutorial] = useState(false);

  useEffect(() => {
    const checkNeedUpdate = async () => {
      const myVersion = DeviceInfo.getVersion();
      const latestVersion = await checkLatestVersion();

      if (versionCompare(myVersion, latestVersion)) {
        setUpdateModal(
          !isTutorial &&
            !params?.openEmotionSelection &&
            authStore.permissionsChecked,
        );
      }
    };

    checkNeedUpdate();
  }, []);

  // recommend to select daily emotion (animation = fade in 7 senconds)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  // recommned to upload photo or to send letter (using data from the message fetched)
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
        ],
      );
    }

    Animated.sequence(animSeq).start();
  };

  useEffect(() => {
    // daily emotion guide
    setTimeout(() => {
      fadeOut();
    }, 7000);

    //
    setTimeout(() => {
      headerRightSpring(2);
    }, 500);
  }, []);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    inviteFamily.mutate();

    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          await refetchMessage();
        }

        appState.current = nextAppState;
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <RowContainer>
          <TouchableOpacity onPress={() => setTutorial(true)}>
            <Ionicons
              name="help-circle-outline"
              size={26}
              color={Colors.borderDark}
              style={{paddingHorizontal: 7}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push('Notifications')}>
            <Ionicons
              name="notifications-outline"
              size={24}
              style={{paddingHorizontal: 8}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.push('MessagePast');
            }}>
            <Octicons
              name="history"
              size={21}
              style={{paddingRight: 15, paddingLeft: 7}}
            />
          </TouchableOpacity>
        </RowContainer>
      ),
    });
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
          onPress={() => navigation.push('MessagePast')}>
          <RowContainer>
            <TitleContainer style={{flex: 1}}>
              <TitleText>오늘의 이야기</TitleText>
            </TitleContainer>

            {[
              ServiceLinked.LETTER,
              ServiceLinked.PEDIA,
              ServiceLinked.PHOTO,
            ].includes(message?.data?.linkTo) ? (
              <Animated.View style={{transform: [{scale: headerRightAnim}]}}>
                <SpringBtn
                  onPress={() =>
                    navigation.push(
                      message?.data?.linkTo === ServiceLinked.LETTER
                        ? 'LetterSend'
                        : message?.data?.linkTo === ServiceLinked.PHOTO
                        ? 'PhotoSelect'
                        : 'FamilyPediaMember', // TODO: params? - complete after family pedia renewal
                    )
                  }>
                  <SpringBtnText>
                    {message?.data?.linkTo === ServiceLinked.LETTER
                      ? '편지 보내기'
                      : message?.data?.linkTo === ServiceLinked.PHOTO
                      ? '사진 올리기'
                      : '인물사전'}
                  </SpringBtnText>
                </SpringBtn>
              </Animated.View>
            ) : (
              <></>
            )}
          </RowContainer>
        </TouchableWithoutFeedback>

        {familyStore.inviteNeeded ? (
          <InviteMessage inviteLink={inviteLink} />
        ) : !message?.data ? (
          <NoMessage />
        ) : (
          <Message
            id={message.data.id}
            payload={message.data.payload}
            emotion={message.data.emotion}
            commentsCount={message.data.commentsCount}
            isKept={message.data.isKept}
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

        <Permissions />

        {!emotionStore.emotionChosen && message?.data.linkTo === 'none' && (
          <Animated.View
            style={[
              {position: 'absolute', left: 15, top: 100},
              {opacity: fadeAnim},
            ]}>
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
        deviceHeight={
          StatusBar.currentHeight
            ? pageHeight + StatusBar.currentHeight + 10
            : pageHeight + 10
        }>
        <ModalContainer>
          <View
            style={{
              paddingTop: 5,
              paddingHorizontal: 10,
            }}>
            <TitleContainer style={{marginVertical: 10, marginHorizontal: 15}}>
              <Text style={{fontFamily: 'nanum-bold', fontSize: 16}}>
                우리가 소개
              </Text>
            </TitleContainer>
            <Tutorial width={pageWidth - 40} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              borderTopWidth: 0.3,
              borderTopColor: Colors.borderDark,
            }}>
            <ConfirmModalBtn
              onPress={() => {
                setTutorial(false);
              }}>
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
