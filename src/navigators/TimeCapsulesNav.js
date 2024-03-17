import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ROUTE_NAME } from "../Strings";
import { TabBar } from "./MyPageNav";
import TimeCapsulesReceived from "../screens/Letter/TimeCapsulesReceived";
import TimeCapsulesSent from "../screens/Letter/TimeCapsulesSent";

const Tab = createMaterialTopTabNavigator();

export default function TimeCapsulesNav() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        headerTitleStyle: { fontFamily: "nanum-bold" },
      }}
    >
      <Tab.Screen
        name={ROUTE_NAME.TIME_CAPSULES_RECEIVED}
        component={TimeCapsulesReceived}
      />
      <Tab.Screen
        name={ROUTE_NAME.TIME_CAPSULES_SENT}
        component={TimeCapsulesSent}
      />
    </Tab.Navigator>
  );
}
