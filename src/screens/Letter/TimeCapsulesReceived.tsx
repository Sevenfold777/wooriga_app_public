import React, {useState} from 'react';
import {FlatList} from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import {TimeCapsule} from '../../components/letter/TimeCapsule';
import {findLettersReceivedApi} from '../../api/LetterApi';
import {NoContentContainer, NoContentText} from '../../components/NoContent';
import {useQuery} from '@tanstack/react-query';
import {ActivityIndicator} from 'react-native';
import familyStore from '../../stores/FamilyStore';
import {TimeCapsuleScreenProps} from '../../navigators/types';
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

export default function TimeCapsulesReceived({}: TimeCapsuleScreenProps<'TimeCapsuleReceivd'>) {
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
    () => findLettersReceivedApi({prev, isTimeCapsule: true}),
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
    <TimeCapsule
      id={letter.id}
      title={letter.title}
      createdAt={new Date(letter.createdAt)}
      receiveDate={new Date(letter.receiveDate)}
      target={familyStore.members[letter.sender?.id] || letter.sender?.userName}
    />
  );

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
              {'공개 예정인 타임캡슐이 없습니다\n타임캡슐을 작성해보세요'}
            </NoContentText>
          </NoContentContainer>
        )}
      />
    </ScreenLayout>
  );
}
