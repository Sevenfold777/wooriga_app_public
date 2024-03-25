import React from "react";
import Menu from "../../components/myPage/Menu";
import ScreenLayout from "../../components/ScreenLayout";
import { ROUTE_NAME } from "../../Strings";
import { MenuContainer } from "./MyPage";

export default function Infos({ navigation, route }) {
  return (
    <ScreenLayout>
      <MenuContainer>
        <Menu
          payload="이용약관"
          action={() => navigation.navigate(ROUTE_NAME.TERMS_OF_USE)}
        />
        <Menu
          payload="운영정책"
          action={() => navigation.navigate(ROUTE_NAME.OPERATION_POLICY)}
        />
        <Menu
          payload="개인정보처리방침"
          action={() => navigation.navigate(ROUTE_NAME.PRIVACY_POLICY)}
        />
        <Menu
          payload="오픈소스라이센스"
          action={() => navigation.navigate(ROUTE_NAME.OPEN_SOURCE_LICENSE)}
        />
      </MenuContainer>
    </ScreenLayout>
  );
}
