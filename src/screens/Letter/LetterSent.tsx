import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  DeviceEventEmitter,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Text, View} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {
  DetailModalContainer,
  DetailModalRow,
  DetailModalText,
  EmotionImg,
  HeaderContainer,
  HeaderText,
  LetterContainer,
  LetterText,
} from '../../components/letter/Letter';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import {BGColors, Colors} from '../../Config';
import assetStore from '../../stores/AssetStore';
import {Ionicons} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import {useHeaderHeight} from '@react-navigation/elements';
import {ROUTE_NAME} from '../../Strings';
import letterStore from '../../stores/LetterStore';
import Timer from '../../components/Timer';
import {useMutation, useQuery} from '@tanstack/react-query';
import {deleteLetterApi, findLetterSentApi} from '../../api/LetterApi';
import {ActivityIndicator} from 'react-native';
import {
  ConfirmModalBtn,
  ConfirmModalContainer,
  ConfirmModalText,
} from '../../components/DetailModal';
import Toast from '../../components/Toast';
import {getTimeCapsuleTime} from '../../components/letter/LetterBox';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignedInScreenProps} from '../../navigators/types';

export default function LetterSent({
  navigation,
  route: {params},
}: SignedInScreenProps<'LetterSent'>) {
  const viewShotRef = useRef();
  const safeAreaInsets = useSafeAreaInsets();

  const {data: letter, isLoading} = useQuery(
    ['LetterSent', params?.letterId],
    () => findLetterSentApi({id: params?.letterId}),
    {
      onError: () => {
        Toast({message: '편지를 열 수 없습니다'});
        navigation.goBack();
      },
      onSuccess: ({data}) => {
        if (!data) {
          Toast({message: '편지를 열 수 없습니다'});
          navigation.goBack();
        }
      },
    },
  );

  const [timer, setTimer] = useState('');

  useEffect(() => {
    // 타이머 함수
    const setTimeLeft = ({receiveDate, interval}) => {
      const timeLeft = receiveDate - new Date();
      const dayLeft = parseInt(timeLeft / (1000 * 60 * 60 * 24));

      if (dayLeft > 0) {
        setTimer(`D-${dayLeft}`);
        clearInterval(interval);
      } else if (timeLeft > 0) {
        const timeString = getTimeCapsuleTime(receiveDate);
        setTimer(timeString);
      } else if (interval) {
        clearInterval(interval);
      }
    };

    if (params?.isTimeCapsule) {
      const receiveDate = new Date(JSON.parse(params?.receiveDate));

      setTimeLeft({receiveDate});

      const tiks = setInterval(() => {
        // 초 countdown
        setTimeLeft({receiveDate, interval: tiks});
      }, 1000); // for every 1000ms

      return () => clearInterval(tiks);
    }
  }, [timer]);

  const headerHeight = useHeaderHeight();
  const [snapReady, setSnapReady] = useState(false);
  const [snapHeight, setSnapHeight] = useState(false);
  const {height: pageHeight} = useWindowDimensions();

  const [isDetailModal, setDetailModal] = useState(false);
  const [isConfirmPressed, setConfirmPressed] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);

  const deleteLetter = useMutation(deleteLetterApi, {
    onSuccess: data => {
      if (data?.data.ok) {
        DeviceEventEmitter.emit('isDeleted', {letterId: params?.letterId});

        Toast({message: '삭제되었습니다'});
        navigation.goBack();
      }
    },
  });

  useEffect(() => {
    navigation.setOptions({
      ...(params?.isTimeCapsule &&
        !params?.isCompleted && {headerTitle: '타임캡슐'}),
      headerRight: () => (
        <TouchableOpacity
          style={{paddingHorizontal: 15}}
          onPress={() => setDetailModal(true)}>
          <Ionicons name="ellipsis-vertical" size={18} />
        </TouchableOpacity>
      ),
    });

    return () => letterStore.resetLetter();
  }, []);

  if (isLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout safeAreaColor={BGColors[letter.data.emotion]}>
      <ScrollView
        ref={viewShotRef}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: pageHeight - headerHeight - safeAreaInsets.bottom,
          backgroundColor: BGColors[letter.data.emotion],
          ...(Platform.OS === 'android' && snapReady && {height: snapHeight}),
        }}
        onContentSizeChange={(w, h) => {
          if (Platform.OS === 'android') setSnapHeight(h);
        }}
        style={
          Platform.OS === 'android' && {
            overflow: snapReady ? 'visible' : 'scroll',
          }
        }>
        <LetterContainer>
          <HeaderContainer>
            <HeaderText allowFontScaling={false} style={{flex: 1}}>
              {letter.data.title ||
                `# ${new Date(letter.data.createdAt).toLocaleDateString(
                  'ko-KR',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )}`}
            </HeaderText>
            {params?.isTimeCapsule && !params?.isCompleted ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="alarm-outline" size={20} />
                <View style={{marginLeft: 5}}>
                  <DetailModalText>{timer}</DetailModalText>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'nanum-regular',
                    textAlignVertical: 'center',
                    paddingHorizontal: 5,
                  }}>
                  수신
                </Text>
                <Ionicons
                  name={letter.data.isRead ? 'mail-open' : 'mail'}
                  size={20}
                />
              </View>
            )}
          </HeaderContainer>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: Colors.borderDark,
              width: '100%',
              height: 10,
              marginBottom: 10,
              // backgroundColor: "red",
            }}
          />
          <LetterText allowFontScaling={false}>
            {letter.data.payload}
          </LetterText>
        </LetterContainer>

        {/* <EmotionImg
          source={{ uri: assetStore.messageEmotions[letter.data.emotion] }}
          resizeMode="contain"
        /> */}
      </ScrollView>

      <Modal
        isVisible={isDetailModal}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => {
          setDetailModal(false);
        }}
        onBackButtonPress={() => setDetailModal(false)}
        onModalHide={() => {
          if (isConfirmPressed && !isDeleteModal) {
            // 받는 사람 구현해야
            letterStore.setTimeCapsule(letter.data.isTimeCapsule);
            letterStore.setTimeCapsuleTime(new Date(letter.data.receiveDate));
            letterStore.setLetterEmotion(letter.data.emotion);
            letterStore.setLetterPayload(letter.data.payload);
            letterStore.setLetterTitle(letter.data.title);
            navigation.navigate(ROUTE_NAME.LETTER_SEND, {
              targetId: letter.data.receiver?.id,
              isEdit: true,
              letterId: letter.data.id,
              isTempSaved: letter.data.isTemp,
            });
          }

          setConfirmPressed(false);
        }}
        backdropOpacity={0}
        animationIn="fadeIn"
        animationOut="fadeOut"
        statusBarTranslucent
        style={{position: 'absolute', top: headerHeight, right: 0}}>
        <DetailModalContainer>
          {!letter.data.isRead && (
            <>
              <DetailModalRow
                onPress={() => {
                  setConfirmPressed(true);
                  setDetailModal(false);
                }}>
                <DetailModalText>
                  {letter.data.isTemp ? '이어 쓰기' : '수정'}
                </DetailModalText>
              </DetailModalRow>

              <DetailModalRow
                onPress={() => {
                  setConfirmPressed(true);
                  setDeleteModal(true);
                  setDetailModal(false);
                }}>
                <DetailModalText>삭제</DetailModalText>
              </DetailModalRow>
            </>
          )}
          <DetailModalRow
            onPress={async () => {
              try {
                setSnapReady(true);

                const uri = await captureRef(viewShotRef, {
                  snapshotContentContainer: true,
                  useRenderInContext: true,
                  fileName: `${new Date().getTime()}`,
                });

                CameraRoll.save(uri, {
                  type: 'photo',
                  album: '우리가',
                });

                setSnapReady(false);

                Toast({message: '편지를 사진첩에 저장하였습니다'});
              } catch (e) {}

              setDetailModal(false);
            }}>
            <DetailModalText>기기에 저장</DetailModalText>
          </DetailModalRow>
        </DetailModalContainer>
      </Modal>

      <Modal
        isVisible={isDeleteModal && !isConfirmPressed}
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
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <ConfirmModalContainer>
          <View style={{padding: 30}}>
            <ConfirmModalText>
              {'작성한 내용을 삭제하시겠습니까?'}
            </ConfirmModalText>
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
                setDeleteModal(false);
              }}>
              <ConfirmModalText>취소</ConfirmModalText>
            </ConfirmModalBtn>
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              onPress={() => {
                // no action
                deleteLetter.mutate({id: letter?.data.id});
                setDeleteModal(false);
              }}>
              <ConfirmModalText>확인</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ConfirmModalContainer>
      </Modal>

      <EmotionImg
        source={{uri: assetStore.messageEmotions[letter.data.emotion]}}
        resizeMode="contain"
      />
    </ScreenLayout>
  );
}
