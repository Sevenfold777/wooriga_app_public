import styled from "styled-components/native";
import { Colors } from "../../Config";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { ROUTE_NAME } from "../../Strings";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export const LetterBox = styled.View`
  padding: 15px 12px 0px 12px;
`;

const LetterContainer = styled.TouchableOpacity`
  margin: 3px 0px;
  /* padding: 12px 15px; */
  padding: ${(props) => (props.isSent ? "10px" : "12px")};
  border-radius: 15px;
  background-color: ${(props) => (props.isSent ? Colors.white : Colors.sub)};
  border-width: ${(props) => (props.isSent ? "2px" : "0px")};
  border-color: ${Colors.sub};
`;

const LetterTitle = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 10px;
`;

const LetterDetail = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 20px;
`;

const LetterTextBold = styled.Text`
  padding: 2px 0px;
  font-family: "nanum-bold";
`;

const LetterText = styled.Text`
  padding: 2px 0px;
  font-family: "nanum-regular";
`;

const ReadContainer = styled.View`
  flex-direction: row;
  margin-right: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const TimeCapsuleLeft = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  width: 60px;
  height: 35px;
  background-color: ${Colors.main};
`;

const TimeCapsuleLeftText = styled.Text`
  color: white;
  font-size: 12px;
  font-family: "nanum-regular";
`;

export function Letter({
  id,
  title,
  isSent,
  isRead,
  isTimeCapsule,
  updatedAt,
  receiveDate,
  target,
  isTemp,
}) {
  const navigation = useNavigation();
  const now = new Date();
  const dateString = `${now.getFullYear()}년 ${
    now.getMonth() + 1
  }월 ${now.getDate()}일`;

  const dDate = parseInt((receiveDate - now) / 1000 / 60 / 60 / 24);

  const displayedDate = isSent ? updatedAt : receiveDate;

  if (isTemp) {
    return (
      <LetterContainer
        isSent={isSent}
        onPress={() =>
          navigation.navigate(
            isSent ? ROUTE_NAME.LETTER_SENT : ROUTE_NAME.LETTER_RECEIVED,
            { letterId: id }
          )
        }
        style={{
          backgroundColor: Colors.borderLight,
          borderColor: Colors.borderLight,
        }}
      >
        <LetterTitle>
          <ReadContainer>
            <Ionicons name={"pencil-outline"} size={14} />
          </ReadContainer>
          <LetterTextBold>
            {title || `# ${dateString}, 임시 저장된 편지`}
          </LetterTextBold>
        </LetterTitle>
        <LetterDetail>
          <LetterText style={{ flex: 1, color: Colors.balanceA }}>
            {"임시 저장됨"}
          </LetterText>
          <LetterText style={{ fontSize: 12 }}>
            {displayedDate.toLocaleDateString("ko-KR", {
              ...(displayedDate.getFullYear() !== new Date().getFullYear() && {
                year: "numeric",
              }),
              month: "long",
              day: "numeric",
            })}
          </LetterText>
        </LetterDetail>
      </LetterContainer>
    );
  }

  if (isTimeCapsule && receiveDate > now) {
    return (
      <LetterContainer
        isSent={true}
        onPress={() => {
          navigation.navigate(ROUTE_NAME.LETTER_SENT, {
            letterId: id,
            isTimeCapsule,
            receiveDate: JSON.stringify(receiveDate),
          });
        }}
        style={{ flexDirection: "row" }}
      >
        <View style={{ flex: 1 }}>
          <LetterTitle>
            <ReadContainer>
              <Ionicons name="alarm-outline" size={14} />
            </ReadContainer>
            <LetterTextBold>{title}</LetterTextBold>
          </LetterTitle>
          <LetterDetail>
            <LetterText>{`to. ${target || "알 수 없음"}`}</LetterText>
          </LetterDetail>
        </View>
        <TimeCapsuleLeft>
          <TimeCapsuleLeftText>{`D-${dDate}`}</TimeCapsuleLeftText>
        </TimeCapsuleLeft>
      </LetterContainer>
    );
  }

  return (
    <LetterContainer
      isSent={isSent}
      onPress={() =>
        navigation.navigate(
          isSent ? ROUTE_NAME.LETTER_SENT : ROUTE_NAME.LETTER_RECEIVED,
          { letterId: id }
        )
      }
    >
      <LetterTitle>
        <ReadContainer>
          <Ionicons name={isRead ? "mail-open" : "mail"} size={14} />
        </ReadContainer>
        <LetterTextBold>{title}</LetterTextBold>
      </LetterTitle>
      <LetterDetail>
        <LetterText style={{ flex: 1 }}>
          {isSent
            ? `to. ${target || "알 수 없음"}`
            : `from. ${target || "알 수 없음"}`}
        </LetterText>
        <LetterText style={{ fontSize: 12 }}>
          {displayedDate.toLocaleDateString("ko-KR", {
            ...(displayedDate.getFullYear() !== new Date().getFullYear() && {
              year: "numeric",
            }),
            month: "long",
            day: "numeric",
          })}
        </LetterText>
      </LetterDetail>
    </LetterContainer>
  );
}

Letter.propTypes = {
  isSent: PropTypes.bool,
  isRead: PropTypes.bool,
  isTimeCapsule: PropTypes.bool,
};

export const getTimeCapsuleTime = (receiveDate) => {
  let timeDiff = receiveDate - new Date();

  const dayLeft = parseInt(timeDiff / (1000 * 60 * 60 * 24));
  timeDiff = timeDiff % (1000 * 60 * 60 * 24);

  const hourLeft = parseInt(timeDiff / (1000 * 60 * 60));
  timeDiff = timeDiff % (1000 * 60 * 60);

  const minuteLeft = parseInt(timeDiff / (1000 * 60));
  timeDiff = timeDiff % (1000 * 60);

  const secondLeft = parseInt(timeDiff / 1000);

  const timeString =
    dayLeft === 0
      ? `${String(hourLeft).padStart(2, "0")}:${String(minuteLeft).padStart(
          2,
          "0"
        )}:${String(secondLeft).padStart(2, "0")}`
      : `${String(dayLeft)}일 ${String(hourLeft).padStart(2, "0")}:${String(
          minuteLeft
        ).padStart(2, "0")}:${String(secondLeft).padStart(2, "0")}`;

  return timeString;
};
