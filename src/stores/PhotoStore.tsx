import {observable} from 'mobx';

const photoStore = observable({
  // mutation status
  theme: '',
  payload: '',

  // set Upload Photo
  setUploadPhotoTheme(theme: string) {
    this.theme = theme;
  },

  setUploadPhotoPayload(payload: string) {
    this.payload = payload;
  },

  // reset
  resetUploadPhoto() {
    this.theme = '';
    this.payload = '';
  },
});

export default photoStore;
