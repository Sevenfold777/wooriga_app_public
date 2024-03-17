import { Platform, StatusBar, View, useWindowDimensions } from "react-native";
import { ModalContainer } from "../DailyEmotion";
import Modal from "react-native-modal";
import { ConfirmModalBtn, ConfirmModalText } from "../DetailModal";
import { Colors } from "../../Config";
import styled from "styled-components/native";
import { openURL } from "../../helper";

const TitleContainer = styled.View`
  padding: 5px 7px;
  margin: 15px 10px 0px 10px;
`;

const TitleText = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
`;

const SubTextContainer = styled.View`
  padding: 5px 25px;
`;

const SubText = styled.Text`
  font-family: "nanum-regular";
  line-height: 18px;
`;

export default function UpdateModal({ isVisible, setVisible }) {
  const { height: pageHeight } = useWindowDimensions();

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={pageHeight + StatusBar.currentHeight + 10}
    >
      <ModalContainer>
        <View
          style={{
            paddingTop: 5,
            paddingBottom: 10,
            paddingHorizontal: 10,
          }}
        >
          <TitleContainer>
            <TitleText>업데이트 알림</TitleText>
          </TitleContainer>

          <SubTextContainer>
            <SubText>
              사용 가능한 새로운 업데이트가 있습니다. 스토어로 이동하시겠습니까?
            </SubText>
          </SubTextContainer>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            borderTopWidth: 0.3,
            borderTopColor: Colors.borderDark,
          }}
        >
          <ConfirmModalBtn
            onPress={() => {
              setVisible(false);
            }}
          >
            <ConfirmModalText>닫기</ConfirmModalText>
          </ConfirmModalBtn>
          <ConfirmModalBtn
            style={{ borderLeftWidth: 0.3, borderLeftColor: Colors.borderDark }}
            onPress={() => {
              openURL(
                Platform.OS === "android"
                  ? "https://play.google.com/store/apps/details?id=com.wooriga.appservice"
                  : "https://apps.apple.com/us/app/%EC%9A%B0%EB%A6%AC%EA%B0%80/id1665530266"
              );
              setVisible(false);
            }}
          >
            <ConfirmModalText>확인</ConfirmModalText>
          </ConfirmModalBtn>
        </View>
      </ModalContainer>
    </Modal>
  );
}
