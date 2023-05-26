import Vue from 'vue'
import Vuex from 'vuex'
import { carStore } from "./car.store";
import { userStore } from "./user.store";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    windowWidth: window.innerWidth,
  },
  getters: {
    windowWidth(state) {
      return state.windowWidth
    }
  },
  mutations: {
    setWindowWidth(state) {
      state.windowWidth = window.innerWidth;
    }
  },
  actions: {
  },
  modules: {
    carStore,
    userStore
  }
})
