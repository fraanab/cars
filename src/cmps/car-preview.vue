<template>
  <li class="car-preview flex flex-col justify-start">
    <!-- <img :src="getImgUrl(car.imgUrls[0])" alt=""> -->
    <!-- <div class="block"> -->
    <el-carousel
      trigger="click"
      :autoplay="false"
      height="200px"
      indicator-position="none"
    >
      <el-carousel-item
        v-for="(img, idx) in car.imgUrls.slice(0, 4)"
        :key="idx"
      >
        <!-- height="150px" -->
        <router-link class="img-container" :to="'/car/details/' + car._id">
          <img :src="getImgUrl(img)" alt="" />
        </router-link>
      </el-carousel-item>
    </el-carousel>
    <!-- </div> -->
    <!-- <div @click.stop="toggleLike" class="like-btn pointer" :class="isActive">
      <font-awesome-icon icon="heart" class="main-info-icon" />
    </div> -->
    <!-- <button class="like-btn">🤍</button> -->
    <div class="bid-info flex justify-between align-center">
      <div class="flex flex-col justify-center align-center">
        <p>
          <font-awesome-icon icon="clock" class="main-info-icon" />
          {{ timeLeft }}
        </p>
        <p class="description">Before ends</p>
      </div>
      <div class="flex flex-col justify-center align-center last-bid">
        <p :class="onTimer">{{ lastBid }}</p>
        <p class="description">Current Bid</p>
      </div>
      <div class="flex flex-col justify-center align-center">
        <p>{{ car.auction.bids.length }}</p>
        <p class="description">Bids</p>
      </div>
      <!-- <div class="bid-info-timer"></div> -->
      <div
        v-if="timeLeftRaw <= 60000"
        class="bid-info-timer"
        :style="cssProps"
      ></div>
      <div v-if="timeLeftRaw <= 10000" class="inner-timer">
        {{ Math.floor(timeLeftRaw / 1000) }}
      </div>
    </div>

    <div class="flex justify-between align-center preview-title-conteiner">
      <h3>{{ car.year }} {{ car.vendor }} {{ car.model }}</h3>
      <p>Mileage: {{ mileage }}</p>
    </div>
    <p>{{ car.engine }} Engine</p>
    <p>{{ car.transmission }} Gear</p>
    <!-- <p>Mileage: {{ car.mileage }}</p> -->
    <div class="flex justify-between align-center">
      <p class="preview-address">{{ car.location.address }}</p>
      <div class="flex align-center">
        <!-- <font-awesome-icon icon="heart" class="main-info-icon" /><span
          >(8)</span
        > -->
        <!-- <font-awesome-icon icon="heart" class="main-info-icon" /> -->
        <div
          @click.stop="toggleLike"
          class="like-btn pointer"
          :class="isActive"
        >
          <font-awesome-icon icon="heart" class="main-info-icon" />
        </div>
        <span>({{ likesCount }})</span>
      </div>
    </div>
  </li>
</template>

<script>
//import carPreview from "@/cmps/car-preview.vue";
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");
import { carService } from "@/services/car.service.js";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons'
library.add(faHeart, faClock)


export default {
  name: "car-preview",
  props: {
    car: {
      type: Object,
    },
  },
  data() {
    return {
      now: Date.now(),
      timeLeftInterval: null,
      isLiked: false,
      like: {},
    }
  },
  computed: {
    lastBid() {
      return carService.getLastBid(this.car).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    timeLeft() {
      // const diff = this.now - this.car.auction.createdAt + this.car.auction.duration
      const diff = this.car.auction.createdAt + this.car.auction.duration - this.now
      if (diff <= 0) return 'Finished'
      return moment.duration(diff).format()
    },
    timeLeftRaw() {
      const diff = this.car.auction.createdAt + this.car.auction.duration - this.now
      if (diff <= 0) return 'Finished'
      return diff
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
    onTimer() {
      return this.timeLeftRaw <= 60000 ? 'on-timer' : ''
    },
    cssProps() {
      return {
        '--cur-width': ((Math.floor(this.timeLeftRaw / 1000)) * 1.66) + "%",
      }
    },
  },
  methods: {
    removeCar(car) {
      this.$emit("remove", car);
    },
    getImgUrl(pic) {
      if (!pic.includes('images')) {
        return pic
      }
      return require('../assets/' + pic)
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
          var carToEdit = JSON.parse(JSON.stringify(this.car))
          carToEdit.likes.push(likeToAdd)
          this.$store.commit({ type: 'setCar', car: carToEdit })
          likeToAdd.carId = this.car._id
          likeToAdd.isAdd = true
          socketService.emit('details newLike', likeToAdd)

        } else {
          var idx = this.car.likes.findIndex(like => {
            return like.by._id === this.$store.getters.loggedinUser._id
          })
          this.like.carId = this.car._id;
          await this.$store.dispatch({ type: 'removeLike', like: this.like })
          carToEdit = JSON.parse(JSON.stringify(this.car))
          carToEdit.likes.splice(idx, 1)
          this.$store.commit({ type: 'setCar', car: carToEdit })
          likeToAdd = {}
          likeToAdd.carId = this.car._id
          likeToAdd.isAdd = false
          likeToAdd.userId = this.$store.getters.loggedinUser._id
          socketService.emit('details newLike', likeToAdd)

        }
        carToEdit = null;
      }
    },
    findLike() {
      //this.$store.dispatch({ type: "getLoggedinUser" });
      if (this.$store.getters.loggedinUser && this.car.likes.length) {
        const idx = this.car.likes.findIndex(like => {
          return like.by._id === this.$store.getters.loggedinUser._id
        })

        if (idx >= 0) {
          this.isLiked = true
        }
      }
    },
    someOneAddBid(bid) {
      if (bid.carId === this.car._id) this.car.auction.bids.unshift(bid)
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
  created() {
    this.findLike()
    socketService.on('details addBid', this.someOneAddBid)
    socketService.on('details changeLike', this.someOneChangeLike)
    this.timeLeftInterval = setInterval(() => {
      this.now = Date.now()
    }, 1000);
  },
  destroyed() {
    socketService.off('details addBid', this.someOneAddBid)
    socketService.off('details changeLike', this.someOneChangeLike)
    clearInterval(this.timeLeftInterval);
  }
}
</script>


<style scoped>
.bid-info-timer {
  width: var(--cur-width);
}
</style>