import React, { useState } from "react";
import { ScrollView, StatusBar, useWindowDimensions, View } from "react-native";
import Modal from "react-native-modal";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { Colors } from "../Config";

/** detail modal */
export const DetailModalContainer = styled.View`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: white;
  padding: 0px 10px 15px 10px;
`;

export const DetailModalAction = styled.TouchableOpacity``;
export const DetailModalText = styled.Text`
  font-size: 16px;
  padding: 15px 10px;
  font-family: "nanum-regular";
`;

/** confirm modal */
export const ConfirmModalContainer = styled.View`
  background-color: white;
  width: 300px;
  border-radius: 7px;
`;

export const ConfirmModalText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-family: "nanum-regular";
`;

export const ConfirmModalBtn = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
`;

export default function DetailModal({
  isDetailModal,
  isConfirmModal,
  setDetailModal,
  setConfirmModal,
  actions,
}) {
  /**  actions: {name: string, func: () =>{}, confirmNeeded: boolean, confirmMessage?: string}[]  */
  const [actionPressed, setActionPressed] = useState();
  const { height: pageHeight } = useWindowDimensions();

  return (
    <View>
      <Modal
        isVisible={isDetailModal}
        onBackdropPress={() => {
          setDetailModal(false);
          setActionPressed();
        }}
        onSwipeComplete={() => {
          setDetailModal(false);
          setActionPressed();
        }}
        onBackButtonPress={() => {
          setDetailModal(false);
          setActionPressed();
        }}
        swipeDirection="down"
        onModalHide={() =>
          actions[actionPressed]?.confirmNeeded
            ? setConfirmModal(true)
            : setConfirmModal(false)
        }
        style={{
          margin: 0,
          justifyContent: "flex-end",
        }}
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <DetailModalContainer>
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <View style={{ position: "absolute" }}>
              <Ionicons name="remove" size={30} />
            </View>
          </View>
          <ScrollView>
            {actions.map((action, index) => (
              <DetailModalAction
                key={index}
                onPress={async () => {
                  action.confirmNeeded
                    ? setActionPressed(index)
                    : await action.func();

                  setDetailModal(false);
                }}
              >
                <DetailModalText>{action.name}</DetailModalText>
              </DetailModalAction>
            ))}
          </ScrollView>
        </DetailModalContainer>
      </Modal>

      <Modal
        isVisible={isConfirmModal && actions[actionPressed]?.confirmNeeded}
        onBackdropPress={() => {
          setConfirmModal(false);
          setActionPressed();
        }}
        onSwipeComplete={() => {
          setConfirmModal(false);
          setActionPressed();
        }}
        onBackButtonPress={() => {
          setConfirmModal(false);
          setActionPressed();
        }}
        swipeDirection="down"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight + 10}
      >
        <ConfirmModalContainer>
          <View style={{ padding: 30 }}>
            <ConfirmModalText>
              {actions[actionPressed]?.confirmMessage}
            </ConfirmModalText>
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
                setConfirmModal(false);
                setActionPressed();
              }}
            >
              <ConfirmModalText>취소</ConfirmModalText>
            </ConfirmModalBtn>
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              onPress={async () => {
                await actions[actionPressed].func();

                setActionPressed();
                setConfirmModal(false);
              }}
            >
              <ConfirmModalText>확인</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ConfirmModalContainer>
      </Modal>
    </View>
  );
}

DetailModal.propTypes = {
  isDetailModal: PropTypes.bool.isRequired,
  isConfirmModal: PropTypes.bool.isRequired,
  setDetailModal: PropTypes.func.isRequired,
  setConfirmModal: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      func: PropTypes.func.isRequired,
      confirmNeeded: PropTypes.bool.isRequired,
      confirmMessage: PropTypes.string,
    })
  ),
};
