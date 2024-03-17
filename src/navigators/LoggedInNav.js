import MainTabNav from "./MainTabNav";
import BannersPayload from "../screens/BannersPayload";
import ChangeNickname from "../screens/ChangeNickname";
import FamilyPediaMember from "../screens/Activity/FamilyPedia/FamilyPediaMember";
import { createStackNavigator } from "@react-navigation/stack";
import FamilyJoin from "../screens/FamilyJoin";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import SelectProfilePhoto from "../screens/Activity/FamilyPedia/SelectProfilePhoto";
import Report from "../screens/Report";
import TermsOfUse from "../screens/Policy/TermsOfUse";
import OperationPolicy from "../screens/Policy/OperationPolicy";
import PrivacyPolicy from "../screens/Policy/PrivacyPolicy";
import { Ionicons } from "@expo/vector-icons";
import MessageFamily from "../screens/Message/Family/MessageFamily";
import MessageSend from "../screens/Message/Family/MessageSend";
import PhotoSelect from "../screens/Photo/PhotoSelect";
import PhotoUpload from "../screens/Photo/PhotoUpload";
import Notifications from "../screens/Home/Notifications";
import { Photo } from "../screens/Photo/Photo";
import PhotoComments from "../screens/Photo/PhotoComments";
import MessageTodays from "../screens/Message/Family/MessageTodays";
import MessageSent from "../screens/Message/Family/MessageSent";
import MessagesPast from "../screens/Message/Family/MessagesPast";
import { ROUTE_NAME } from "../Strings";
import { Colors } from "../Config";
import UserInquirySend from "../screens/UserInquiry/UserInquirySend";
import UserInquiryList from "../screens/UserInquiry/UserInquiryList";
import UserInquiry from "../screens/UserInquiry/UserInquiry";
import LetterSend from "../screens/Letter/LetterSend";
import LetterCompleted from "../screens/Letter/LetterCompleted";
import LetterSent from "../screens/Letter/LetterSent";
import LetterReceived from "../screens/Letter/LetterReceived";
import LetterBoxNav from "./LetterBoxNav";
import LetterThemeList from "../screens/Letter/LetterThemeList";
import LetterThemeDetail from "../screens/Letter/LetterThemeDetail";
import TimeCapsulesNav from "./TimeCapsulesNav";

const Stack = createStackNavigator();

export default function LoggedInNav({}) {
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
          gestureVelocityImpact: 1,
        }),
      }}
      // initialRouteName={initialRoute}
    >
      <Stack.Screen
        name={ROUTE_NAME.MAIN_TAB_NAV}
        component={MainTabNav}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_FAMILY}
        component={MessageFamily}
        options={({ navigation }) => ({
          //headerTitle: "오늘의 이야기",
          headerTitle: "오늘의 이야기",
          // presentation: "transparentModal",
          animation: "fade_from_bottom",
        })}
      />
      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_SEND}
        component={MessageSend}
        options={{
          headerTitle: "이야기 보내기",
          animation: "slide_from_right",
          ...(Platform.OS === "ios" && { gestureResponseDistance: 200 }),
        }}
      />
      <Stack.Screen
        name={ROUTE_NAME.PHOTO_SELECT}
        component={PhotoSelect}
        options={({ navigation }) => ({
          headerTitle: "사진 선택",
          animation: "slide_from_right",
          ...(Platform.OS === "ios" && { gestureResponseDistance: 150 }),
          // headerRight은 Screen에서
        })}
      />

      <Stack.Screen
        name={ROUTE_NAME.PHOTO_UPLOAD}
        component={PhotoUpload}
        options={{
          headerTitle: "사진 업로드",
          animation: "slide_from_right",
          // headerRight은 Screen에서
        }}
      />

      <Stack.Screen
        name={ROUTE_NAME.BANNERS_PAYLOAD}
        component={BannersPayload}
      />

      <Stack.Screen
        name={ROUTE_NAME.PHOTO}
        component={Photo}
        options={{ headerTitle: "가족앨범" }}
      />
      <Stack.Screen
        name={ROUTE_NAME.PHOTO_COMMENTS}
        component={PhotoComments}
        options={{ headerTitle: "가족앨범" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_TODAYS}
        component={MessageTodays}
        options={{ headerTitle: "오늘의 이야기" }}
      />
      <Stack.Screen
        name={ROUTE_NAME.MESSAGE_SENT}
        component={MessageSent}
        options={{ headerTitle: "보낸 이야기" }}
      />
      <Stack.Screen
        name={ROUTE_NAME.MESSAGES_PAST}
        component={MessagesPast}
        options={{ headerTitle: "지난 이야기" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.CHANGE_NICKNAME}
        component={ChangeNickname}
        options={{ headerTitle: "가족 이름 변경" }}
      />
      <Stack.Screen
        name={ROUTE_NAME.NOTIFICATIONS}
        component={Notifications}
        options={{ headerTitle: "알림" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.FAMILY_JOIN}
        component={FamilyJoin}
        options={{ headerTitle: "가족가입" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.FAMILYPEDIA_MEMBER}
        component={FamilyPediaMember}
        options={{
          headerTitle: "인물사전",
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name={ROUTE_NAME.FAMILYPEDIA_SELECTPHOTO}
        component={SelectProfilePhoto}
        options={{
          headerTitle: "사진 선택",
          animation: "slide_from_right",
          ...(Platform.OS === "ios" && { gestureResponseDistance: 150 }),
        }}
      />

      <Stack.Screen
        name={ROUTE_NAME.REPORT}
        component={Report}
        options={{ headerTitle: "신고하기" }}
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

      <Stack.Screen
        name={ROUTE_NAME.USER_INQUIRY_SEND}
        component={UserInquirySend}
        options={{ headerTitle: "1 : 1 문의 작성" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.USER_INQUIRY_LIST}
        component={UserInquiryList}
        options={{ headerTitle: "1 : 1 문의 사항" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.USER_INQUIRY}
        component={UserInquiry}
        options={{ headerTitle: "1 : 1 문의 사항" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_SEND}
        component={LetterSend}
        options={{
          headerTitle: "편지 보내기",
          ...(Platform.OS === "ios" && { gestureResponseDistance: 150 }),
        }}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_COMPLETED}
        component={LetterCompleted}
        options={{ headerTitle: "편지 보내기" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_RECEIVED}
        component={LetterReceived}
        options={{ headerTitle: "받은 편지" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_SENT}
        component={LetterSent}
        options={{ headerTitle: "보낸 편지" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_BOX_NAV}
        component={LetterBoxNav}
        options={({ navigation }) => ({
          headerTitle: "편지",

          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.main,
                padding: 8,
                borderRadius: 5,
                marginHorizontal: 15,
              }}
              onPress={() => navigation.navigate(ROUTE_NAME.LETTER_SEND)}
            >
              <Text style={{ color: "white", fontFamily: "nanum-regular" }}>
                보내기
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name={ROUTE_NAME.TIME_CAPSULES_NAV}
        component={TimeCapsulesNav}
        options={({ navigation }) => ({
          headerTitle: "타임캡슐",

          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.main,
                padding: 8,
                borderRadius: 5,
                marginHorizontal: 15,
              }}
              onPress={() => navigation.navigate(ROUTE_NAME.LETTER_SEND)}
            >
              <Text style={{ color: "white", fontFamily: "nanum-regular" }}>
                보내기
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_THEME_LIST}
        component={LetterThemeList}
        options={{ headerTitle: "편지 주제" }}
      />

      <Stack.Screen
        name={ROUTE_NAME.LETTER_THEME_DETAIL}
        component={LetterThemeDetail}
        options={{ headerTitle: "편지 주제" }}
      />
    </Stack.Navigator>
  );
}
