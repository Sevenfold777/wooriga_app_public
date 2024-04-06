import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  EmotionImg,
  HeaderContainer,
  HeaderText,
  LetterContainer,
  LetterText,
} from '../../components/letter/Letter';
import ActionIcon from '../../components/message/ActionIcon';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import {BGColors, Colors, EMOTION_KOREAN} from '../../Config';
import assetStore from '../../stores/AssetStore';
import letterStore from '../../stores/LetterStore';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  findLetterReceivedApi,
  keepLetterApi,
  readLetterApi,
  unkeepLetterApi,
} from '../../api/LetterApi';
import authStore from '../../stores/AuthStore';
import {useHeaderHeight} from '@react-navigation/elements';
import {Ionicons} from '@expo/vector-icons';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Toast from '../../components/Toast';
import {captureRef} from 'react-native-view-shot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignedInScreenProps} from '../../navigators/types';
import {RowContainer} from '../../components/common/Common';
import ModalRh, {ModalItem} from '../../components/modals/ModalRh';

type LetterType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  payload: string;
  emotion: keyof typeof EMOTION_KOREAN;
  isTimeCapsule: boolean;
  receiveDate: string;
  isRead: boolean;
  isTemp: boolean;
  receiver: {id: number; userName: string};
  sender: {id: number; userName: string};
  keeps: {id: number; user: {id: number}}[];
};

export default function LetterReceived({
  navigation,
  route: {params},
}: SignedInScreenProps<'LetterReceived'>) {
  const viewShotRef = useRef<ScrollView>(null);
  const safeAreaInsets = useSafeAreaInsets();
  const {height: pageHeight} = useWindowDimensions();

  const {data: letter, isLoading} = useQuery(
    ['LetterReceived', params?.letterId],
    () => findLetterReceivedApi({id: params?.letterId}),
    {
      onError: () => {
        Toast({message: '편지를 열 수 없습니다'});
        navigation.goBack();
      },
      onSuccess: ({data}: {data: LetterType}) => {
        if (data) {
          const myKeep = data?.keeps.findIndex(
            keep => keep.user.id === authStore.userId,
          );

          setKept(myKeep !== -1); // isKept init

          if (!data.isRead) {
            readLetter.mutate({id: data.id});
          }
        } else {
          Toast({message: '편지를 열 수 없습니다'});
          navigation.goBack();
        }
      },
    },
  );

  const readLetter = useMutation(readLetterApi, {
    onSuccess: () => {
      // eventEmitter로 letterBox 봉투 열기
      DeviceEventEmitter.emit('isRead', {letterId: params?.letterId});
    },
  });

  const headerHeight = useHeaderHeight();
  const [isDetailModal, setDetailModal] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const [snapHeight, setSnapHeight] = useState(0);

  /** toggle keep */
  const [isKept, setKept] = useState(false);
  const keepLetter = useMutation(keepLetterApi);
  const unKeepLetter = useMutation(unkeepLetterApi);

  const toggleKeep = (id: number, isKept: boolean) => {
    isKept ? unKeepLetter.mutate({id}) : keepLetter.mutate({id});
    setKept(!isKept);
  };

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <RowContainer style={{justifyContent: 'center'}}>
          <TouchableOpacity
            style={{paddingHorizontal: 8}}
            onPress={() => setDetailModal(true)}>
            <Ionicons name="ellipsis-vertical" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerRight}
            onPress={() => {
              // letterStore.setSendTargets();
              if (letter) {
                navigation.navigate('LetterSend', {
                  targetId: letter.data.sender.id,
                  isTimeCapsule: false,
                });
              }
            }}>
            <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>
              답장
            </Text>
          </TouchableOpacity>
        </RowContainer>
      ),
    });

    return () => letterStore.resetLetter();
  }, [letter]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (!isKept) {
        DeviceEventEmitter.emit('unkeep', {letterId: params?.letterId});
      }
    });

    return unsubscribe;
  }, [navigation, isKept]);

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
        onContentSizeChange={(_, h: number) => {
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
              {letter.data.title}
            </HeaderText>
            <TouchableOpacity
              onPress={() => toggleKeep(params?.letterId, isKept)}>
              <ActionIcon
                iconName="bookmark"
                isClicked={isKept}
                color={Colors.main}
              />
            </TouchableOpacity>
          </HeaderContainer>
          <View style={styles.contour} />
          <LetterText allowFontScaling={false}>
            {letter.data.payload}
          </LetterText>
        </LetterContainer>
      </ScrollView>

      <ModalRh isVisible={isDetailModal} onClose={() => setDetailModal(false)}>
        <ModalItem
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
          payload={'기기에 저장'}
          isSelected={false}
        />
      </ModalRh>

      <EmotionImg
        source={{uri: assetStore.messageEmotions[letter.data.emotion]}}
        resizeMode="contain"
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    backgroundColor: Colors.main,
    padding: 8,
    borderRadius: 5,
    marginLeft: 7,
    marginRight: 15,
  },
  contour: {
    borderBottomWidth: 0.5,
    borderColor: Colors.borderDark,
    width: '100%',
    height: 10,
    marginBottom: 10,
  },
});
