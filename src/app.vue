<template>
  <div id="app" class="main-layout" :class="isLoginShown">
    <user-msg />
    <div v-if="loginShown" class="screen" @click="closeLogin"></div>
    <app-header />
    <login v-if="loginShown"></login>
    <router-view />
  </div>
</template>

<script>
import appHeader from './cmps/app-header'
import userMsg from './cmps/user-msg'
import login from './cmps/login'

import { userService } from './services/user.service.js'

export default {
  name: "app-vue",
  data() {
    return {
    }
  },
  computed: {
    isLoginShown() {
      return this.loginShown ? 'login-shown' : ''
    },
    loginShown() {
      return this.$store.getters.loginShown
    }
  },
  methods: {
    closeLogin() {
      this.$store.commit('toggleLogin', { isShown: false })
    },
  },
  created() {
    this.$store.dispatch({ type: "loadCars" });
    socketService.setup();
    window.addEventListener('resize', () => {
      this.$store.commit('setWindowWidth')
    })
    // window.addEventListener('resize', this.onResize())
  },
  destroyed() {
    socketService.terminate();
    userService.logout();
  },
  components: {
    appHeader,
    userMsg,
    login
  }
};
</script>
