import { observable } from "mobx";

const mutationStore = observable({
  // mutation status
  isMutated: false,

  // set Mutation status
  setStatus(isMutated) {
    this.isMutated = isMutated;
  },
});

export default mutationStore;
