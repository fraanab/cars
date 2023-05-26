<template>
  <div class="bid-container flex flex-col">
    <h2>Last bids</h2>
    <ul v-if="bids.length" class="bid-list clean-list">
      <li v-for="bid in bids" :key="bid.id" @click="userProfile(bid.by._id)">
        <div class="flex align-center bid-by">
          <avatar
            :size="28"
            :username="bid.by.fullname"
            :src="bid.by.imgUrl"
            class="pointer"
          >
          </avatar>
          <p>{{ bid.by.fullname }}</p>
          <span>{{ bid.createdAt | moment("calendar") }}</span>
        </div>
        <div class="bid-price flex justify-center align-center">
          {{ priceToShow(bid.price) }}
        </div>
      </li>
    </ul>
    <h3 v-else>No bids on this car yet</h3>
  </div>
</template>



<script>
var moment = require("moment");

import avatar from 'vue-avatar'

export default {
  props: {
    bids: {
      type: Array,
    },
  },
  name: "bid-list",
  data() {
    return {
    };
  },
  computed: {
  },

  methods: {
    getImgUrl(pic) {
      if (!pic.includes('images')) {
        return pic
      }
      return require('../assets/' + pic)
    },
    priceToShow(price) {
      return price.toLocaleString('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 0
      })
    },
    userProfile(userId){
      this.$router.push(`/activity/${userId}`)
    }
  },
  components: {
    avatar,
  }
}
</script>