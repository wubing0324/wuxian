import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stepIndex: 1,
    checkList: [],
    formInfo: {},
    types: [],
  },
  getters: {},
  mutations: {
    setStepIndex(state, index) {
      state.stepIndex = index;
    },
    setCheckList(state, checkList) {
      state.checkList = checkList;
    },
    setFormInfo(state, form) {
      state.formInfo = form;
    },
    setAssetTypes(state, types) {
      state.types = types;
    },
  },
  actions: {},
  modules: {},
});
