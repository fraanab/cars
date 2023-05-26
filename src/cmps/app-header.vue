<template>
  <div class="header full main-layout" :class="isDark">
    <div class="header-container flex align-center justify-between">
      <!-- <router-link to="/" class="logo">Cars<span>&</span>Bids</router-link> -->
      <router-link to="/"
        ><div class="logo">
          <img src="../assets/logo.png" alt="" /></div
      ></router-link>

      <div
        v-if="openCollapsingBtns"
        class="screen"
        @click="openCollapsingBtns = false"
      ></div>
      <div class="btn-container flex align-center">
        <div
          v-if="openCollapsingBtns || !hamburgerOpen"
          class="collapsing-btn-container flex align-center"
          :class="collapsing"
        >
          <transition name="fade">
            <el-input
              v-if="!isDark"
              @focus="setFilterFocus"
              @input="setFilterName"
              placeholder="Search for car"
              v-model="filterName"
              clearable
            >
            </el-input>
          </transition>
          <div @click.stop="openCollapsingBtns = false">
            <router-link to="/car" class="btn">Explore</router-link>
          </div>
          <div @click.stop="openCollapsingBtns = false">
            <router-link to="/car/edit" class="btn">Sell your Car</router-link>
          </div>
        </div>
        <button
          @click="
            openNotifications = !openNotifications;
            openOptions = false;
            newMsgCount = 0;
          "
          class="clean-btn msgs-open-btn"
        >
          <el-badge
            :value="newMsgCount"
            class="item"
            :hidden="newMsgCount === 0"
          >
            <font-awesome-icon icon="bell" class="main-info-icon" />
          </el-badge>
          <ul v-if="openNotifications" class="clean-list user-msg-container">
            <div v-if="userMsgs && userMsgs.length" class="">
              <li
                v-for="(msg, idx) in userMsgs"
                @click="msgClicked(msg)"
                :key="idx"
                class="user-msg flex align-center"
              >
                <avatar
                  :size="28"
                  :username="msg.by.fullname"
                  :src="msg.by.imgUrl"
                ></avatar>
                <div>
                  <h6>
                    <span>New</span> {{ msg.type }} <span>added on</span>
                    {{ msg.vendor }} {{ msg.model }}
                    {{ msg.year }}
                    <div>
                      {{ msg.by.fullname }},
                      <span>{{ msg.createdAt | moment("calendar") }}</span>
                    </div>
                  </h6>
                  <p>{{ getMsgData(msg) }}</p>
                </div>
              </li>
            </div>
            <h3 v-else>No new messeges</h3>
          </ul>
        </button>

        <div
          class="account-options-btn flex justify-between align-center pointer"
          @click="
            openOptions = !openOptions;
            openNotifications = false;
          "
        >
          <font-awesome-icon
            v-if="!openOptions"
            icon="caret-down"
            class="main-info-icon"
          />
          <font-awesome-icon v-else icon="caret-up" class="main-info-icon" />
          <font-awesome-icon
            v-if="!loggedInUser"
            icon="user-circle"
            class="main-info-icon user-img"
          />
          <avatar
            v-else
            :size="28"
            :username="loggedInUser.fullname"
            :src="loggedInUser.imgUrl"
          ></avatar>
          <div
            v-if="openOptions"
            tabindex="0"
            class="account-options flex flex-col"
          >
            <button v-if="!loggedInUser" class="clean-btn" @click="openLogin">
              Sign up
            </button>
            <button v-else class="clean-btn" @click="logout">Logout</button>
            <button
              class="clean-btn"
              :class="isBlocked"
              @click="openActivities"
            >
              Activites
            </button>
          </div>
        </div>
        <button
          v-if="hamburgerOpen"
          class="clean-btn open-collapsing-btn"
          @click="openCollapsingBtns = !openCollapsingBtns"
        >
          <font-awesome-icon icon="bars" class="main-info-icon" />
        </button>
      </div>
    </div>

    <transition name="fade">
      <winner-modal v-if="winnerCar" :car="winnerCar"></winner-modal>
    </transition>
    <transition name="fade">
      <owner-modal v-if="ownerCar" :car="ownerCar"></owner-modal>
    </transition>
  </div>
</template>

<script>

import avatar from 'vue-avatar'
import winnerModal from './winner-modal.vue'
import ownerModal from './owner-modal.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faUserCircle, faBell, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faUserCircle, faBell, faCaretDown, faCaretUp)
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

export default {
  name: "app-header",
  data() {
    return {
      filterName: '',
      windowTop: true,
      isHomeRout: false,
      openOptions: false,
      openNotifications: false,
      openCollapsingBtns: false,
      newMsgCount: 0,
      // msgCount: 0,
      winnerCar: null,
      ownerCar: null
    }
  },
  computed: {
    isDark() {
      return this.windowTop && this.isHomeRout ? 'dark' : ''
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser ? this.$store.getters.loggedinUser : false
    },
    collapsing() {
      return this.$store.getters.windowWidth >= 785 ? '' : 'collapsing';
    },
    hamburgerOpen() {
      return this.$store.getters.windowWidth >= 785 ? false : true
    },
    userMsgs() {
      var sortMsg = JSON.parse(JSON.stringify(this.$store.getters.userMsgs))
      sortMsg.sort((msg1, msg2) => { return msg2.createdAt - msg1.createdAt })
      return sortMsg
    },
    isBlocked() {
      return this.$store.getters.loggedinUser ? '' : 'blocked'
    },
  },
  methods: {
    setFilterName() {
      this.$store.commit({ type: 'setFilterName', name: this.filterName })
      this.$store.dispatch({ type: 'loadCars' })
    },
    setFilterFocus() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onScroll() {
      this.windowTop = window.top.scrollY < 10 ? true : false
      this.openCollapsingBtns = false
    },
    openLogin() {
      this.$store.commit('toggleLogin', { isShown: true })
    },
    async logout() {
      try {
        await this.$store.dispatch({ type: 'logout' })
        this.$message({
          showClose: true,
          message: 'Logged out successfuly',
          type: 'success'
        });

      } catch (err) {
        this.$message({
          showClose: true,
          message: 'Cannot logout',
          type: 'error'
        });
      }
    },
    async newMsg(msg) {
      const isNewMsg = await this.$store.dispatch({ type: 'addUserMsg', msg })
      if (isNewMsg) this.newMsgCount++
    },
    getMsgData(msg) {
      if (msg.type === 'bid') {
        msg.data = +msg.data
        return msg.data.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
      } else if (msg.type === 'comment') {
        return msg.data.slice(0, 30) + '...'
      }
    },
    msgClicked(msg) {
      this.$router.push('/car/details/' + msg.carId)
      this.openNotifications = false
    },
    timesUp(car) {
      car.auction.bids.sort((bid1, bid2) => { return bid2.price - bid1.price })
      if (car.auction.bids[0]?.by._id === this.loggedInUser._id) {
        this.winnerCar = car
        setTimeout(() => {
          this.winnerCar = null
        }, 7000);
      } else if (car.owner._id === this.loggedInUser._id) {
        this.ownerCar = car
        setTimeout(() => {
          this.ownerCar = null
        }, 7000);
      }
    },
    openActivities() {
      if (!this.loggedInUser) {
        this.$message({
          showClose: true,
          message: 'Please login first',
          type: 'warning'
        });
      } else if (this.$route.path !== `/activity/${this.loggedInUser._id}`) {
        this.$router.push(`/activity/${this.loggedInUser._id}`)
      }
    }
  },
  watch: {
    $route(route) {
      this.isHomeRout = (route.path === '/') ? true : false
      this.filterName = this.$store.getters.filterBy.name
    },
  },
  async created() {
    this.isHomeRout = (this.$route.path === '/') ? true : false
    window.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.openOptions = false
        this.openNotifications = false
      }
    })
    socketService.on('cars newMsg', this.newMsg)
    socketService.on('cars time', this.timesUp)
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },
  destroyed() {
    this.$store.commit({ type: 'setFilterName', name: '' })
    socketService.off('cars newMsg', this.newMsg)
  },
  components: {
    avatar,
    winnerModal,
    ownerModal,
  },

};
</script>
