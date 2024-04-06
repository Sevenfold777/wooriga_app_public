import React from 'react';
import styled from 'styled-components/native';
import {Colors} from '../../Config';
import {Ionicons} from '@expo/vector-icons';
import {RowContainer} from '../common/Common';
import {Image, AppState} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import assetStore from '../../stores/AssetStore';
import PropTypes from 'prop-types';
import {useEffect, useRef, useState} from 'react';
import {getTimeCapsuleTime} from './LetterBox';

export const ThemeContainer = styled.TouchableOpacity`
  background-color: white;
  justify-content: center;
  padding: 17px 20px;
  border: 0.5px solid ${Colors.borderDark};
  margin: 3px 0px;
  border-radius: 10px;
`;

export const ThemeDetail = styled.View`
  padding: 0px 10px;
`;

export const ThemeTextBold = styled.Text`
  padding: 2px 0px;
  font-family: 'nanum-bold';
`;

export const ThemeText = styled.Text`
  font-size: 13px;
  padding: 2px 0px;
  font-family: 'nanum-regular';
`;

export const ProgressBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.borderLight};
  margin: 10px 0px;
  border-radius: 7px;
`;

export const Progress = styled.View<{percentage: number}>`
  border-radius: 7px;
  padding: 5px 0px;
  flex: ${props => props.percentage};
  justify-content: center;
  align-items: center;
`;

export const ReceiverContainer = styled.View`
  justify-content: center;
  align-items: flex-end;
`;

export const ChgHashTagText = styled(ThemeText)`
  margin-right: 5px;
  color: ${Colors.main};
`;

type Prop = {
  id: number;
  title: string;
  isSent?: boolean;
  createdAt: Date;
  receiveDate: Date;
  target: string;
};

export function TimeCapsule({
  id,
  title,
  isSent = false,
  createdAt,
  receiveDate,
  target,
}: Prop) {
  const now = new Date();
  const nowNum = now.getTime();
  const received = receiveDate.getTime();
  const created = createdAt.getTime();
  const navigation = useNavigation();

  const [progress, setProgress] = useState(
    receiveDate.getTime() <= now.getTime()
      ? 100
      : Math.floor(((nowNum - created) / (received - created)) * 100),
  );
  const [isCompleted, setCompleted] = useState(received <= nowNum);
  const [timer, setTimer] = useState(getTimeCapsuleTime(receiveDate));

  useEffect(() => {
    const tiks = setInterval(() => {
      // 초 countdown
      if (progress < 100) {
        setProgress(
          Math.floor(
            ((new Date().getTime() - created) / (received - created)) * 100,
          ),
        );

        const timeString = getTimeCapsuleTime(receiveDate);

        setTimer(timeString);
      }
      // minute countdown
      else if (progress >= 100) {
        setProgress(100);
        setCompleted(true);
        clearInterval(tiks);
      }
    }, 1000); // for every 1000ms

    return () => clearInterval(tiks);
  }, [progress]);

  /** handling fore/background */
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setProgress(
          Math.floor(
            ((new Date().getTime() - created) / (received - created)) * 100,
          ),
        );
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContainer
      onPress={() => {
        if (isSent) {
          navigation.navigate('LetterSent', {
            letterId: id,
            isTimeCapsule: true,
            isCompleted,
            receiveDate: JSON.stringify(receiveDate),
          });
        } else if (isCompleted) {
          navigation.navigate('LetterReceived', {
            letterId: id,
          });
        }
      }}
      disabled={!isSent && !isCompleted}>
      <RowContainer>
        <Ionicons name="alarm-outline" size={14} style={{marginRight: 5}} />
        <ThemeTextBold numberOfLines={1}>{title}</ThemeTextBold>
      </RowContainer>
      <ThemeDetail>
        <ThemeText>{`작성일: ${createdAt.toLocaleDateString('ko-KR', {
          ...(createdAt.getFullYear() !== now.getFullYear() && {
            year: 'numeric',
          }),
          month: 'long',
          day: 'numeric',
        })}`}</ThemeText>

        <RowContainer>
          {isCompleted ? (
            <ThemeText style={{fontFamily: 'nanum-bold'}}>
              {`공개완료: ${receiveDate.toLocaleDateString('ko-KR', {
                ...(receiveDate.getFullYear() !== now.getFullYear() && {
                  year: 'numeric',
                }),
                month: 'long',
                day: 'numeric',
              })}`}
            </ThemeText>
          ) : (
            <ThemeText
              style={{
                fontFamily: 'nanum-bold',
              }}>{`${timer} 후 공개`}</ThemeText>
          )}
        </RowContainer>

        <ProgressBar>
          <Progress
            percentage={progress}
            style={{backgroundColor: isCompleted ? Colors.main : Colors.sub}}
          />
          <Progress percentage={100 - progress} />

          <Image
            source={{uri: assetStore.messageEmotions['passion']}}
            style={{
              width: 30,
              height: 30,
              position: 'absolute',
              left: `${progress - 3}%`,
            }}
            resizeMode="contain"
          />
        </ProgressBar>
        {isCompleted ? (
          <RowContainer>
            <ThemeText
              style={{flex: 1, color: '#3d6acb', fontFamily: 'nanum-bold'}}>
              {`${
                3 - Math.floor((nowNum - received) / (1000 * 60 * 60 * 24))
              }일 뒤 ${isSent ? '보낸' : '받은'} 편지함으로 이동됩니다`}
            </ThemeText>
            <ThemeText>{`${isSent ? 'to' : 'from'}. ${
              target || '알 수 없음'
            }`}</ThemeText>
          </RowContainer>
        ) : (
          <ReceiverContainer>
            <ThemeText>{`${isSent ? 'to' : 'from'}. ${
              target || '알 수 없음'
            }`}</ThemeText>
          </ReceiverContainer>
        )}
      </ThemeDetail>
    </ThemeContainer>
  );
}

TimeCapsule.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool,
  isSent: PropTypes.bool,
  createdAt: PropTypes.object.isRequired,
  receiveDate: PropTypes.object.isRequired,
  target: PropTypes.string,
};
