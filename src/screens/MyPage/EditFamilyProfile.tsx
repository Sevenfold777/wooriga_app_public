import {observer} from 'mobx-react-lite';
import React from 'react';
import Menu from '../../components/myPage/Menu';
import ScreenLayout from '../../components/common/ScreenLayout';
import useFamily from '../../hooks/useFamily';
import familyStore from '../../stores/FamilyStore';
import {MenuContainer} from './MyPage';
import NoContent from '../../components/NoContent';
import {SignedInScreenProps} from '../../navigators/types';

function EditFamilyProfile({
  navigation,
}: SignedInScreenProps<'EditFamilyProfile'>) {
  const family = useFamily(true); // exceptMe

  return (
    <ScreenLayout>
      {family?.users.length === 0 ? (
        <NoContent
          payload={'우리가에 초대된 가족이 없습니다\n우리가족을 초대해보세요'}
        />
      ) : (
        <MenuContainer>
          {family?.users.map((user: {id: number; userName: string}) => (
            <Menu
              key={user.id}
              payload={familyStore.members[user.id]}
              action={() =>
                navigation.navigate('ChangeNickname', {
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
