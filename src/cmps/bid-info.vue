<template>
  <div class="bid-info-container">
    <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
    <div class="bid-info flex flex-col justify-between">
      <div v-if="bidToShow" class="flex flex-col justify-between">
        <div @click="userProfile(bidToShow.by._id)" class="flex align-center">
          <h3>Current bid</h3>
          <avatar
            :size="18"
            :username="bidToShow.by.fullname"
            :src="bidToShow.by.imgUrl"
            class="pointer"
          >
          </avatar>
          <p>{{ bidToShow.by.fullname }}</p>
        </div>
        <h1 :class="isLastBid">{{ lastBid }}</h1>
      </div>
      <div v-else class="flex flex-col">
        <h3>No bids for this car yet, start price is</h3>
        <h1>{{ startPrice }}</h1>
      </div>
      <div class="flex flex-col justify-between">
        <div @click="userProfile(car.owner._id)" class="flex align-center">
          <h4>Seller</h4>
          <avatar
            :size="18"
            :username="car.owner.fullname"
            :src="car.owner.imgUrl"
            class="pointer"
          >
          </avatar>
          <p>{{ car.owner.fullname }}</p>
        </div>
        <div class="flex align-center">
          <h4 @click="refreshTime()">Ending</h4>
          <p>
            {{
              (car.auction.createdAt + car.auction.duration)
                | moment("MMMM Do, HH:mm")
            }}
          </p>
        </div>
        <div class="flex align-center">
          <h4>Bids</h4>
          <p># {{ car.auction.bids.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { carService } from "@/services/car.service.js";
import avatar from 'vue-avatar'
var moment = require("moment");

export default {
  name: "bid-info",
  props: {
    car: {
      type: Object,
    },
  },
  computed: {
    bidToShow() {
      const bids = JSON.parse(JSON.stringify(this.car.auction.bids))
      return bids.sort((bid1, bid2) => { return bid2.price - bid1.price })[0]
    },
    lastBid() {
      return this.bidToShow?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    startPrice() {
      return this.car.auction.startPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    isLastBid() {
      const userId = this.$store.getters.loggedinUser._id
      
      return this.car.auction.bids[0].by._id === userId ? 'success' : 'danger'
    },
  },
  methods: {
    userProfile(userId) {
      this.$router.push(`/activity/${userId}`)
    },
    async refreshTime() {
      try {
        const refreshed = await carService.changeTime(this.car._id)
      } catch (err) {
        console.log('Can`t refresh time:', err);
      }
    }
  },
  components: {
    avatar
  }
}
</script>