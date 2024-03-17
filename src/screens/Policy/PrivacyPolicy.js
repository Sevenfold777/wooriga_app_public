import React from "react";
import { ScrollView } from "react-native";
import WebView from "react-native-webview";
import PrivacyPolicyPayload from "../../components/policy/PrivacyPolicy";
import ScreenLayout from "../../components/ScreenLayout";

export default function PrivacyPolicy({ navigation, route }) {
  return (
    <ScreenLayout>
      <WebView
        source={{ uri: "https://wool2ga.com/policy/privacy_policy/" }}
        bounces={false}
      />
    </ScreenLayout>
  );
}
