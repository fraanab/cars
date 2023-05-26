<template>
  <section class="list-container">
    <div class="block">
    </div>
    <ul
      v-loading.fullscreen.lock="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="car-list card-grid flex clean-list"
    >
      <car-preview
        v-for="car in cars"
        :car="car"
        :key="car._id"
        class="car-item-container flex flex-col justify-between align-center"
      ></car-preview>
    </ul>
  </section>
</template>

<script>
import carPreview from "@/cmps/car-preview.vue";
import { Loading } from 'element-ui';

export default {
  props: {
    cars: {
      type: Array,
    },
  },
  name: "car-list",
  computed: {
    loading() {
      return false
    },
    carsCount() {
      return this.$store.getters.carsCount
    }
  },
  components: {
    carPreview,
  },
};
</script>