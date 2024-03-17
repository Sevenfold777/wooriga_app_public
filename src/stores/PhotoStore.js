import { observable } from "mobx";

const photoStore = observable({
  // mutation status
  theme: "",
  payload: "",

  // set Upload Photo
  setUploadPhotoTheme(theme) {
    this.theme = theme;
  },

  setUploadPhotoPayload(payload) {
    this.payload = payload;
  },

  // reset
  resetUploadPhoto() {
    this.theme = "";
    this.payload = "";
  },
});

export default photoStore;
