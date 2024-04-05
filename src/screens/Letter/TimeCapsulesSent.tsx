import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, FlatList, View} from 'react-native';
import styled from 'styled-components/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import {TimeCapsule} from '../../components/letter/LetterTheme';
import {ROUTE_NAME} from '../../Strings';
import {findLettersSentApi} from '../../api/LetterApi';
import {NoContentContainer, NoContentText} from '../../components/NoContent';
import {ActivityIndicator} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import familyStore from '../../stores/FamilyStore';

const Wrapper = styled.View`
  padding: 0px 12px 0px 12px;
`;

export default function TimeCapsulesSent({navigation, route}) {
  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-query: get letters */
  const {
    data,
    isLoading: lettersIsLoading,
    refetch: refetchLetters,
  } = useQuery(
    ['LettersSent', {prev}],
    () => findLettersSentApi({prev, isTimeCapsule: true}),
    {
      onSuccess: ({data}) => {
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

  const renderLetter = ({item: letter}) => (
    <TimeCapsule
      id={letter.id}
      title={letter.title}
      progress={((Math.random() * 100) % 7).toFixed(1)}
      createdAt={new Date(letter.createdAt)}
      receiveDate={new Date(letter.receiveDate)}
      target={
        familyStore.members[letter.receiver?.id] || letter.receiver?.userName
      }
      isSent={true}
    />
  );

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener(
      'isDeleted',
      ({letterId}) => {
        const newLetters = letters.filter(letter => letterId !== letter.id);
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
