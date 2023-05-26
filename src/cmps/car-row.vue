<template>
  <section class="row-container main-container">
    <button
      @click.stop="nextCar(1)"
      class="clean-btn arrow-btn flex align-center justify-center right"
    >
      <font-awesome-icon icon="angle-right" class="main-info-icon" />
    </button>
    <ul
      v-loading.fullscreen.lock="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="car-list card-grid flex clean-list"
    >
      <car-preview
        v-for="car in carsToShow"
        :car="car"
        :key="car._id"
        class="car-item-container flex flex-col justify-between align-center"
      ></car-preview>
    </ul>
    <button
      @click.stop="nextCar(-1)"
      class="clean-btn arrow-btn flex align-center justify-center left"
    >
      <font-awesome-icon icon="angle-left" class="main-info-icon" />
    </button>

    <!-- <div v-else class="car-loading flex justify-center align-center">
      LOADING...
    </div> -->
  </section>
</template>

<script>
import carPreview from "@/cmps/car-preview.vue";
import { Loading } from 'element-ui';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
library.add(faAngleRight, faAngleLeft)


export default {
  props: {
    cars: {
      type: Array,
    },
  },
  name: "car-list",
  data() {
    return {
      pageIdx: 0,
    }
  },
  methods: {
    nextCar(diff) {
      this.pageIdx += diff
      if (this.pageIdx > this.cars.length - 3) this.pageIdx = 0
      else if (this.pageIdx < 0) this.pageIdx = this.cars.length - 3

    }
  },
  computed: {
    loading() {
      return false
      // return this.$store.getters.loading
    },
    carsCount() {
      return this.$store.getters.carsCount
    },
    carsToShow() {

      return this.cars.slice(this.pageIdx, this.pageIdx + this.rowSize)
    },
    rowSize() {
      const width = this.$store.getters.windowWidth
      if (width >= 908) return 3
      else if (width >= 627) return 2
      else return 1

    }

  },
  components: {
    carPreview,
  },
};
</script>