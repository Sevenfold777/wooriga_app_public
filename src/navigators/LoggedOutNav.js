import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Auth/Login";
import SignUp from "../screens/Auth/SignUp";
import OperationPolicy from "../screens/Policy/OperationPolicy";
import PrivacyPolicy from "../screens/Policy/PrivacyPolicy";
import TermsOfUse from "../screens/Policy/TermsOfUse";
import { ROUTE_NAME } from "../Strings";

/* create Stack Navigator */
const Stack = createStackNavigator();

export default function LoggedOutNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "default",
        headerTitleStyle: { fontFamily: "nanum-bold" },
        headerTintColor: "#23222b",
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: "left",
        ...(Platform.OS === "ios" && {
          // animationEnabled: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 400,
        }),
      }}
    >
      <Stack.Screen
        name={ROUTE_NAME.LOGIN}
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ROUTE_NAME.SIGN_UP}
        component={SignUp}
        options={{
          headerTitle: "회원가입",
        }}
      />

      <Stack.Screen
        name={ROUTE_NAME.TERMS_OF_USE}
        component={TermsOfUse}
        options={{ headerTitle: "이용약관" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.OPERATION_POLICY}
        component={OperationPolicy}
        options={{ headerTitle: "운영정책" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.PRIVACY_POLICY}
        component={PrivacyPolicy}
        options={{ headerTitle: "개인정보처리방침" }}
      />
    </Stack.Navigator>
  );
}
