import AsyncStorage from '@react-native-async-storage/async-storage';
import {observable, runInAction} from 'mobx';
import authStore from './AuthStore';

const familyStore = observable({
  // family members' nickname
  members: {}, // 형식: { id: "nickname" }
  inviteNeeded: false,

  async preloadFamilyMembers() {
    // local storage에 저장된 가족 불러오기
    const savedMembers = await AsyncStorage.getItem('familyMembers');

    runInAction(() => {
      if (savedMembers) {
        this.members = JSON.parse(savedMembers);
      }
    });
  },

  /** init nicknames as userName */
  async setNewfamilyMembers(users) {
    // 기존 id 없으면 기본 닉네임으로 가족 저장
    const prevUsersIds = Object.keys(this.members);
    const currentUserIds = users.map(user => user.id);

    users.forEach(user => {
      if (
        !prevUsersIds.includes(String(user.id)) &&
        user.id !== authStore.userId
      ) {
        this.members[user.id] = user.userName;
      }
    });

    prevUsersIds.forEach(id => {
      if (id === authStore.userId.toString()) {
        delete this.members[id];
      } else if (!currentUserIds.includes(+id)) {
        delete this.members[id];
      }
    });

    // localstorage에 저장
    await AsyncStorage.setItem('familyMembers', JSON.stringify(this.members));
  },

  /** change nickname */
  async changeNickname({id, newNickname}) {
    // change membes var
    this.members[id] = newNickname;

    // localstorage에 저장
    await AsyncStorage.setItem('familyMembers', JSON.stringify(this.members));
  },

  setInviteNeeded(bool) {
    this.inviteNeeded = bool;
  },
});

export default familyStore;
