import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Colors } from "../Config";
import LetterReceivedKept from "../screens/Letter/LetterReceivedKept";
import DailyEmotionsPast from "../screens/MyPage/DailyEmotionsPast";
import EditFamilyProfile from "../screens/MyPage/EditFamilyProfile";
import EditMyProfile from "../screens/MyPage/EditMyProfile";
import FamilyPage from "../screens/MyPage/FamilyPage";
import Infos from "../screens/MyPage/Infos";
import MyPage from "../screens/MyPage/MyPage";
import PushNofitSettings from "../screens/MyPage/PushNotifSettings";
import Quit from "../screens/MyPage/Quit";
import Settings from "../screens/MyPage/Settings";
import PhotosMy from "../screens/Photo/PhotosMy";
import OpenSourceLicense from "../screens/Policy/OpenSourceLicense";
import OpenSourceLicensePayload from "../screens/Policy/OpenSourceLicensePayload";
import { ROUTE_NAME } from "../Strings";
import MessageKeep from "../screens/Message/Family/MessageKeep";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function MyPageNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: "#23222b",
        animation: "none",
        headerTitleStyle: { fontFamily: "nanum-bold" },
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
        name={ROUTE_NAME.MYPAGE_MAIN}
        options={{ headerShown: false }}
      >
        {() => (
          <SafeAreaProvider>
            <SafeAreaView style={{ backgroundColor: "white" }} />
            <Tab.Navigator
              tabBar={(props) => <TabBar {...props} />}
              screenOptions={{
                swipeEnabled: true,
                headerTitleStyle: { fontFamily: "nanum-bold" },
              }}
            >
              <Tab.Screen
                name={ROUTE_NAME.MYPAGE_FAMILY}
                component={FamilyPage}
              />
              <Tab.Screen name={ROUTE_NAME.MYPAGE_MY} component={MyPage} />
            </Tab.Navigator>
          </SafeAreaProvider>
        )}
      </Stack.Screen>

      <Stack.Screen
        name={ROUTE_NAME.EDIT_MY_PROFILE}
        component={EditMyProfile}
        options={{ headerTitle: "내 정보 보기" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.EDIT_FAMILY_PROFILE}
        component={EditFamilyProfile}
        options={{ headerTitle: "가족 이름 변경" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.DAILY_EMOTIONS_PAST}
        component={DailyEmotionsPast}
        options={{
          headerTitle: "그날의 우리가",
          ...(Platform.OS === "ios" && {
            gestureResponseDistance: 200,
          }),
        }}
      />

      <Stack.Screen
        name={ROUTE_NAME.PHOTOS_MY}
        component={PhotosMy}
        options={{ headerTitle: "업로드한 사진" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_KEEP}
        component={MessageKeep}
        options={{ headerTitle: "이야기 보관함" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_RECEIVEVD_KEPT}
        component={LetterReceivedKept}
        options={{ headerTitle: "편지 보관함" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.SETTINGS}
        component={Settings}
        options={{ headerTitle: "설정" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.INFOS}
        component={Infos}
        options={{ headerTitle: "정보" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.OPEN_SOURCE_LICENSE}
        component={OpenSourceLicense}
        options={{ headerTitle: "오픈소스라이센스" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.OPEN_SOURCE_LICENSE_PAYLOAD}
        component={OpenSourceLicensePayload}
        options={{ headerTitle: "오픈소스라이센스" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.PUSH_NOTIF_SETTINGS}
        component={PushNofitSettings}
        options={{ headerTitle: "알림 설정" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.QUIT}
        component={Quit}
        options={{ headerTitle: "회원탈퇴" }}
      />
    </Stack.Navigator>
  );
}

/** Toggle Tabbar Config */

const Container = styled.View`
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 10px 0px;
`;

const TabWrapper = styled.View`
  flex-direction: row;
  display: flex;
  align-items: center;
  border-radius: 30px;
  background-color: ${Colors.borderLight};
`;

const TabButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0px 16px;
  border-radius: 30px;
  background-color: ${(props) =>
    props.isFocused ? Colors.main : "transparent"};
`;

const TabText = styled.Text`
  font-family: "nanum-bold";
  color: ${(props) => (props.isFocused ? Colors.white : Colors.black)};
`;

export function TabBar({ state, descriptors, navigation }) {
  return (
    <Container>
      <TabWrapper>
        {state.routes.map((route, index) => {
          const label = route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TabButton
              isFocused={isFocused}
              onPress={onPress}
              key={`tab_${index}`}
            >
              <TabText isFocused={isFocused}>{label}</TabText>
            </TabButton>
          );
        })}
      </TabWrapper>
    </Container>
  );
}
