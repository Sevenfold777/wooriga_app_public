import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import authStore from '../stores/AuthStore';
import {Colors} from '../Config';

const Container = styled.View`
  flex-direction: row;
  padding: 10px 10px 10px 10px;
`;

const Body = styled.View`
  flex: 1;
  padding: 0px 10px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const Username = styled.Text`
  margin-top: 10px;
  font-family: 'nanum-bold';
  font-size: 12px;
`;

const TimeWritten = styled.Text`
  padding: 2px 7px;
  font-size: 9px;
  font-family: 'nanum-regular';
`;

const Payload = styled.Text`
  padding: 5px 5px 0px 5px;
  font-family: 'nanum-regular';
  font-size: 13px;
  line-height: 17px;
`;

const Actions = styled.View`
  flex-direction: row;
  margin-top: 5px;
`;

const Details = styled.TouchableOpacity`
  padding: 5px;
`;

export const CommentInputContainer = styled.View`
  flex-direction: row;
  background-color: white;
  padding: 0px 10px;
`;

export const MoreCommentsContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 20px 5px;
`;

export const MoreCommentsText = styled.Text`
  color: ${Colors.borderDark};
  font-size: 12px;
  font-family: 'nanum-regular';
  border: 0.5px solid ${Colors.borderDark};
  border-radius: 18px;
  padding: 10px 20px;
  justify-content: center;
`;

export function timeFormatter(rawTime: string) {
  const now = new Date();
  const targetTime = new Date(rawTime);

  const timeDiff = now.getTime() - targetTime.getTime();

  const minutesBetween = Math.floor(timeDiff / 1000 / 60);
  const hoursBetween = Math.floor(timeDiff / 1000 / 60 / 60);

  let result;

  // 1. 1분 이내 = 방금전
  if (minutesBetween < 1) {
    result = '방금 전';
  }
  // 2. 1시간 이내 = 0분 전
  else if (minutesBetween < 60) {
    result = `${minutesBetween}분 전`;
  }
  // 3. 24시간 이내 = 0시간 전
  else if (hoursBetween < 24) {
    result = `${hoursBetween}시간 전`;
  }
  // 4. 올해가 아님 = 0000년 00월 00일
  else if (now.getFullYear() !== targetTime.getFullYear()) {
    result = targetTime.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  // 5. 올해 = 00월 00일
  else {
    result = targetTime.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  }

  return result;
}

type Props = {
  userId: number;
  userName: string;
  timeWritten: string;
  payload: string;
  onLongPress?: () => void;
  isDetail: boolean;
};

export default function Comment({
  userId,
  userName,
  timeWritten,
  payload,
  onLongPress,
  isDetail,
}: Props) {
  const formattedTime = timeFormatter(timeWritten);

  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      <Container>
        {/* <ProfileImage source={{ uri: profileImage }} /> */}
        <Body>
          <Header>
            <Username
              style={userId === authStore.userId && {color: Colors.main}}>
              {/* {userId === myId ? userName : familyStore.members[userId]} */}
              {userName}
            </Username>

            <TimeWritten>{formattedTime}</TimeWritten>
          </Header>
          <Payload>{payload}</Payload>
        </Body>
        <Actions>
          {isDetail && (
            <Details onPress={onLongPress}>
              <Ionicons
                name="ellipsis-vertical"
                size={14}
                color={Colors.borderDark}
              />
            </Details>
          )}
        </Actions>
      </Container>
    </TouchableWithoutFeedback>
  );
}

Comment.propTypes = {
  userId: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  timeWritten: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
  onLongPress: PropTypes.func,
  isDetail: PropTypes.bool.isRequired,
};
