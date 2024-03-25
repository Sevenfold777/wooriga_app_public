import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useRef, useState} from 'react';
import {
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
  createDailyEmotionApi,
  deleteDailyEmotionApi,
  editDailyEmotionApi,
  findFamEmotionsTodayApi,
  findMyEmotionTodayApi,
  pokeFamilyMemberApi,
} from '../api/DailyEmotionApi';
import Modal from 'react-native-modal';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import familyStore from '../stores/FamilyStore';
import {observer} from 'mobx-react-lite';
import {Colors, EMOTION_KOREAN} from '../Config';
import assetStore from '../stores/AssetStore';
import PropTypes from 'prop-types';
import {ROUTE_NAME} from '../Strings';
import emotionStore from '../stores/EmotionStore';

export const Container = styled.View`
  /* height: 200px; */
  padding: 5px 10px 10px 10px;
  /* margin-bottom: 10px; */
  border-bottom-color: ${Colors.borderLight};
  border-bottom-width: 1px;
  justify-content: center;
  //background-color: beige;
`;

export const Header = styled.Text`
  padding: 5px 10px 10px 10px;
  font-size: 16px;
  font-family: 'nanum-bold';
`;

export const EmotionWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin: 0px 10px;
`;

export const EmotionOwner = styled.Text`
  padding: 5px;
  font-family: 'nanum-regular';
  text-align: center;
`;

export const Emotion = styled.Image`
  background-color: ${Colors.borderDark};
  border: 2px solid ${Colors.main};
  border-radius: ${props => `${(props.pageWidth - 100) / 8}px`};
  width: ${props => `${(props.pageWidth - 100) / 4}px`};
  height: ${props => `${(props.pageWidth - 100) / 4}px`};

  /* border: 1px solid black; */
`;

export const ModalContainer = styled.View`
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  overflow: hidden;
`;

export const EmotionModalWrapper = styled.View`
  padding: 50px 0px 20px 0px;
`;

const EmotionSelection = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

export const EmotionModalTextContainer = styled.View`
  background-color: ${Colors.sub};
  justify-content: center;
  align-items: center;

  padding: 15px 30px;
  border-radius: 10px;
  margin: 15px;
  /* width: 70%; */
`;

export const EmotionModalText = styled.Text`
  text-align: center;
  font-family: 'nanum-regular';
  line-height: 18px;
`;

const EmotionConfirmBtn = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
`;

const EmotionConfirmText = styled.Text`
  text-align: center;
  font-family: 'nanum-regular';
`;

export const EmotionName = styled.Text`
  padding: 5px;
  font-family: 'nanum-regular';
`;

const FamilyModalBtn = styled.TouchableOpacity`
  border-radius: ${props => `${(props.pageWidth - 140) / 8}px`};
  width: ${props => `${(props.pageWidth - 140) / 4}px`};
  height: ${props => `${(props.pageWidth - 140) / 4}px`};
  justify-content: center;
  align-items: center;
  margin: 0px 15px 5px 15px;
  background-color: ${Colors.sub};
`;

function DailyEmotion({isMyPage = false, isTitle = true}) {
  /** navigation */
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    setMyModal(route.params?.openEmotionSelection || false);
  }, [route.params]);

  // console.log(route.params);
  const {width: pageWidth, height: pageHeight} = useWindowDimensions();

  /** 1. my Daily Emotion */
  const {data: me, refetch: refetchMe} = useQuery(
    ['MeWithEmotion'],
    findMyEmotionTodayApi,
    {
      onSuccess: data => {
        setMyEmotion(data?.data[0].type);
        emotionStore.setEmotionChosen(Boolean(data?.data[0].type));
      },
    },
  );

  /** 2. Family Daily Emotion */
  const {data: family, refetch: refetchFamily} = useQuery(
    ['FamilyWithEmotions'],
    findFamEmotionsTodayApi,
    {
      enabled: Boolean(me?.data[0].familyId),
      onSuccess: ({data: result}) => {
        familyStore.setInviteNeeded(result.length === 0);
      },
    },
  );

  /** 방법2. refetcth when AppState Changes */
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const refetch = async () => {
      await refetchMe();
      await refetchFamily();
    };

    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          await refetch();
        }

        appState.current = nextAppState;
      },
    );

    return () => subscription.remove();
  }, []);

  /** 3. create Daily Emotion */
  const createDailyEmotion = useMutation(createDailyEmotionApi, {
    onSuccess: async () => {
      await refetchMe();
    },
  });

  /** 4. edit Daily Emotion */
  const editDailyEmotion = useMutation(editDailyEmotionApi, {
    onSuccess: async () => {
      await refetchMe();
    },
  });

  /** 5. delete Daily Emotion */
  const deleteDailyEmotion = useMutation(deleteDailyEmotionApi, {
    onSuccess: async () => {
      await refetchMe();
    },
  });

  /** 찌르기 */
  const [isPoked, setIsPoked] = useState(false);
  const pokeDailyEmotion = useMutation(pokeFamilyMemberApi, {
    onSuccess: () => {},
  });

  const renderEmotion = ({id, owner, type, isMe, pediaId}) => {
    return (
      <EmotionWrapper key={id}>
        <TouchableOpacity
          onPress={() => {
            if (isMe) {
              // setMyEmotion(type);
              setMyModal(true);
            } else {
              setFamilyPressed({id, userName: owner, type, pediaId});
              setFamilyModal(true);
            }
          }}>
          <Emotion
            type={assetStore.emotionsRound[type]}
            source={{uri: assetStore.emotionsRound[type]}}
            pageWidth={pageWidth}
          />
        </TouchableOpacity>
        <EmotionOwner style={{maxWidth: (pageWidth - 100) / 4}}>
          {isMe ? owner : familyStore.members[id] || owner}
        </EmotionOwner>
      </EmotionWrapper>
    );
  };

  /** lists of emotions to select */
  const emotionKeys = Object.keys(EMOTION_KOREAN);

  /** useState for modal */
  const [isMyModal, setMyModal] = useState(false);
  const [myEmotion, setMyEmotion] = useState();
  const [isFamilyModal, setFamilyModal] = useState(false);
  const [familyPressed, setFamilyPressed] = useState();

  const renderMyModal = () => (
    <Modal
      isVisible={isMyModal}
      onBackdropPress={() => {
        setMyEmotion(me?.data[0]?.type);
        setMyModal(false);
      }}
      onSwipeComplete={() => {
        setMyEmotion(me?.data[0]?.type);
        setMyModal(false);
      }}
      onBackButtonPress={() => {
        setMyEmotion(me?.data[0]?.type);
        setMyModal(false);
      }}
      onModalShow={() => emotionStore.setEmotionChosen(true)}
      swipeDirection="down"
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={pageHeight + StatusBar.currentHeight + 10}>
      <ModalContainer>
        <EmotionModalWrapper>
          <EmotionWrapper>
            <Emotion
              type={assetStore.emotionsRound[myEmotion]}
              source={{uri: assetStore.emotionsRound[myEmotion]}}
              style={{borderRadius: 50, width: 100, height: 100}}
              pagewidth={pageWidth}
            />
            <EmotionOwner>{me?.data[0].userName}</EmotionOwner>
          </EmotionWrapper>

          <EmotionModalTextContainer>
            <EmotionModalText>오늘의 감정을 선택해주세요</EmotionModalText>
          </EmotionModalTextContainer>

          <EmotionSelection>
            {emotionKeys.slice(0, emotionKeys.length / 2).map(emotion => (
              <EmotionWrapper key={emotion} pagewidth={pageWidth}>
                <TouchableOpacity
                  onPress={() => {
                    setMyEmotion(emotion);
                  }}>
                  <Emotion
                    type={assetStore.emotionsRound[emotion]}
                    source={{uri: assetStore.emotionsRound[emotion]}}
                    pageWidth={pageWidth}
                  />
                </TouchableOpacity>
                <EmotionName>{EMOTION_KOREAN[emotion]}</EmotionName>
              </EmotionWrapper>
            ))}
          </EmotionSelection>
          <EmotionSelection>
            {emotionKeys.slice(emotionKeys.length / 2).map(emotion => (
              <EmotionWrapper key={emotion}>
                <TouchableOpacity
                  onPress={() => {
                    setMyEmotion(emotion);
                  }}>
                  <Emotion
                    type={assetStore.emotionsRound[emotion]}
                    source={{uri: assetStore.emotionsRound[emotion]}}
                    pageWidth={pageWidth}
                  />
                </TouchableOpacity>
                <EmotionName>{EMOTION_KOREAN[emotion]}</EmotionName>
              </EmotionWrapper>
            ))}
          </EmotionSelection>
        </EmotionModalWrapper>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            borderTopWidth: 0.3,
            borderTopColor: Colors.borderDark,
          }}>
          <EmotionConfirmBtn
            onPress={() => {
              setMyEmotion(me?.data[0]?.type);
              setMyModal(false);
            }}>
            <EmotionConfirmText>취소</EmotionConfirmText>
          </EmotionConfirmBtn>
          <EmotionConfirmBtn
            style={{
              borderLeftWidth: 0.3,
              borderLeftColor: Colors.borderDark,
            }}
            onPress={() => {
              if (myEmotion === 'null' && me?.data[0].type !== null) {
                deleteDailyEmotion.mutate(me?.data[0]?.emotionId);
              } else if (me?.data[0].type === null) {
                createDailyEmotion.mutate({type: myEmotion});
              } else {
                editDailyEmotion.mutate({
                  id: me?.data[0]?.emotionId,
                  type: myEmotion,
                });
              }
              setMyModal(false);
            }}>
            <EmotionConfirmText>완료</EmotionConfirmText>
          </EmotionConfirmBtn>
        </View>
        {/* <TouchableOpacity
          style={{ position: "absolute", top: 0, right: 0, padding: 10 }}
          onPress={() => setMyModal(false)}
        >
          <Ionicons name="close" size={22} color={Colors.borderDark} />
        </TouchableOpacity> */}
      </ModalContainer>
    </Modal>
  );

  const renderFamilyModal = () => (
    <Modal
      isVisible={isFamilyModal}
      onBackdropPress={() => {
        setMyEmotion(me?.data[0]?.type);
        setFamilyModal(false);
      }}
      onSwipeComplete={() => {
        setMyEmotion(me?.data[0]?.type);
        setFamilyModal(false);
      }}
      onBackButtonPress={() => {
        setMyEmotion(me?.data[0]?.type);
        setFamilyModal(false);
      }}
      onModalHide={() => {
        setIsPoked(false);
      }}
      swipeDirection="down"
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={pageHeight + StatusBar.currentHeight + 10}>
      <ModalContainer>
        {/* <TouchableOpacity
          style={{ position: "absolute", top: 0, right: 0, padding: 10 }}
          onPress={() => setFamilyModal(false)}
        >
          <Ionicons name="close" size={22} color={Colors.borderDark} />
        </TouchableOpacity> */}

        <EmotionModalWrapper>
          <EmotionWrapper>
            <Emotion
              type={assetStore.emotionsRound[familyPressed?.type]}
              source={{
                uri: assetStore.emotionsRound[familyPressed?.type],
              }}
              style={{borderRadius: 50, width: 100, height: 100}}
              pageWidth={pageWidth}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <EmotionOwner>
                {familyStore.members[familyPressed?.id] ||
                  familyPressed?.userName}
              </EmotionOwner>
            </View>
          </EmotionWrapper>

          <View style={{marginTop: 10, marginBottom: 5, paddingHorizontal: 15}}>
            <EmotionModalText>
              {isPoked
                ? `${
                    familyStore.members[familyPressed?.id] ||
                    familyPressed?.userName
                  }님에게 알림을 전송하였습니다.`
                : familyPressed?.type !== null
                ? `오늘 나의 감정은 ${
                    EMOTION_KOREAN[familyPressed?.type]
                  }입니다!`
                : '찌르기를 눌러서 오늘의 감정을 물어보세요'}
            </EmotionModalText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              paddingHorizontal: 15,
              justifyContent: 'center',
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <FamilyModalBtn
                pageWidth={pageWidth}
                onPress={() => {
                  setFamilyModal(false);
                  navigation.navigate(ROUTE_NAME.CHANGE_NICKNAME, {
                    id: familyPressed?.id,
                    name: familyPressed?.userName,
                    nickname: familyStore.members[familyPressed?.id],
                  });
                }}>
                <Ionicons name="pencil" size={24} />
              </FamilyModalBtn>
              <Text
                style={{
                  fontFamily: 'nanum-regular',
                  paddingVertical: 5,
                  fontSize: 13,
                }}>
                이름수정
              </Text>
            </View>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <FamilyModalBtn
                pageWidth={pageWidth}
                onPress={() => {
                  setFamilyModal(false);
                  navigation.navigate(ROUTE_NAME.FAMILYPEDIA_MEMBER, {
                    pediaId: familyPressed?.pediaId,
                  });
                }}>
                <Ionicons name="person" size={24} />
              </FamilyModalBtn>
              <Text
                style={{
                  fontFamily: 'nanum-regular',
                  paddingVertical: 5,
                  fontSize: 13,
                }}>
                인물사전
              </Text>
            </View>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <FamilyModalBtn
                pageWidth={pageWidth}
                onPress={() => {
                  if (!isPoked) {
                    pokeDailyEmotion.mutate({targetId: familyPressed?.id});
                    setIsPoked(true);
                  }
                }}>
                <Ionicons name="notifications" size={24} />
              </FamilyModalBtn>
              <Text
                style={{
                  fontFamily: 'nanum-regular',
                  paddingVertical: 5,
                  fontSize: 13,
                }}>
                찌르기
              </Text>
            </View>
          </View>
        </EmotionModalWrapper>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            borderTopWidth: 0.3,
            borderTopColor: Colors.borderDark,
          }}>
          <EmotionConfirmBtn
            onPress={() => {
              setFamilyModal(false);
            }}>
            <EmotionConfirmText>닫기</EmotionConfirmText>
          </EmotionConfirmBtn>
        </View>
      </ModalContainer>
    </Modal>
  );

  if (isMyPage) {
    return (
      <Container
        style={{borderBottomWidth: 0, alignItems: 'center', marginTop: 30}}>
        <EmotionWrapper>
          <TouchableOpacity
            onPress={() => {
              setMyEmotion(me?.data[0].type);
              setMyModal(true);
            }}>
            <Emotion
              style={{height: 120, width: 120, borderRadius: 60}}
              pageWidth={pageWidth}
              type={assetStore.emotionsRound[me?.data[0].type]}
              source={{uri: assetStore.emotionsRound[me?.data[0].type]}}
            />
          </TouchableOpacity>
        </EmotionWrapper>
        {renderMyModal()}
      </Container>
    );
  }

  return (
    <Container>
      {isTitle && <Header>오늘의 우리가</Header>}

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{alignItems: 'flex-start'}}>
        {renderEmotion({
          id: me?.data[0].userId,
          owner: me?.data[0].userName, // familyStore.members[me?.data[0].userId], //
          type: me?.data[0].type,
          isMe: true,
        })}
        {Boolean(me?.data[0].familyId) &&
          family?.data.map(member => {
            return renderEmotion({
              id: member.userId,
              owner: member.userName,
              type: member.type,
              isMe: false,
              pediaId: member.pediaId,
            });
          })}
      </ScrollView>
      {renderMyModal()}
      {renderFamilyModal()}
    </Container>
  );
}

export default observer(DailyEmotion);

DailyEmotion.propTypes = {
  isMyPage: PropTypes.bool,
  isTitle: PropTypes.bool,
};
