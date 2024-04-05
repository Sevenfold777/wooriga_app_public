import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  ScrollView,
  TouchableOpacity,
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
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import familyStore from '../stores/FamilyStore';
import {observer} from 'mobx-react-lite';
import {Colors, EMOTION_KOREAN} from '../Config';
import assetStore from '../stores/AssetStore';
import PropTypes from 'prop-types';
import emotionStore from '../stores/EmotionStore';
import Modal from './modals/Modal';
import {RowContainer} from './common/Common';

export const Container = styled.View`
  padding: 5px 10px 10px 10px;
  border-bottom-color: ${Colors.borderLight};
  border-bottom-width: 1px;
  justify-content: center;
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
`;

export const EmotionModalText = styled.Text`
  text-align: center;
  font-family: 'nanum-regular';
  line-height: 18px;
`;

export const EmotionName = styled.Text`
  padding: 5px;
  font-family: 'nanum-regular';
`;

const FamilyModalBtnList = styled.View`
  flex-direction: row;
  margin-top: 15px;
  padding: 0px 15px;
  justify-content: center;
`;

const FamilyModalBtnContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const FamilyModalBtn = styled.TouchableOpacity<{pageWidth: number}>`
  border-radius: ${props => (props.pageWidth - 140) / 8}px;
  width: ${props => (props.pageWidth - 140) / 4}px;
  height: ${props => (props.pageWidth - 140) / 4}px;
  justify-content: center;
  align-items: center;
  margin: 0px 15px 5px 15px;
  background-color: ${Colors.sub};
`;

const FamilyModalBtnText = styled.Text`
  font-family: 'nanum-regular';
  padding: 5px 0px;
  font-size: 13px;
`;

export type EmotionType = keyof typeof EMOTION_KOREAN | null;

type DailyEmotiontype = {
  pediaId: number;
  emotionId: number | null;
  familyId: number;
  type: EmotionType;
  userId: number;
  userName: string;
};

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
      onSuccess: ({data}: {data: DailyEmotiontype[]}) => {
        setMyEmotion(data[0].type);
        emotionStore.setEmotionChosen(Boolean(data[0].type));
      },
    },
  );

  /** 2. Family Daily Emotion */
  const {data: family, refetch: refetchFamily} = useQuery(
    ['FamilyWithEmotions'],
    findFamEmotionsTodayApi,
    {
      enabled: Boolean(me?.data[0].familyId),
      onSuccess: ({data: result}: {data: DailyEmotiontype[]}) => {
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

  const renderEmotion = ({
    id,
    owner,
    type,
    isMe,
    pediaId,
  }: {
    id: number;
    owner: string;
    type: EmotionType;
    isMe: boolean;
    pediaId: number;
  }) => {
    return (
      <EmotionWrapper key={id}>
        <TouchableOpacity
          onPress={() => {
            if (isMe) {
              emotionStore.setEmotionChosen(true);
              setMyModal(true);
            } else {
              setFamilyPressed({id, userName: owner, type, pediaId});
              setFamilyModal(true);
            }
          }}>
          <Emotion
            source={{uri: assetStore.emotionsRound[type]}}
            width={(pageWidth - 100) / 4}
            height={(pageWidth - 100) / 4}
            borderRadius={(pageWidth - 100) / 8}
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
  const [myEmotion, setMyEmotion] = useState<EmotionType>(null);
  const [isFamilyModal, setFamilyModal] = useState(false);
  const [familyPressed, setFamilyPressed] = useState<{
    id: number;
    userName: string;
    pediaId: number;
  }>();

  const renderMyModal = () => (
    <Modal
      isVisible={isMyModal}
      onClose={() => {
        if (me) {
          setMyEmotion(me.data[0].type);
        }
        setMyModal(false);
      }}
      onConfirm={() => {
        if (!me?.data) {
          return;
        }

        if (me.data[0].type === null) {
          createDailyEmotion.mutate({type: myEmotion});
        } else if (me.data[0].emotionId !== null) {
          editDailyEmotion.mutate({
            id: me.data[0].emotionId,
            type: myEmotion,
          });
        }
        setMyModal(false);
      }}>
      <EmotionModalWrapper>
        <EmotionWrapper>
          <Emotion
            source={{
              uri: assetStore.emotionsRound[myEmotion ? myEmotion : 'null'],
            }}
            style={{borderRadius: 50, width: 100, height: 100}}
          />
          <EmotionOwner>{me?.data[0].userName}</EmotionOwner>
        </EmotionWrapper>

        <EmotionModalTextContainer>
          <EmotionModalText>오늘의 감정을 선택해주세요</EmotionModalText>
        </EmotionModalTextContainer>

        <EmotionSelection>
          {emotionKeys.slice(0, 3).map(emotion => (
            <EmotionWrapper key={emotion}>
              <TouchableOpacity
                onPress={() => {
                  setMyEmotion(emotion);
                }}>
                <Emotion
                  source={{uri: assetStore.emotionsRound[emotion]}}
                  width={(pageWidth - 100) / 4}
                  height={(pageWidth - 100) / 4}
                  borderRadius={(pageWidth - 100) / 8}
                />
              </TouchableOpacity>
              <EmotionName>{EMOTION_KOREAN[emotion]}</EmotionName>
            </EmotionWrapper>
          ))}
        </EmotionSelection>
        <EmotionSelection>
          {emotionKeys.slice(3).map(emotion => (
            <EmotionWrapper key={emotion}>
              <TouchableOpacity
                onPress={() => {
                  setMyEmotion(emotion);
                }}>
                <Emotion
                  source={{uri: assetStore.emotionsRound[emotion]}}
                  width={(pageWidth - 100) / 4}
                  height={(pageWidth - 100) / 4}
                  borderRadius={(pageWidth - 100) / 8}
                />
              </TouchableOpacity>
              <EmotionName>{EMOTION_KOREAN[emotion]}</EmotionName>
            </EmotionWrapper>
          ))}
        </EmotionSelection>
      </EmotionModalWrapper>
    </Modal>
  );

  const renderFamilyModal = () => (
    <Modal
      isVisible={isFamilyModal}
      confirmExist={false}
      onClose={() => setFamilyModal(false)}
      onCloseEnd={() => setIsPoked(false)}>
      <EmotionModalWrapper>
        <EmotionWrapper>
          <Emotion
            source={{
              uri: assetStore.emotionsRound[
                familyPressed?.type ? familyPressed.type : 'null'
              ],
            }}
            width={100}
            height={100}
            borderRadius={50}
          />

          <RowContainer>
            <EmotionOwner>
              {familyStore.members[familyPressed?.id] ||
                familyPressed?.userName}
            </EmotionOwner>
          </RowContainer>
        </EmotionWrapper>

        <View style={{marginTop: 10, marginBottom: 5, paddingHorizontal: 15}}>
          <EmotionModalText>
            {familyPressed && isPoked
              ? `${
                  familyStore.members[familyPressed?.id] ||
                  familyPressed?.userName
                }님에게 알림을 전송하였습니다.`
              : familyPressed?.type !== null
              ? `오늘 나의 감정은 ${EMOTION_KOREAN[familyPressed?.type]}입니다!`
              : '찌르기를 눌러서 오늘의 감정을 물어보세요'}
          </EmotionModalText>
        </View>

        <FamilyModalBtnList>
          <FamilyModalBtnContainer>
            <FamilyModalBtn
              pageWidth={pageWidth}
              onPress={() => {
                setFamilyModal(false);
                if (familyPressed) {
                  navigation.navigate('ChangeNickname', {
                    id: familyPressed.id,
                    name: familyPressed.userName,
                    nickname: familyStore.members[familyPressed.id],
                  });
                }
              }}>
              <Ionicons name="pencil" size={24} />
            </FamilyModalBtn>
            <FamilyModalBtnText>이름수정</FamilyModalBtnText>
          </FamilyModalBtnContainer>

          <FamilyModalBtnContainer>
            <FamilyModalBtn
              pageWidth={pageWidth}
              onPress={() => {
                setFamilyModal(false);
                if (familyPressed) {
                  navigation.navigate('FamilyPediaMember', {
                    pediaId: familyPressed.pediaId,
                  });
                }
              }}>
              <Ionicons name="person" size={24} />
            </FamilyModalBtn>
            <FamilyModalBtnText>인물사전</FamilyModalBtnText>
          </FamilyModalBtnContainer>

          <FamilyModalBtnContainer>
            <FamilyModalBtn
              pageWidth={pageWidth}
              onPress={() => {
                if (!isPoked && familyPressed) {
                  pokeDailyEmotion.mutate({targetId: familyPressed.id});
                  setIsPoked(true);
                }
              }}>
              <Ionicons name="notifications" size={24} />
            </FamilyModalBtn>
            <FamilyModalBtnText>찌르기</FamilyModalBtnText>
          </FamilyModalBtnContainer>
        </FamilyModalBtnList>
      </EmotionModalWrapper>
    </Modal>
  );

  if (isMyPage && me) {
    return (
      <Container style={{alignItems: 'center', marginTop: 30}}>
        <EmotionWrapper>
          <TouchableOpacity
            onPress={() => {
              if (me) {
                setMyEmotion(me.data[0].type);
              }
              emotionStore.setEmotionChosen(true);
              setMyModal(true);
            }}>
            <Emotion
              width={120}
              height={120}
              borderRadius={60}
              source={{uri: assetStore.emotionsRound[me.data[0].type]}}
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
        {me
          ? renderEmotion({
              id: me.data[0].userId,
              owner: me.data[0].userName,
              type: me.data[0].type,
              isMe: true,
              pediaId: me.data[0].pediaId,
            })
          : null}
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
