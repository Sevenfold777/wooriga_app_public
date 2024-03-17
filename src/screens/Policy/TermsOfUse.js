import React from "react";
import { ScrollView } from "react-native";
import WebView from "react-native-webview";
import TermsOfUsePayload from "../../components/policy/TermsOfUse";
import ScreenLayout from "../../components/ScreenLayout";

export default function TermsOfUse({ navigation, route }) {
  return (
    <ScreenLayout>
      <WebView
        source={{ uri: "https://wool2ga.com/policy/terms_of_use/" }}
        bounces={false}
      />
    </ScreenLayout>
  );
}
