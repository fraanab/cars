<template>
  <div v-if="car" class="car-details flex flex-col justify-center align-center">
    <div class="short-info align-self-start">
      <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
      <h3>
        {{ mileage }} Miles, {{ car.engine }} Engine,
        {{ car.transmission }} Gear
      </h3>
    </div>

    <div v-if="!mobileQuery" class="details-img-container details-img-grid">
      <!-- <img :src="getImgUrl(car.imgUrls[0])" alt="" /> -->
      <img
        v-for="(img, idx) in car.imgUrls"
        :key="idx"
        :src="getImgUrl(img)"
        alt=""
      />
    </div>

    <el-carousel
      v-else
      trigger="click"
      :autoplay="false"
      indicator-position="none"
    >
      <el-carousel-item v-for="(img, idx) in car.imgUrls" :key="idx">
        <img :src="getImgUrl(img)" alt="" />
      </el-carousel-item>
    </el-carousel>

    <div class="details-bid-info flex align-center justify-between">
      <div class="flex align-center">
        <font-awesome-icon icon="clock" class="main-info-icon" />
        <div class="flex flex-col align-center">
          <!-- <h3>Time Left</h3> -->
          <h3>{{ timeLeft }}</h3>
        </div>
      </div>

      <div class="flex flex-col align-center">
        <!-- <h3>Current Bid</h3> -->
        <h3>{{ lastBid }}</h3>
      </div>

      <!-- <div class="flex flex-col align-center"> -->
      <div class="flex flex align-center closeble">
        <h3># Bids</h3>
        <h3>{{ car.auction.bids.length }}</h3>
      </div>

      <!-- <div class="flex flex-col align-center coments-count">
        <h3>Comments</h3>
        <h3>{{ car.comments.length }}</h3>
      </div> -->

      <div class="flex flex align-center closeble">
        <!-- <div class="flex flex-col align-center"> -->
        <h3>Likes</h3>
        <h3>{{ likesCount }}</h3>
      </div>
      <div v-if="timeLeftRaw <= 60000" class="bid-info-timer" :style="cssProps">
        <!-- <div class="bid-info-timer" :style="cssProps"> -->
        <div v-if="timeLeftRaw <= 10000" class="inner-timer">
          {{ Math.floor(timeLeftRaw / 1000) }}
        </div>
      </div>
      <div class="bid-info-btn-container flex align-center">
        <button
          @click.stop="toggleLike"
          :class="isActive"
          class="round-main watch"
        >
          <font-awesome-icon icon="heart" class="main-info-icon" />
        </button>
        <button
          class="round-main bid"
          :class="blowing"
          @click="modalOpen = true"
        >
          Place Bid
        </button>
      </div>
    </div>

    <div class="flex flex-col justify-between info-container">
      <main-info :car="car"></main-info>
      <bid-list :bids="bidsToShow.slice(0, 4)"></bid-list>
    </div>

    <bid-info :car="car"></bid-info>

    <div class="flex flex-col comments-container">
      <h2>Comments</h2>

      <form @submit.prevent="addComment" class="add-comment flex">
        <textarea
          v-model="comment.txt"
          rows="3"
          placeholder="Add a Comment..."
        ></textarea>
        <button>Send</button>
      </form>

      <ul class="comments-list clean-list">
        <li
          v-for="comment in commentsToShow"
          :key="comment.id"
          @click="userProfile(comment.by._id)"
        >
          <div class="flex align-center bid-by">
            <avatar
              :size="28"
              :username="comment.by.fullname"
              :src="comment.by.imgUrl"
              class="pointer"
            >
            </avatar>
            <p>{{ comment.by.fullname }}</p>
            <span>{{ comment.createdAt | moment("calendar") }}</span>
          </div>
          <div class="comment-txt flex align-center">
            {{ comment.txt }}
          </div>
        </li>
      </ul>
    </div>
    <div v-if="modalOpen" class="screen" @click="modalOpen = false"></div>
    <div v-if="modalOpen" class="place-bid-modal flex flex-col align-center">
      <h2 class="modal-title">
        {{ car.year }} {{ car.vendor }} {{ car.model }}
      </h2>
      <form @submit="addBid" class="flex add-bid-container">
        <el-input-number
          v-model.number="bid.price"
          :min="lastBidNum + 1000"
          :max="999999"
          :controls="false"
        ></el-input-number>
        <button class="clean-btn">Place bid</button>
      </form>

      <bid-list :bids="bidsToShow"></bid-list>
      <button class="clean-btn close-btn" @click="modalOpen = false">
        <font-awesome-icon icon="times" class="main-info-icon" />
      </button>
    </div>
  </div>
  <!-- :min="lastBidNum + 100" -->
  <div
    v-else
    v-loading.fullscreen.lock="isLoading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>



<script>
import { carService } from "@/services/car.service.js";
import { socketService } from "@/services/socket.service.js";
import { showMsg } from '../services/eventBus.service.js'
import mainInfo from '../cmps/main-info'
import bidList from '../cmps/bid-list'
import bidInfo from '../cmps/bid-info'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faClock, faTimes } from '@fortawesome/free-solid-svg-icons'
library.add(faHeart, faClock, faTimes)
var moment = require("moment");

import avatar from 'vue-avatar'

export default {
  name: "car-details",
  data() {
    return {
      car: null,
      comment: { txt: '' },
      bid: { price: 0 },
      like: {},
      isLoading: false,
      now: Date.now(),
      timeLeftInterval: null,
      modalOpen: false,
      isLiked: false
    };
  },
  computed: {
    lastBid() {
      return carService.getLastBid(this.car).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    lastBidNum() {
      return carService.getLastBid(this.car)
    },
    timeLeft() {
      const diff = this.car.auction.createdAt + this.car.auction.duration - this.now
      if (diff <= 0) return 'Finished'
      return moment.duration(diff).format()
    },
    timeLeftRaw() {
      // const diff = this.now - this.car.auction.createdAt + this.car.auction.duration
      const diff = this.car.auction.createdAt + this.car.auction.duration - this.now
      if (diff <= 0) return 'Finished'
      return diff
    },
    commentsToShow() {
      const comments = this.car.comments.sort((comm1, comm2) => { return comm2.createdAt - comm1.createdAt })
      return comments
    },
    bidsToShow() {
      // return this.car.auction.bids.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })
      const bids = this.car.auction.bids.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })
      return this.modalOpen ? bids : bids.slice(0, 3)
    },
    isActive() {
      return this.isLiked ? 'active' : ''
    },
    likesCount() {
      return this.car.likes.length
    },
    mileage() {
      return this.car.mileage.toLocaleString('en-US')
    },
    cssProps() {
      return {
        '--cur-width': ((Math.floor(this.timeLeftRaw / 1000)) * 1.66) + "%",
      }
    },
    blowing() {
      return this.timeLeftRaw <= 60000 ? 'blowing' : ''
    },
    mobileQuery() {
      return this.$store.getters.windowWidth >= 600 ? false : true
    }
  },

  methods: {
    async loadCar() {
      const carId = this.$route.params.carId;
      this.isLoading = true
      try {
        this.car = await carService.getById(carId)
      } catch (err) {
        console.log(err)
        this.$message({
          showClose: true,
          message: 'Cannot load car',
          type: 'danger'
        });
      } finally {
        this.isLoading = false
      }
    },
    async placeBid() {
      // this.$store.dispatch({ type: "getLoggedinUser" });
      if (!this.$store.getters.loggedinUser) {
        this.$store.commit('toggleLogin', { isShown: true })
      }
    },
    getImgUrl(pic) {
      if (!pic.includes('images')) return pic
      return require('../assets/' + pic)
    },
    async addComment() {
      try {
        // this.$store.dispatch({ type: "getLoggedinUser" });
        if (!this.$store.getters.loggedinUser) this.$store.commit('toggleLogin', { isShown: true })
        else {
          this.comment.carId = this.car._id;
          const commentToAdd = await this.$store.dispatch({ type: 'addComment', comment: this.comment })
          commentToAdd.carId = this.car._id;
          socketService.emit('details newComment', commentToAdd)
          delete commentToAdd.carId
          this.car.comments.unshift(commentToAdd)
          this.comment.txt = ''
        }
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'Cannot save comment',
          type: 'danger'
        });
      }
    },
    async addBid() {
      try {
        // this.$store.dispatch({ type: "getLoggedinUser" });
        if (!this.$store.getters.loggedinUser) {
          this.$store.commit('toggleLogin', { isShown: true })
        }
        else {
          if (this.bid.price > this.lastBidNum) {
            this.bid.carId = this.car._id;
            const bidToAdd = await this.$store.dispatch({ type: 'addBid', bid: this.bid })
            bidToAdd.carId = this.car._id;
            socketService.emit('details newBid', bidToAdd)
            delete bidToAdd.carId
            this.car.auction.bids.unshift(bidToAdd)
            this.bid.price = 0
            this.$message({
              showClose: true,
              message: 'Bid placed!',
              type: 'success'
            });
          } else {
            // showMsg('Bid price must be over ' + this.lastBidNum, 'danger')
            this.$message({
              showClose: true,
              message: 'Bid price must be over the highest bid',
              type: 'warning'
            });
          }
        }
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'Cannot place bid',
          type: 'warning'
        });
      } finally {
        this.modalOpen = false
      }
    },
    async toggleLike() {
      // this.$store.dispatch({ type: "getLoggedinUser" });
      if (!this.$store.getters.loggedinUser) {
        this.$store.commit('toggleLogin', { isShown: true })
      }
      else {
        this.isLiked = !this.isLiked
        if (this.isLiked) {
          this.like.carId = this.car._id;
          var likeToAdd = await this.$store.dispatch({ type: 'addLike', like: this.like })
          this.car.likes.push(likeToAdd)
          likeToAdd.carId = this.car._id
          likeToAdd.isAdd = true
          socketService.emit('details newLike', likeToAdd)
        } else {
          var idx = this.car.likes.findIndex(like => {
            return like.by._id === this.$store.getters.loggedinUser._id
          })
          this.like.carId = this.car._id;
          likeToAdd = await this.$store.dispatch({ type: 'removeLike', like: this.like })
          likeToAdd.carId = this.car._id
          likeToAdd.isAdd = false
          likeToAdd.userId = this.$store.getters.loggedinUser._id
          socketService.emit('details newLike', likeToAdd)
          this.car.likes.splice(idx, 1)
        }
      }
    },
    findLike() {
      //      this.$store.dispatch({ type: "getLoggedinUser" });
      if (this.$store.getters.loggedinUser && this.likesCount) {
        const idx = this.car.likes.findIndex(like => {
          return like.by._id === this.$store.getters.loggedinUser._id
        })
        if (idx >= 0) this.isLiked = true
      }
    },
    userProfile(userId) {
      this.$router.push(`/activity/${userId}`)
    },
    someOneAddBid(bid) {
      if (bid.carId === this.car._id) this.car.auction.bids.unshift(bid)
    },
    someOneAddComment(comment) {
      if (comment.carId === this.car._id) this.car.comments.unshift(comment)
    },
    someOneChangeLike(like) {
      if (like.carId === this.car._id) {
        if (like.isAdd) this.car.likes.unshift(like)
        else {
          var idx = this.car.likes.findIndex(currLike => {
            return like.userId === currLike.by._id
          })
          this.car.likes.splice(idx, 1)
        }
      }
    },
  },
  async created() {
    socketService.on('details addComment', this.someOneAddComment)
    socketService.on('details addBid', this.someOneAddBid)
    socketService.on('details changeLike', this.someOneChangeLike)
    await this.loadCar()
    this.findLike()
    this.timeLeftInterval = setInterval(() => {
      this.now = Date.now()
    }, 1000);

  },
  watch: {
    "$route.params.carId"(id) {
      this.loadCar();
    },
  },
  destroyed() {
    clearInterval(this.timeLeftInterval);
    socketService.off('details addBid', this.someOneAddBid)
    socketService.off('details addComment', this.someOneAddComment)
    socketService.off('details changeLike', this.someOneChangeLike)
  },
  components: {
    avatar,
    mainInfo,
    bidList,
    bidInfo
  }
}
</script>


<style scoped>
.bid-info-timer {
  width: var(--cur-width);
}
</style>