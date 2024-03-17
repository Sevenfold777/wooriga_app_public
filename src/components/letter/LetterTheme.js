import styled from "styled-components/native";
import { Colors } from "../../Config";
import { Ionicons } from "@expo/vector-icons";
import { RowContainer } from "../Common";
import { View, Image, AppState } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ROUTE_NAME } from "../../Strings";
import assetStore from "../../stores/AssetStore";
import PropTypes from "prop-types";
import Timer from "../Timer";
import { useEffect, useRef, useState } from "react";
import { getTimeCapsuleTime } from "./LetterBox";

export const ThemeContainer = styled.TouchableOpacity`
  background-color: white;
  justify-content: center;
  padding: 17px 20px;
  border: 0.5px solid ${Colors.borderDark};
  margin: 3px 0px;
  border-radius: 10px;
`;

const ThemeContainerStatic = styled.View`
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
  font-family: "nanum-bold";
`;

export const ThemeText = styled.Text`
  font-size: 13px;
  padding: 2px 0px;
  font-family: "nanum-regular";
`;

export const ProgressBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.borderLight};
  margin: 10px 0px;
  border-radius: 7px;
`;

export const Progress = styled.View`
  border-radius: 7px;
  padding: 5px 0px;
  flex: ${(props) => props.percentage};
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

export function LetterTheme({ id, title, hashtags, isSelect }) {
  const navigation = useNavigation();

  return (
    <ThemeContainer
      onPress={() =>
        navigation.push(ROUTE_NAME.LETTER_THEME_DETAIL, {
          themeId: id,
          headerTitle: title,
          isSelect,
        })
      }
    >
      <RowContainer>
        <View style={{ flex: 1 }}>
          <ThemeTextBold numberOfLines={1} style={{ flex: 1 }}>
            {title}
          </ThemeTextBold>

          <ThemeDetail>
            <RowContainer>
              {hashtags.map((tag, index) => (
                <ChgHashTagText key={index}>{`#${tag.name} `}</ChgHashTagText>
              ))}
            </RowContainer>
          </ThemeDetail>
        </View>
        <Ionicons name="chevron-forward" size={15} color={Colors.borderDark} />
      </RowContainer>
    </ThemeContainer>
  );
}

export function TimeCapsule({
  id,
  title,
  isSent = false,
  createdAt,
  receiveDate,
  target,
}) {
  const now = new Date();
  const navigation = useNavigation();

  const [progress, setProgress] = useState(
    receiveDate <= now
      ? 100
      : parseInt(((now - createdAt) / (receiveDate - createdAt)) * 100)
  );
  const [isCompleted, setCompleted] = useState(receiveDate <= now);
  const [timer, setTimer] = useState(getTimeCapsuleTime(receiveDate));

  useEffect(() => {
    const tiks = setInterval(() => {
      // 초 countdown
      if (progress < 100) {
        setProgress(
          parseInt(((new Date() - createdAt) / (receiveDate - createdAt)) * 100)
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
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // console.log("became foreground");
        setProgress(
          parseInt(((new Date() - createdAt) / (receiveDate - createdAt)) * 100)
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
          navigation.navigate(ROUTE_NAME.LETTER_SENT, {
            letterId: id,
            isTimeCapsule: true,
            isCompleted,
            receiveDate: JSON.stringify(receiveDate),
          });
        } else if (isCompleted) {
          navigation.navigate(ROUTE_NAME.LETTER_RECEIVED, {
            letterId: id,
          });
        }
      }}
      disabled={!isSent && !isCompleted}
    >
      <RowContainer>
        <Ionicons name="alarm-outline" size={14} style={{ marginRight: 5 }} />
        <ThemeTextBold numberOfLines={1}>{title}</ThemeTextBold>
      </RowContainer>
      <ThemeDetail>
        <ThemeText>{`작성일: ${createdAt.toLocaleDateString("ko-KR", {
          ...(createdAt.getFullYear() !== now.getFullYear() && {
            year: "numeric",
          }),
          month: "long",
          day: "numeric",
        })}`}</ThemeText>

        <RowContainer>
          {isCompleted ? (
            <ThemeText style={{ fontFamily: "nanum-bold" }}>
              {`공개완료: ${receiveDate.toLocaleDateString("ko-KR", {
                ...(receiveDate.getFullYear() !== now.getFullYear() && {
                  year: "numeric",
                }),
                month: "long",
                day: "numeric",
              })}`}
            </ThemeText>
          ) : (
            <ThemeText
              style={{ fontFamily: "nanum-bold" }}
            >{`${timer} 후 공개`}</ThemeText>
          )}
        </RowContainer>

        <ProgressBar>
          <Progress
            percentage={progress}
            style={{ backgroundColor: isCompleted ? Colors.main : Colors.sub }}
          />
          <Progress percentage={100 - progress} />

          <Image
            source={{ uri: assetStore.messageEmotions["passion"] }}
            style={{
              width: 30,
              height: 30,
              position: "absolute",
              left: `${progress - 3}%`,
            }}
            resizeMode="contain"
          />
        </ProgressBar>
        {isCompleted ? (
          <RowContainer>
            <ThemeText
              style={{ flex: 1, color: "#3d6acb", fontFamily: "nanum-bold" }}
            >
              {`${
                3 - parseInt((now - receiveDate) / (1000 * 60 * 60 * 24))
              }일 뒤 ${isSent ? "보낸" : "받은"} 편지함으로 이동됩니다`}
            </ThemeText>
            <ThemeText>{`${isSent ? "to" : "from"}. ${
              target || "알 수 없음"
            }`}</ThemeText>
          </RowContainer>
        ) : (
          <ReceiverContainer>
            <ThemeText>{`${isSent ? "to" : "from"}. ${
              target || "알 수 없음"
            }`}</ThemeText>
          </ReceiverContainer>
        )}
      </ThemeDetail>
    </ThemeContainer>
  );
}

LetterTheme.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isSelect: PropTypes.bool.isRequired,
  hashtags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired, // 필요는 없음 raw 그냥 받음
    })
  ),
};

TimeCapsule.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool,
  isSent: PropTypes.bool,
  createdAt: PropTypes.object.isRequired,
  receiveDate: PropTypes.object.isRequired,
  // target: PropTypes.string.isRequired,
};
