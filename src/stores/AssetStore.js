import { observable } from "mobx";

const assetStore = observable({
  emotionsRound: {},
  messageEmotions: {}, // no backgrounds
  messagePublicEmos: {}, // public Emotions with no Bakcs
  activityThumbnails: {},

  // set banners home with payload images
  setActivityThumbanails(uris) {
    this.activityThumbnails = uris;
  },

  // for daily Emotions
  setEmotionsRound(uris) {
    this.emotionsRound = uris;
  },

  // 메세지 위의 감정들
  setMessageEmotions(uris) {
    this.messageEmotions = uris;
  },

  // set public Message Emos uri
  setMessagePublicUri(uris) {
    this.messagePublicEmos = uris;
  },
});

export default assetStore;
