import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from '../../Config';
import {TouchableWithoutFeedback} from 'react-native';
import {getTimeCapsuleTime} from '../../components/letter/LetterBox';
import {SignedInScreenProps} from '../../navigators/types';

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 80%;
`;

const PromptText = styled.Text`
  padding: 3px;
  font-size: 16px;
  font-family: 'nanum-bold';
`;

const ToLetterText = styled.Text`
  color: #3d6acb;
  padding: 5px;
  font-family: 'nanum-bold';
`;

const TimerContainer = styled.View`
  margin: 10px;
  border-radius: 10px;
  background-color: ${Colors.sub};
  padding: 15px 35px;
  justify-content: center;
  align-items: center;
`;

const SubText = styled.Text`
  font-family: 'nanum-regular';
  text-align: right;
  padding: 0px 5px;
`;

export default function LetterCompleted({
  navigation,
  route: {params},
}: SignedInScreenProps<'LetterCompleted'>) {
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

      if (timeLeft > 0) {
        const timeString = getTimeCapsuleTime(receiveDate);
        setTimer(timeString);
      } else if (interval) {
        clearInterval(interval);
      }
    };

    if (params.isTimeCapsule && params.receiveDate) {
      const receiveDate = new Date(JSON.parse(params.receiveDate));

      setTimeLeft({receiveDate});

      const tiks = setInterval(() => {
        // 초 countdown
        setTimeLeft({receiveDate, interval: tiks});
      }, 1000); // for every 1000ms

      return () => clearInterval(tiks);
    }
  }, [timer]);

  if (params.isTimeCapsule) {
    return (
      <ScreenLayout>
        <Container>
          <Ionicons name="alarm-outline" size={60} style={{padding: 10}} />
          <PromptText>마음이 담긴</PromptText>
          <PromptText>타임캡슐을 보관하였습니다</PromptText>
          <TimerContainer>
            <PromptText style={{marginBottom: 5}}>{timer}</PromptText>
            <SubText>뒤에 타임캡슐이 공개됩니다</SubText>
          </TimerContainer>

          <TouchableWithoutFeedback
            onPress={() =>
              navigation.replace('LetterSent', {
                letterId: params.letterId,
                isTimeCapsule: true,
                receiveDate: params.receiveDate,
              })
            }>
            <ToLetterText>작성된 편지 보기</ToLetterText>
          </TouchableWithoutFeedback>
        </Container>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Container>
        <Ionicons name="paper-plane-outline" size={60} style={{padding: 10}} />
        <PromptText>{`${params.targetString} 님에게`}</PromptText>
        <PromptText>마음이 담긴 편지를 발송하였습니다</PromptText>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.replace('LetterSent', {
              letterId: params.letterId,
            })
          }>
          <ToLetterText>작성된 편지 보기</ToLetterText>
        </TouchableWithoutFeedback>
      </Container>
    </ScreenLayout>
  );
}
