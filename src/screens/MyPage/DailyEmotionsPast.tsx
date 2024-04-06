import {useQuery} from '@tanstack/react-query';
import React, {useMemo, useState} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {findFamilyEmotionsApi} from '../../api/DailyEmotionApi';
import DailyEmotion, {
  Container,
  Emotion,
  EmotionOwner,
  EmotionWrapper,
  Header,
} from '../../components/DailyEmotion';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import authStore from '../../stores/AuthStore';
import familyStore from '../../stores/FamilyStore';
import {observer} from 'mobx-react-lite';
import {EMOTION_KOREAN} from '../../Config';
import {FlatList} from 'react-native';
import {findMyFamilyApi} from '../../api/FamilyApi';
import {useWindowDimensions} from 'react-native';
import assetStore from '../../stores/AssetStore';
import {SignedInScreenProps} from '../../navigators/types';

type EmotionType = {
  date: string;
  emotions: {userId: number; type: keyof typeof EMOTION_KOREAN | 'null'}[];
};

function DailyEmotionsPast({}: SignedInScreenProps<'DailyEmotionsPast'>) {
  const family = Object.keys(familyStore.members)
    .map(memberId => parseInt(memberId, 10))
    .filter(memberId => memberId !== authStore.userId);

  const {width: pageWidth} = useWindowDimensions();

  const {isLoading: familyIsLoading} = useQuery(['MyFamily', true], () =>
    findMyFamilyApi(true),
  );

  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [emotions, setEmotions] = useState<EmotionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** { date: Date, emotions: {userId: number, type: string}[] } */
  const {} = useQuery(
    ['familyEmotionsAll', {prev}],
    () => findFamilyEmotionsApi({prev}),
    {
      onSuccess: ({data}: {data: EmotionType[]}) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setEmotions([...emotions, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: queryEnable,
    },
  );

  const renderEmotion = ({
    id,
    type,
    isMe,
  }: {
    id: number;
    type: keyof typeof EMOTION_KOREAN | 'null';
    isMe: boolean;
  }) => {
    return (
      <EmotionWrapper key={id}>
        <Emotion
          source={{uri: assetStore.emotionsRound[type]}}
          width={(pageWidth - 100) / 4}
          height={(pageWidth - 100) / 4}
          borderRadius={(pageWidth - 100) / 8}
        />
        <EmotionOwner style={{maxWidth: (pageWidth - 100) / 4}}>
          {isMe ? authStore.userName : familyStore.members[id]}
        </EmotionOwner>
      </EmotionWrapper>
    );
  };

  const renderEmotions = ({item: emotion}: {item: EmotionType}) => {
    const dateObj = new Date(emotion.date);
    const now = new Date();

    const date =
      now.getFullYear() === dateObj.getFullYear()
        ? `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
        : `${dateObj.getFullYear()}년 ${
            dateObj.getMonth() + 1
          }월 ${dateObj.getDate()}일`;

    const meFound = emotion.emotions.find(
      member => authStore.userId === member.userId,
    );

    const myEmotion = meFound
      ? renderEmotion({
          id: authStore.userId,
          type: meFound.type,
          isMe: true,
        })
      : renderEmotion({id: authStore.userId, type: 'null', isMe: true});

    return (
      <Container key={emotion.date}>
        <Header>{`${date}`}</Header>
        <ScrollView
          style={{paddingVertical: 5}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{alignItems: 'flex-start'}}>
          {myEmotion}

          {family.map(memberId => {
            const userFound = emotion.emotions.find(
              member => memberId === member.userId,
            );

            const result = userFound
              ? renderEmotion({id: memberId, type: userFound.type, isMe: false})
              : renderEmotion({id: memberId, type: 'null', isMe: false});

            return result;
          })}
        </ScrollView>
      </Container>
    );
  };

  if ((emotions.length === 0 || familyIsLoading) && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        data={emotions}
        renderItem={renderEmotions}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!isLast && !isLoading) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.01}
        scrollEnabled={!isLoading}
        ListHeaderComponent={() => <DailyEmotion />}
      />
      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}
    </ScreenLayout>
  );
}

export default observer(DailyEmotionsPast);
