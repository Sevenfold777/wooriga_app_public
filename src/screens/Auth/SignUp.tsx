import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ScreenLayout from '../../components/ScreenLayout';
import Modal from 'react-native-modal';
import {ModalContainer} from '../../components/DailyEmotion';
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Controller, useForm} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import {createAccountApi, loginApi} from '../../api/AuthApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {METHOD, _promise} from '../../api/ApiConfig';
import authStore from '../../stores/AuthStore';
import familyStore from '../../stores/FamilyStore';
import {Colors} from '../../Config';
import {ROUTE_NAME} from '../../Strings';
import {Keyboard} from 'react-native';
import DismissKeyboard from '../../components/DismissKeyboard';
import {
  Body,
  HeaderContainer,
  HeaderPayload,
  HeaderTitle,
  PermissionColumn,
  PermissionContainer,
  PermissionListContainer,
  PermissionTitle,
  PermissionPayload,
} from '../../components/Permissions';
import Toast from '../../components/Toast';
import Clipboard from '@react-native-clipboard/clipboard';
import Toggle from '../../components/Toggle';
import {RowContainer} from '../../components/common/Common';

export const Wrapper = styled.View`
  padding: 10px;
`;

export const Container = styled.View`
  margin-bottom: 20px;
`;

export const TagText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  padding: 0px 8px 0px 12px;
  /* margin-bottom: 5px; */
  font-family: 'nanum-bold';
`;

export const PayloadContainer = styled.View`
  margin: 10px 10px 5px 10px;
  padding: 10px 15px;
  border: 0.5px solid ${Colors.borderDark};
  border-radius: 25px;
  height: 50px;
  justify-content: center;
`;

export const InputContainer = styled.TouchableOpacity`
  margin: 10px 10px 5px 10px;
  padding: 12px 15px;
  border: 0.5px solid ${Colors.borderDark};
  border-radius: 25px;
  height: 50px;
  justify-content: center;
`;

export const PayloadText = styled.Text`
  font-family: 'nanum-regular';
`;

export const Input = styled.TextInput`
  color: black;
  font-family: 'nanum-regular';
`;

export const SelectionContainer = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  padding: 20px 20px;
`;

export const LoadingText = styled.Text`
  padding: 15px;
  font-family: 'nanum-regular';
  text-align: center;
  line-height: 20px;
`;

const BirthPolicyContainer = styled.View`
  background-color: white;
  padding: 15px 5px;
  border-radius: 10px;
`;

export const LunarBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: ${Colors.borderLight};
  padding: 5px 10px;
  border-radius: 15px;
`;

export const LunarBtnText = styled.Text`
  font-family: 'nanum-regular';
  font-size: 12px;
`;

const HeaderRightBtn = styled.TouchableOpacity`
  background-color: ${Colors.main};
  padding: 8px;
  border-radius: 5px;
  margin-right: 8px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

export default function SignUp({navigation, route: {params}}) {
  const positions = ['할아버지', '할머니', '아빠', '엄마', '아들', '딸'];

  const {height: pageHeight} = useWindowDimensions();

  const [positionModal, setPositionModal] = useState(false);
  const [positionPressed, setPosionPressed] = useState('선택');

  /** 필수 이용 정책 */
  const [touAgreed, setTouAgreed] = useState(false);
  const [opAgreed, setOpAgreed] = useState(false);
  const [ppAgreed, setPpAgreed] = useState(false);

  const [birthPolicyModal, setBirthPolicyModal] = useState(false);
  const [isBirthLunar, setBirthLunar] = useState(false);

  /** 마케팅 푸시 */
  const [mktPushAgreed, setMktPushAgreed] = useState(false);

  /** 만 14세 미만 */
  const [underFourteen, setUnderFourteen] = useState(false);

  const {control, handleSubmit, getValues, clearErrors, formState, watch} =
    useForm({
      ...(params?.userName && {defaultValues: {userName: params.userName}}),
    });

  const onValid = ({userName, birthday}) => {
    const birthdayString = `${birthday.slice(0, 4)}-${birthday.slice(
      4,
      6,
    )}-${birthday.slice(6)}`;

    // invalid date type
    if (isNaN(new Date(birthdayString))) {
      Toast({message: '잘못된 생일 형식입니다.'});
      return;
    }
    // 만 14세 이상 체크
    else if (getAge(birthdayString) < 14) {
      Toast({
        message: '본 서비스는 만 14세 이상부터 이용가능합니다. 죄송합니다.',
      });
      return;
    } else if (new Date(birthdayString).getFullYear() < 1900) {
      Toast({message: '잘못된 생일 형식입니다.'});
      return;
    }

    navigation.setOptions({headerLeft: null, gestureEnabled: false});

    signUp.mutate({
      email: params?.email,
      userName,
      birthday,
      position: positionPressed,
      // familyToken,
      familyToken: params?.familyId,
      provider: params?.provider,
      mktPushAgreed,
      token: params?.token,
      ...(params?.nonce && {nonce: params?.nonce}),
      isBirthLunar,
    });
  };

  //   console.log(formState?.errors?.birthday?.message); // input 에러 메세지
  const signUp = useMutation(createAccountApi, {
    onSuccess: data => {
      const {
        config: {data: user},
      } = data;

      const userObj = JSON.parse(user);

      loginWithToken.mutate({
        token: params?.token,
        provider: params?.provider,
        isSignUp: true,
      });
    },
  });

  const loginWithToken = useMutation(loginApi, {
    onSuccess: async data => {
      const {
        data: {ok, accessToken, refreshToken, error},
      } = data;

      if (ok) {
        // 2. mobx 활용 - 전역 login State === true
        authStore.loginAction({accessToken, refreshToken});
      } else {
        // console.log(error);
      }
    },
  });

  /** set header right Button */
  const HeaderRight = () => (
    <HeaderRightBtn
      onPress={handleSubmit(onValid)}
      disabled={
        !underFourteen ||
        !touAgreed ||
        !opAgreed ||
        !ppAgreed ||
        !watch('userName') ||
        watch('birthday')?.length !== 8
      }>
      <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>완료</Text>
    </HeaderRightBtn>
  );

  useEffect(() => {
    navigation.setOptions({headerRight: HeaderRight});
  }, [
    positionPressed,
    opAgreed,
    ppAgreed,
    touAgreed,
    mktPushAgreed,
    underFourteen,
    watch('userName'),
    watch('birthday'),
    isBirthLunar,
  ]);

  useEffect(() => {
    if (loginWithToken.isLoading || signUp.isLoading) {
      const backAction = () => {
        return true;
      };

      const backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      navigation.setOptions({headerRight: () => {}});

      return () => backhandler.remove();
    }
  }, [signUp.isLoading, loginWithToken.isLoading]);

  const Agreement = ({title, agreedState, setAgreedState, routeName}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 15,
          marginVertical: 5,
        }}>
        <TagText>{title}</TagText>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          {routeName && (
            <TouchableOpacity
              style={{}}
              onPress={() => navigation.navigate(routeName)}>
              <PayloadText style={{color: '#0095f6'}}>{'[열기]'}</PayloadText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{paddingHorizontal: 10}}
            onPress={() => setAgreedState(!agreedState)}>
            <Ionicons
              name={agreedState ? 'checkbox-outline' : 'square-outline'}
              size={18}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (signUp.isLoading || loginWithToken.isLoading) {
    return (
      <ScreenLayout>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 80,
          }}>
          <ActivityIndicator
            style={{alignItems: 'center', justifyContent: 'center'}}
          />
          <LoadingText>
            {'우리 가족에 가입 중입니다.\n잠시만 기다려주세요.'}
          </LoadingText>
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
                style={{backgroundColor: Colors.borderLight, opacity: 0.5}}>
                <PayloadText>{params?.email}</PayloadText>
              </PayloadContainer>
            </Container>

            <Container>
              <TagText>이름</TagText>

              <PayloadContainer>
                <Controller
                  control={control}
                  name="userName"
                  render={({field: {onChange, value}}) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      placeholder="이름을 입력해주세요."
                      //   maxLength={5}
                    />
                  )}
                  rules={{required: {message: '이름을 입력해주세요'}}}
                />
              </PayloadContainer>
            </Container>

            <Container>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <RowContainer
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <TagText>생년월일</TagText>
                  <TouchableOpacity onPress={() => setBirthPolicyModal(true)}>
                    <Ionicons
                      name="help-circle-outline"
                      size={16}
                      color={Colors.borderDark}
                    />
                  </TouchableOpacity>
                </RowContainer>

                <RowContainer
                  style={{
                    overflow: 'hidden',
                    borderRadius: 15,
                    marginLeft: 10,
                    marginRight: 20,
                    backgroundColor: Colors.borderLight,
                  }}>
                  <LunarBtn
                    style={{
                      backgroundColor: isBirthLunar
                        ? Colors.borderLight
                        : Colors.main,
                    }}
                    onPress={() => setBirthLunar(!isBirthLunar)}>
                    <LunarBtnText>양력</LunarBtnText>
                  </LunarBtn>
                  <LunarBtn
                    style={{
                      backgroundColor: isBirthLunar
                        ? Colors.main
                        : Colors.borderLight,
                    }}
                    onPress={() => setBirthLunar(!isBirthLunar)}>
                    <LunarBtnText>음력</LunarBtnText>
                  </LunarBtn>
                </RowContainer>
              </View>
              <PayloadContainer>
                <Controller
                  control={control}
                  name="birthday"
                  render={({field: {onChange, value}}) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      placeholder="생일 8자리 입력 (예: 19980924)"
                      maxLength={8}
                      keyboardType="number-pad"
                      style={{flex: 1}}
                    />
                  )}
                  rules={{
                    minLength: {
                      value: 8,
                      message: '생년월일 8자리를 입력해주세요.',
                    },
                    maxLength: 8,
                    required: true,
                  }}
                />
              </PayloadContainer>
            </Container>

            <Container>
              <TagText>우리 가족에서 나는?</TagText>
              <InputContainer
                onPress={() => {
                  Keyboard.dismiss();
                  setPositionModal(true);
                }}>
                <PayloadText
                  style={{
                    color:
                      positionPressed === '선택' ? Colors.borderDark : 'black',
                  }}>
                  {positionPressed}
                </PayloadText>
              </InputContainer>
            </Container>

            <Container>
              <Agreement
                title={'(필수) 이용약관'}
                agreedState={touAgreed}
                setAgreedState={setTouAgreed}
                routeName={ROUTE_NAME.TERMS_OF_USE}
              />
              <Agreement
                title={'(필수) 운영정책'}
                agreedState={opAgreed}
                setAgreedState={setOpAgreed}
                routeName={ROUTE_NAME.OPERATION_POLICY}
              />
              <Agreement
                title={'(필수) 개인정보처리방침'}
                agreedState={ppAgreed}
                setAgreedState={setPpAgreed}
                routeName={ROUTE_NAME.PRIVACY_POLICY}
              />

              <Agreement
                title={'(선택) 마케팅 푸시 알림'}
                agreedState={mktPushAgreed}
                setAgreedState={setMktPushAgreed}
              />

              <Agreement
                title={'(필수) 만 14세 이상'}
                agreedState={underFourteen}
                setAgreedState={setUnderFourteen}
              />
            </Container>

            <Modal
              isVisible={positionModal}
              onBackdropPress={() => {
                setPositionModal(false);
              }}
              onSwipeComplete={() => {
                setPositionModal(false);
              }}
              onBackButtonPress={() => {
                setPositionModal(false);
              }}
              statusBarTranslucent
              deviceHeight={pageHeight + StatusBar.currentHeight + 10}
              swipeDirection="down"
              animationIn="fadeInUp"
              animationOut="fadeOutDown"
              backdropTransitionOutTiming={0}>
              <ModalContainer
                style={{paddingVertical: 30, paddingHorizontal: 10}}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: 10,
                  }}
                  onPress={() => setPositionModal(false)}>
                  <Ionicons name="close" size={22} color={Colors.borderDark} />
                </TouchableOpacity>

                {positions.map((position, index) => (
                  <SelectionContainer
                    key={index}
                    onPress={() => {
                      setPosionPressed(position);
                      setPositionModal(false);
                    }}>
                    <PayloadText style={{flex: 1}}>{position}</PayloadText>
                    {position === positionPressed && (
                      <Ionicons name="checkmark" size={15} />
                    )}
                  </SelectionContainer>
                ))}
              </ModalContainer>
            </Modal>

            <Modal
              isVisible={birthPolicyModal}
              onBackdropPress={() => {
                setBirthPolicyModal(false);
              }}
              onSwipeComplete={() => {
                setBirthPolicyModal(false);
              }}
              onBackButtonPress={() => {
                setBirthPolicyModal(false);
              }}
              swipeDirection="down"
              animationIn="fadeInUp"
              animationOut="fadeOutDown"
              backdropTransitionOutTiming={0}
              statusBarTranslucent
              deviceHeight={pageHeight + StatusBar.currentHeight + 10}>
              <BirthPolicyContainer>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: 10,
                  }}
                  onPress={() => setBirthPolicyModal(false)}>
                  <Ionicons name="close" size={22} color={Colors.borderDark} />
                </TouchableOpacity>
                <HeaderContainer>
                  <HeaderContainer>
                    <HeaderTitle>{'(필수) 생년월일'}</HeaderTitle>
                    <HeaderPayload>
                      아래와 같은 이유로 사용자의 생년월일 정보를 수집합니다.
                    </HeaderPayload>
                  </HeaderContainer>
                </HeaderContainer>

                <Body>
                  <PermissionListContainer>
                    <PermissionContainer>
                      <PermissionTitle>•</PermissionTitle>
                      <PermissionColumn>
                        <PermissionPayload>
                          본 서비스는 만 14세 이상 사용 가능합니다. 생년월일을
                          기반으로 사용자 연령 수칙 준수 여부를 판별합니다.
                        </PermissionPayload>
                      </PermissionColumn>
                    </PermissionContainer>

                    <PermissionContainer>
                      <PermissionTitle>•</PermissionTitle>
                      <PermissionColumn>
                        <PermissionPayload>
                          생일 푸시 알림, 생일 축하 메세지 등의 가족 생일 관련
                          서비스를 제공합니다.
                        </PermissionPayload>
                      </PermissionColumn>
                    </PermissionContainer>

                    <PermissionContainer>
                      <PermissionTitle>•</PermissionTitle>
                      <PermissionColumn>
                        <PermissionPayload>
                          연령대를 기반으로 한 맞춤 메세지 추천 서비스를
                          제공합니다.
                        </PermissionPayload>
                      </PermissionColumn>
                    </PermissionContainer>
                  </PermissionListContainer>
                </Body>
                <View style={{marginBottom: 20}} />
              </BirthPolicyContainer>
            </Modal>
          </Wrapper>
        </ScrollView>
      </TouchableWithoutFeedback>
    </ScreenLayout>
  );
}

export function getAge(birthString) {
  const today = new Date();
  const birthday = new Date(birthString);

  let age = today.getFullYear() - birthday.getFullYear();

  const thisBirth = birthday.setFullYear(today.getFullYear());

  if (today.getTime() < thisBirth) {
    age--;
  }

  return age;
}
