import styled from "styled-components/native";
import { Colors } from "../Config";
import Modal from "react-native-modal";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import KakaoShareLink from "@utae/react-native-kakao-share-link";
import propTypes from "prop-types";

const InviteModalContainer = styled.View`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: white;
  flex-direction: row;
  padding: 10px;
  justify-content: center;
  padding-bottom: 15px;
`;

const InviteModalAction = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  padding: 15px;
  border-radius: 30px;
  flex: 1;
`;
const InviteModalText = styled.Text`
  padding: 5px 10px;
  font-family: "nanum-regular";
`;

const InviteIconWrapper = styled.View`
  justify-content: center;
  align-items: center;
  border: 1px solid ${Colors.borderDark};
  padding: 10px;
  border-radius: 30px;
  width: 60px;
  height: 60px;
`;

export default function InviteModal({
  inviteModal,
  setInviteModal,
  inviteLink,
}) {
  const { width: pageWidth, height: pageHeight } = useWindowDimensions();

  const sendKakaoMessage = async () => {
    try {
      const response = await KakaoShareLink.sendFeed({
        content: {
          title: "우리가",
          imageUrl:
            "https://wooriga-dev.s3.ap-northeast-2.amazonaws.com/emotions/invitation.jpeg",
          link: { webUrl: inviteLink, mobileWebUrl: inviteLink },
          description: "우리가족에 초대되었습니다.",
        },
        buttons: [
          {
            title: "초대 확인하기",
            link: { webUrl: inviteLink, mobileWebUrl: inviteLink },
          },
        ],
      });
    } catch (e) {
      console.error(e);
      console.error(e.message);
    }
  };

  return (
    <Modal
      isVisible={inviteModal}
      onBackButtonPress={() => setInviteModal(!inviteModal)}
      onBackdropPress={() => setInviteModal(!inviteModal)}
      onSwipeComplete={() => setInviteModal(!inviteModal)}
      style={{ margin: 0, justifyContent: "flex-end" }}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionOutTiming={0}
      statusBarTranslucent
      deviceHeight={pageHeight + StatusBar.currentHeight}
    >
      <InviteModalContainer>
        <InviteModalAction
          onPress={() => {
            setInviteModal(!inviteModal);
            Clipboard.setString(inviteLink);
          }}
        >
          <InviteIconWrapper>
            <Ionicons name="copy-outline" size={25} style={{ margin: 5 }} />
          </InviteIconWrapper>

          <InviteModalText>초대 링크 복사</InviteModalText>
        </InviteModalAction>
        <InviteModalAction
          onPress={() => {
            setInviteModal(!inviteModal);
            sendKakaoMessage();
          }}
        >
          <InviteIconWrapper>
            <Image
              source={require("../../assets/images/kakao.png")}
              //   style={{ width: 22, height: 26 }}
              style={{ width: 26, height: 22 }}
              resizeMode="contain"
            />
          </InviteIconWrapper>
          <InviteModalText>카카오톡 공유</InviteModalText>
        </InviteModalAction>
      </InviteModalContainer>
    </Modal>
  );
}

InviteModal.propTypes = {
  inviteModal: propTypes.bool.isRequired,
  setInviteModal: propTypes.func.isRequired,
  inviteLink: propTypes.string.isRequired,
};
