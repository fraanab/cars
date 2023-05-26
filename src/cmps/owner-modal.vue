<template>
  <section class="owner-modal flex flex-col align-center">
    <h1>Congratulations!</h1>
    <h2>
      You've got <span>{{ lastBid }}</span> for your
    </h2>
    <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}!</h2>
    <h3 class="flex align-center">
      With highest bid by 
      <avatar
        :size="40"
        :username="car.auction.bids[0].by.fullname"
        :src="car.auction.bids[0].by.imgUrl"
      ></avatar
      ><span>{{ car.auction.bids[0].by.fullname }}</span>
    </h3>

    <div class="winner-galery">
      <div class="stage">
        <div class="cubespinner">
          <!-- <div
            v-for="(img, idx) in imgsForCube"
            :key="idx"
            :class="`face${idx + 1}`"
          >
            <img :src="getImgUrl(car.imgUrls[idx])" />
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { carService } from "@/services/car.service.js";
import avatar from 'vue-avatar'


export default {
  props: {
    car: {
      type: Object,
    },
  },
  name: "owner-modal",
  data() {
    return {

    };
  },
  computed: {
    lastBid() {
      return carService.getLastBid(this.car).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    imgsForCube() {
      let imgs = this.car.imgUrls
      if (imgs.length >= 6) imgs = imgs.slice(0, 6)
      else {
        let diff = 6 - imgs.length
        for (let i = 0; i < diff; i++) {
          imgs.push(imgs[i])
        }
      }
      return imgs
    }
  },

  methods: {
    getImgUrl(pic) {
      if (!pic.includes('images')) return pic
      return require('../assets/' + pic)
    },

  },
  async created() {

  },
  components: {
    avatar
  },
}
</script>


<style scoped>
.bid-info-timer {
  width: var(--cur-width);
}
</style>