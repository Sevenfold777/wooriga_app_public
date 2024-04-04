import {observable} from 'mobx';

const mutationStore = observable({
  // mutation status
  isMutated: false,

  // set Mutation status
  setStatus(isMutated: boolean) {
    this.isMutated = isMutated;
  },
});

export default mutationStore;
