import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import styled from "styled-components/native";
import LetterBoxReceived from "../screens/Letter/LetterBoxReceived";
import LetterBoxSent from "../screens/Letter/LetterBoxSent";
import { ROUTE_NAME } from "../Strings";
import { TabBar } from "./MyPageNav";

const Tab = createMaterialTopTabNavigator();

export default function LetterBoxNav() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        headerTitleStyle: { fontFamily: "nanum-bold" },
      }}
    >
      <Tab.Screen
        name={ROUTE_NAME.LETTER_BOX_RECEIVED}
        component={LetterBoxReceived}
      />
      <Tab.Screen name={ROUTE_NAME.LETTER_BOX_SENT} component={LetterBoxSent} />
    </Tab.Navigator>
  );
}
