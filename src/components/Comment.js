import React, { useEffect, useState } from "react";
import { Text, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import familyStore from "../stores/FamilyStore";
import useMe from "../hooks/useMe";
import authStore from "../stores/AuthStore";
import { useRoute } from "@react-navigation/native";
import { Colors } from "../Config";

// 추후 대댓글 기능 구현 시, TouchableOpacity로 전환
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

// const ProfileImage = styled.Image`
//   width: 40px;
//   height: 40px;
//   border-radius: 20px;
//   //background-color: black;
// `;

const Username = styled.Text`
  margin-top: 10px;
  font-family: "nanum-bold";
  font-size: 12px;
`;

const TimeWritten = styled.Text`
  padding: 2px 7px;
  font-size: 9px;
  font-family: "nanum-regular";
`;

const Payload = styled.Text`
  padding: 5px 5px 0px 5px;
  font-family: "nanum-regular";
  font-size: 13px;
  line-height: 17px;
`;

const Actions = styled.View`
  flex-direction: row;
  margin-top: 5px;
`;

// const Like = styled.TouchableOpacity`
//   padding: 3px 5px;
// `;

const Details = styled.TouchableOpacity`
  //padding: 5px 8px;

  padding: 5px;
`;

export const CommentInputContainer = styled.View`
  flex-direction: row;
  background-color: white;
  padding: 0px 10px;
`;

// export const CommentInput = styled.Text`
//   flex: 1;
//   margin: 10px 5px;
//   padding: 12px;
//   border-radius: 20px;
//   border: 0.5px solid ${Colors.borderDark};
//   color: #c7c7cd;
//   font-weight: 500;
// `;

export const MoreCommentsContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 20px 5px;
`;

export const MoreCommentsText = styled.Text`
  color: ${Colors.borderDark};
  font-size: 12px;
  font-family: "nanum-regular";
  border: 0.5px solid ${Colors.borderDark};
  border-radius: 18px;
  padding: 10px 20px;
  justify-content: center;
`;

export function timeFormatter(rawTime) {
  const now = new Date();
  const targetTime = new Date(rawTime);
  // now.setFullYear(now.getFullYear() + 1); // for debug

  const minutesBetween = Math.floor((now - targetTime) / 1000 / 60);
  const hoursBetween = Math.floor((now - targetTime) / 1000 / 60 / 60);

  let result;

  // 1. 1분 이내 = 방금전
  if (minutesBetween < 1) {
    result = "방금 전";
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
    result = targetTime.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  // 5. 올해 = 00월 00일
  else {
    result = targetTime.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  }

  return result;
}

export default function Comment({
  userId,
  userName,
  timeWritten,
  payload,
  onLongPress,
  isDetail,
}) {
  //isLiked = true; // to check heart color
  // ProfileImage 일단 보류

  // const [isLiked, setIsLiked] = useState(
  //   likes.filter((like) => like.user.id === myId).length // my id로 만들어야
  // );

  const formattedTime = timeFormatter(timeWritten);

  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      <Container>
        {/* <ProfileImage source={{ uri: profileImage }} /> */}
        <Body>
          <Header>
            <Username
              style={userId === authStore.userId && { color: Colors.main }}
            >
              {/* {userId === myId ? userName : familyStore.members[userId]} */}
              {userName}
            </Username>

            <TimeWritten>{formattedTime}</TimeWritten>
          </Header>
          <Payload>{payload}</Payload>
        </Body>
        <Actions>
          {/* <Like
          onPress={() => {
            toggleLike(id, isLiked);
            setIsLiked(!isLiked);
          }}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={18}
            color={isLiked ? "#FACFC9" : "black"}
          />
        </Like> */}

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
