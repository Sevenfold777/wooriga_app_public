import React from "react";
import { requireNativeComponent, View } from "react-native";

//module.exports = requireNativeComponent("RNKakaoAdfit");

const RNKakaoAdfit = requireNativeComponent("RNKakaoAdfit");
export default RNKakaoAdfit;

export function KakaoAdfit() {
  return (
    <View style={{ flex: 1 }}>
      <RNKakaoAdfit
        unitId={
          Platform.OS === "ios"
            ? "DAN-RuySRiFhQijfdhce"
            : "DAN-Kv9CPLgLH5QfKObB"
        }
        style={{
          flex: 1,
        }}
      />
      <View style={{ flex: 1 }}></View>
    </View>
  );
}
