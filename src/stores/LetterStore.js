import { observable } from "mobx";

const letterStore = observable({
  // mutation status
  letterTitle: "",
  targetsList: [], // {id: number, name: string}[] // 전체선택: -1
  sendTargets: [],
  letterEmotion: "happy",
  letterPayload: "",
  timeCapsuleTime: undefined,
  isTimeCapsule: false,
  theme: undefined, // {id: number, title: string, examples: LetterExample[]}

  // set letterTitle
  setLetterTitle(title) {
    this.letterTitle = title;
  },

  setLetterEmotion(emotion) {
    this.letterEmotion = emotion;
  },

  setLetterPayload(payload) {
    this.letterPayload = payload;
  },

  setTimeCapsule(bool) {
    this.isTimeCapsule = bool;
  },

  setTimeCapsuleTime(date) {
    this.timeCapsuleTime = date;
  },

  // reset
  resetLetter() {
    this.letterTitle = "";
    this.letterEmotion = "happy";
    this.letterPayload = "";
    this.sendTargets = [];
    this.targetsList = [];
    this.timeCapsuleTime = undefined;
    this.isTimeCapsule = false;
    this.theme = undefined;
  },

  setTargetsList(list) {
    this.targetsList = list;
  },

  setSendTargets(targets) {
    this.sendTargets = targets;
  },

  setTheme({ id, title, examples }) {
    this.theme = { id, title, examples };
  },

  resetTheme() {
    this.theme = undefined;
  },
});

export default letterStore;
