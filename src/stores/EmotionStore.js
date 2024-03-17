import { observable } from "mobx";

const emotionStore = observable({
  emotionChosen: true,

  setEmotionChosen(bool) {
    this.emotionChosen = bool;
  },
});

export default emotionStore;
