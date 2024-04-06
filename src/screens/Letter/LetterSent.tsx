import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text, View} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {
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
import {useHeaderHeight} from '@react-navigation/elements';
import letterStore from '../../stores/LetterStore';
import {useMutation, useQuery} from '@tanstack/react-query';
import {deleteLetterApi, findLetterSentApi} from '../../api/LetterApi';
import {ActivityIndicator} from 'react-native';
import {
  ConfirmModalContainer,
  ConfirmModalText,
} from '../../components/DetailModal';
import Toast from '../../components/Toast';
import {getTimeCapsuleTime} from '../../components/letter/LetterBox';
import {captureRef} from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignedInScreenProps} from '../../navigators/types';
import {RowContainer} from '../../components/common/Common';
import ModalRh, {ModalItem} from '../../components/modals/ModalRh';
import Modal from '../../components/modals/Modal';

export default function LetterSent({
  navigation,
  route: {params},
}: SignedInScreenProps<'LetterSent'>) {
  const viewShotRef = useRef<ScrollView>(null);
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
    const setTimeLeft = ({
      receiveDate,
      interval,
    }: {
      receiveDate: Date;
      interval?: any;
    }) => {
      const timeLeft = receiveDate.getTime() - new Date().getTime();
      const dayLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

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

    if (params.isTimeCapsule && params.receiveDate !== undefined) {
      const receiveDate = new Date(JSON.parse(params.receiveDate));

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
  const [snapHeight, setSnapHeight] = useState(0);
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
      // eslint-disable-next-line react/no-unstable-nested-components
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

  if (isLoading || !letter) {
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
          if (Platform.OS === 'android') {
            setSnapHeight(h);
          }
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
              <RowContainer style={{justifyContent: 'center'}}>
                <Ionicons name="alarm-outline" size={20} />
                <View style={{marginLeft: 5}}>
                  <DetailModalText>{timer}</DetailModalText>
                </View>
              </RowContainer>
            ) : (
              <RowContainer style={{justifyContent: 'center'}}>
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
              </RowContainer>
            )}
          </HeaderContainer>
          <View style={styles.contour} />
          <LetterText allowFontScaling={false}>
            {letter.data.payload}
          </LetterText>
        </LetterContainer>
      </ScrollView>

      <ModalRh
        isVisible={isDetailModal}
        onClose={() => setDetailModal(false)}
        onCloseEnd={() => {
          if (isConfirmPressed && !isDeleteModal) {
            // 받는 사람 구현해야
            letterStore.setTimeCapsule(letter.data.isTimeCapsule);
            letterStore.setTimeCapsuleTime(new Date(letter.data.receiveDate));
            letterStore.setLetterEmotion(letter.data.emotion);
            letterStore.setLetterPayload(letter.data.payload);
            letterStore.setLetterTitle(letter.data.title);
            navigation.navigate('LetterSend', {
              targetId: letter.data.receiver?.id,
              isEdit: true,
              letterId: letter.data.id,
              isTempSaved: letter.data.isTemp,
            });
          }

          setConfirmPressed(false);
        }}>
        <>
          {!letter.data.isRead && (
            <>
              <ModalItem
                payload={letter.data.isTemp ? '이어 쓰기' : '수정'}
                onPress={() => {
                  setConfirmPressed(true);
                  setDetailModal(false);
                }}
              />
              <ModalItem
                payload="삭제"
                onPress={() => {
                  setConfirmPressed(true);
                  setDeleteModal(true);
                  setDetailModal(false);
                }}
              />
            </>
          )}
          <ModalItem
            payload="기기에 저장"
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
            }}
          />
        </>
      </ModalRh>

      <Modal
        isVisible={isDeleteModal && !isConfirmPressed}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => {
          deleteLetter.mutate({id: letter.data.id});
          setDeleteModal(false);
        }}>
        <View style={{padding: 30}}>
          <ConfirmModalText>
            {'작성한 내용을 삭제하시겠습니까?'}
          </ConfirmModalText>
        </View>
      </Modal>

      <EmotionImg
        source={{uri: assetStore.messageEmotions[letter.data.emotion]}}
        resizeMode="contain"
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contour: {
    borderBottomWidth: 0.5,
    borderColor: Colors.borderDark,
    width: '100%',
    height: 10,
    marginBottom: 10,
  },
});
