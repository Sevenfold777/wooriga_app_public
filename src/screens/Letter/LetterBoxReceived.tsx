import React, {useEffect, useState} from 'react';
import {Letter} from '../../components/letter/LetterBox';
import ScreenLayout from '../../components/common/ScreenLayout';
import {DeviceEventEmitter, FlatList} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {ActivityIndicator} from 'react-native';
import {findLettersReceivedApi} from '../../api/LetterApi';
import {NoContentContainer} from '../../components/NoContent';
import {NoContentText} from '../../components/NoContent';
import familyStore from '../../stores/FamilyStore';
import {LetterBoxScreenProps} from '../../navigators/types';
import {EMOTION_KOREAN} from '../../Config';

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
};

export default function LetterBoxReceived({}: LetterBoxScreenProps<'LetterBoxReceived'>) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [letters, setLetters] = useState<LetterType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-query: get letters */
  const {refetch: refetchLetters} = useQuery(
    ['LettersReceived', {prev}],
    () => findLettersReceivedApi({prev}),
    {
      onSuccess: ({data}: {data: LetterType[]}) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setLetters([...letters, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: queryEnable,
    },
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setLetters([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetchLetters();

    setRefreshing(false);
  };

  const renderLetter = ({item: letter}: {item: LetterType}) => (
    <Letter
      id={letter.id}
      isRead={letter.isRead} // 백엔드 수정 필요
      title={letter.title}
      receiveDate={new Date(letter.receiveDate)}
      target={familyStore.members[letter.sender?.id] || letter.sender?.userName}
      isTemp={letter.isTemp}
      isTimeCapsule={false}
      isSent={false}
    />
  );

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener(
      'isRead',
      ({letterId}) => {
        const indexToChange = letters.findIndex(
          letter => letter.id === letterId,
        );

        // console.log(id, isMetoo, metoosCount);
        const newLetters = letters.map((letter, index) => {
          if (index === indexToChange) {
            const newLetter = letter;

            newLetter.isRead = true;

            return newLetter;
          } else {
            return letter;
          }
        });

        setLetters(newLetters);
      },
    );

    return () => unsubscribe.remove();
  }, [letters]);

  if (letters.length === 0 && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FlatList
        data={letters}
        renderItem={renderLetter}
        contentContainerStyle={{paddingHorizontal: 12, paddingBottom: 15}}
        style={{marginTop: 15}}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={() => {
          if (!isLast && !isLoading) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.01}
        scrollEnabled={!isLoading}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <NoContentContainer style={{paddingVertical: 200}}>
            <NoContentText>
              {'아직 받은 편지가 없습니다\n가족과 편지를 주고 받아 보세요'}
            </NoContentText>
          </NoContentContainer>
        )}
      />
    </ScreenLayout>
  );
}
