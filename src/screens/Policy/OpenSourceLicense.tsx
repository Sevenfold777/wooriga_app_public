import React from "react";
import { ScrollView } from "react-native";
import Menu from "../../components/myPage/Menu";
import ScreenLayout from "../../components/ScreenLayout";
import { OPEN_SOURCE_LICENSE, ROUTE_NAME } from "../../Strings";
import { MenuContainer } from "../MyPage/MyPage";

export default function OpenSourceLicense({ navigation }) {
  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <MenuContainer>
          {OPEN_SOURCE_LICENSE.map((license, index) => (
            <Menu
              key={index}
              payload={license.libraryName}
              action={() =>
                navigation.navigate(ROUTE_NAME.OPEN_SOURCE_LICENSE_PAYLOAD, {
                  license,
                })
              }
            />
          ))}
        </MenuContainer>
      </ScrollView>
    </ScreenLayout>
  );
}
