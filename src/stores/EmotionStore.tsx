import {observable} from 'mobx';

const emotionStore = observable({
  emotionChosen: true,

  setEmotionChosen(bool: boolean) {
    this.emotionChosen = bool;
  },
});

export default emotionStore;
