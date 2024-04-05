import {observer} from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import Menu from '../../components/myPage/Menu';
import ScreenLayout from '../../components/common/ScreenLayout';
import useFamily from '../../hooks/useFamily';
import familyStore from '../../stores/FamilyStore';
import {ROUTE_NAME} from '../../Strings';
import {MenuContainer} from './MyPage';
import NoContent from '../../components/NoContent';

const Container = styled.View``;

function EditFamilyProfile({navigation, route: {params}}) {
  const family = useFamily(true); // exceptMe

  return (
    <ScreenLayout>
      {family?.users.length === 0 ? (
        <NoContent
          payload={'우리가에 초대된 가족이 없습니다\n우리가족을 초대해보세요'}
        />
      ) : (
        <MenuContainer>
          {family?.users.map(user => (
            <Menu
              key={user.id}
              payload={familyStore.members[user.id]}
              action={() =>
                navigation.navigate(ROUTE_NAME.CHANGE_NICKNAME, {
                  id: user.id,
                  name: user.userName,
                  nickname: familyStore.members[user.id],
                })
              }
            />
          ))}
        </MenuContainer>
      )}
    </ScreenLayout>
  );
}

export default observer(EditFamilyProfile);
