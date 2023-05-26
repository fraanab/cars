<template>
  <section class="winner-modal flex flex-col align-center">
    <div class="inner">
      <div class="pyro">
        <div class="before"></div>
        <div class="after"></div>
      </div>
    </div>
    <h1>Congratulations!</h1>
    <h2>You are the winner of this amazing</h2>
    <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
    <h3>
      with your <span>{{ lastBid }}</span> Bid
    </h3>

    <div class="winner-galery">
      <div class="stage">
        <div class="cubespinner">
          <div
            v-for="(img, idx) in imgsForCube"
            :key="idx"
            :class="`face${idx + 1}`"
          >
            <img :src="getImgUrl(car.imgUrls[idx])" />
          </div>
          <!-- <div class="face1">1</div>
            <div class="face2">2</div>
            <div class="face3">3</div>
            <div class="face4">4</div> -->
          <!-- <div class="face5">5</div>
            <div class="face6">6</div> -->
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { carService } from "@/services/car.service.js";


export default {
  props: {
    car: {
      type: Object,
    },
  },
  name: "winner-modal",
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
}
</script>


<style scoped>
.bid-info-timer {
  width: var(--cur-width);
}
</style>