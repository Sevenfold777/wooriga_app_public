import React from "react";
import { ScrollView } from "react-native";
import WebView from "react-native-webview";
import OperationPolicyPayload from "../../components/policy/OperationPolicy";
import ScreenLayout from "../../components/ScreenLayout";

export default function OperationPolicy({ navigation, route }) {
  return (
    <ScreenLayout>
      <WebView
        source={{ uri: "https://wool2ga.com/policy/op_policy/" }}
        bounces={false}
      />
    </ScreenLayout>
  );
}
