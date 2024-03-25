import {useHeaderHeight} from '@react-navigation/elements';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import ScreenLayout from '../../../components/ScreenLayout';
import {Ionicons} from '@expo/vector-icons';
import {useForm} from 'react-hook-form';
import {Keyboard} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import Completed from '../../../components/Completed';
import {
  Emotion,
  EmotionName,
  EmotionWrapper,
  ModalContainer,
} from '../../../components/DailyEmotion';
import {editMessageApi, sendMessageApi} from '../../../api/MessageApi';
import {BGColors, Colors, EMOTIONS, EMOTION_KOREAN} from '../../../Config';
import Modal from 'react-native-modal';
import DismissKeyboard from '../../../components/DismissKeyboard';
import assetStore from '../../../stores/AssetStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SignedInScreenProps} from '../../../navigators/types';

const Container = styled.View`
  align-items: center;
  padding: 15px;
`;

const MessageInputContainer = styled.View`
  height: 200px;
  background-color: white;
  border-radius: 15px;
  border: 0.5px solid ${Colors.borderDark};
`;

const MessageInput = styled.TextInput`
  /* width: 250px; */
  height: 100%;
  padding: 12px;
  color: black;
  font-family: 'nanum-regular';
  line-height: 18px;
`;

const SendBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  margin: 0px 0px 10px 0px;
  padding: 12px;
  border-radius: 10px;
  opacity: ${props => (props.disabled ? '0.5' : '1')};
`;

const SendText = styled.Text`
  font-size: 16px;
  font-family: 'nanum-bold';
`;

const ConfirmTextContainer = styled.View`
  padding: 15px 10px;
`;

const ConfirmTextBold = styled.Text`
  font-family: 'nanum-bold';
  font-size: 18px;
  padding: 10px 0px;
  margin-bottom: 10px;
`;

const ConfirmText = styled.Text`
  font-family: 'nanum-regular';
  font-size: 14px;
  text-align: center;
  /* padding: 0px 10px; */
`;

const ConfirmBtn = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
`;

const EmotionPrompt = styled.View`
  margin-top: 10px;
  padding: 10px 10px 0px 10px;
`;
const EmotionPromptText = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
`;

export default function MessageSend({
  navigation,
  route: {params},
}: SignedInScreenProps<'MessageSend'>) {
  const {width: pageWidth, height: pageHeight} = useWindowDimensions();
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [neverAgain, setNeverAgain] = useState(false);

  const HeaderRight = () => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          width: '90%',
          height: '100%',
        }}></View>
    </TouchableWithoutFeedback>
  );

  // 경고문 다시 보지 않기
  useEffect(() => {
    const getNeverAgain = async () => {
      await AsyncStorage.getItem('neverAgainConfirmSend', (e, result) => {
        setNeverAgain(JSON.parse(result) || false);
      });
    };

    getNeverAgain();

    navigation.setOptions({headerRight: HeaderRight});
  }, []);

  // state for sendMessage Completed
  const [isMessageSent, setMessageSent] = useState(false);

  // state for emotion pressed
  const [emotionChosen, chooseEmotion] = useState(
    params?.edit ? params?.emotion : 'happy',
  );

  // state for options
  const [isOptions, setOptions] = useState(false);

  /** react-hook-form: 메세지 입력 */
  const {register, handleSubmit, setValue, watch} = useForm({
    defaultValues: {message: params?.payload},
  });

  useEffect(() => {
    register('message', {required: true});
  }, [register]);

  /** react-query: Send message || Edit message(PATCH) */
  const sendMessage = useMutation(
    params?.edit ? editMessageApi : sendMessageApi,
    {
      onSuccess: async data => {
        const body = JSON.parse(data.config.data);

        // keyboard down + empty input
        setValue('message', '');
        setMessageSent(true);

        await AsyncStorage.setItem(
          'neverAgainConfirmSend',
          JSON.stringify(neverAgain),
        );

        if (params?.edit) {
          DeviceEventEmitter.emit('EditCompleted', {
            id: params?.id,
            payload: body?.payload,
            emotion: body?.emotion,
            isNow: true,
          });
        }
      },
    },
  );

  const onValid = data => {
    sendMessage.mutate({
      ...(params?.edit && {id: params?.id}),
      payload: data.message,
      emotion: emotionChosen,
      isNow: true,
    });
    Keyboard.dismiss();
  };

  /** change Header if Editting message */
  useEffect(() => {
    if (params?.edit) {
      navigation.setOptions({headerTitle: '메세지 수정'});
    }
  }, []);

  if (isMessageSent) {
    return (
      <ScreenLayout>
        <Completed
          mainText="전송 완료되었습니다."
          subText="우리 가족에게 메세지를 전달합니다."
          toBack={() => navigation.goBack()}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <DismissKeyboard>
        <Container>
          <View style={{width: '100%'}}>
            <MessageInputContainer>
              <MessageInput
                multiline={true}
                value={watch('message')}
                placeholder={
                  '메세지는 전체 사용자에게 공개됩니다\n개인정보가 드러나지 않게 작성해주세요'
                }
                autoCapitalize="none"
                onChangeText={text => setValue('message', text)}
                textAlignVertical="top"
                maxLength={150}
              />
            </MessageInputContainer>

            <EmotionPrompt>
              <EmotionPromptText>
                메세지에 담긴 감정을 선택해주세요
              </EmotionPromptText>
            </EmotionPrompt>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{paddingVertical: 15, marginBottom: 5}}>
              {Object.keys(EMOTION_KOREAN).map(emotion => (
                <EmotionWrapper key={emotion}>
                  <TouchableOpacity
                    onPress={() => {
                      chooseEmotion(emotion);
                    }}>
                    <Emotion
                      source={{uri: assetStore.emotionsRound[emotion]}}
                      style={
                        emotionChosen !== emotion && {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        }
                      }
                      pageWidth={pageWidth + 20}
                    />
                  </TouchableOpacity>
                  {/* <EmotionName>{EMOTION_KOREAN[emotion]}</EmotionName> */}
                </EmotionWrapper>
              ))}
            </ScrollView>

            <SendBtn
              onPress={
                neverAgain ? handleSubmit(onValid) : () => setConfirmModal(true)
              }
              disabled={!watch('message')}>
              <SendText>
                {sendMessage.isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  '보내기'
                )}
              </SendText>
            </SendBtn>
          </View>
        </Container>
      </DismissKeyboard>

      <Modal
        isVisible={isConfirmModal}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => {
          setConfirmModal(false);
        }}
        onSwipeComplete={() => {
          setConfirmModal(false);
        }}
        swipeDirection="down"
        animationIn="fadeInUp"
        animationOut="fadeOut"
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight}>
        <ModalContainer>
          <TouchableOpacity
            style={{position: 'absolute', top: 0, right: 0, padding: 10}}
            onPress={() => setConfirmModal(false)}>
            <Ionicons name="close" size={22} color={Colors.borderDark} />
          </TouchableOpacity>
          <ConfirmTextContainer>
            <View style={{marginTop: 15}}>
              <ConfirmTextBold>메세지를 전송하시겠습니까?</ConfirmTextBold>
            </View>
            <View
              style={{
                backgroundColor: Colors.sub,
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderRadius: 10,
              }}>
              <ConfirmText style={{textAlign: 'left', lineHeight: 18}}>
                {
                  '메세지는 가족에게 익명으로 전달되지만,\n홈 화면에서  모든 사용자에게 공개됩니다.\n개인정보가 드러나지 않도록 작성해주세요.'
                }
              </ConfirmText>
            </View>
          </ConfirmTextContainer>

          <View style={{width: '100%', alignItems: 'flex-end'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 30,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'nanum-regular',
                  fontSize: 14,
                }}>
                다시 보지 않기
              </Text>
              <TouchableOpacity
                style={{padding: 10}}
                onPress={() => setNeverAgain(!neverAgain)}>
                <Ionicons
                  name={neverAgain ? 'checkbox-outline' : 'square-outline'}
                  size={18}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              borderTopWidth: 0.3,
              borderTopColor: Colors.borderDark,
            }}>
            <ConfirmBtn
              onPress={handleSubmit(onValid)}
              disabled={sendMessage.isLoading}>
              <ConfirmText style={{fontSize: 16}}>전송</ConfirmText>
            </ConfirmBtn>
          </View>
        </ModalContainer>
      </Modal>
    </ScreenLayout>
  );
}
