import React from 'react';
import Menu from '../../components/myPage/Menu';
import ScreenLayout from '../../components/common/ScreenLayout';
import {ROUTE_NAME} from '../../Strings';
import {MenuContainer} from './MyPage';
import {SignedInScreenProps} from '../../navigators/types';

export default function Infos({navigation}: SignedInScreenProps<'Infos'>) {
  return (
    <ScreenLayout>
      <MenuContainer>
        <Menu
          payload="이용약관"
          action={() => navigation.navigate('TermsOfUse')}
        />
        <Menu
          payload="운영정책"
          action={() => navigation.navigate('OperationPolicy')}
        />
        <Menu
          payload="개인정보처리방침"
          action={() => navigation.navigate('PrivacyPolicy')}
        />
        <Menu
          payload="오픈소스라이센스"
          action={() => navigation.navigate('OpenSourceLicense')}
        />
      </MenuContainer>
    </ScreenLayout>
  );
}
