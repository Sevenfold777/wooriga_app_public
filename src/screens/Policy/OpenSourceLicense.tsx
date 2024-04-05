import React from 'react';
import {ScrollView} from 'react-native';
import Menu from '../../components/myPage/Menu';
import ScreenLayout from '../../components/common/ScreenLayout';
import {OPEN_SOURCE_LICENSE} from '../../Strings';
import {MenuContainer} from '../MyPage/MyPage';
import {SignedInScreenProps} from '../../navigators/types';

export default function OpenSourceLicense({
  navigation,
}: SignedInScreenProps<'OpenSourceLicense'>) {
  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <MenuContainer>
          {OPEN_SOURCE_LICENSE.map((license: any, index) => (
            <Menu
              key={index}
              payload={license.libraryName}
              action={() =>
                navigation.navigate('OpenSourceLicensePayload', {
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
