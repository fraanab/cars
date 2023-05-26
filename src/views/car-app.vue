<template>
  <section class="car-app flex flex-col">
    <car-filter></car-filter>
    <car-list
      :cars="carsToShow"
    ></car-list>
  </section>
</template>

<script>
import carList from "@/cmps/car-list.vue";
import carFilter from "@/cmps/car-filter.vue";

export default {
  name: "car-app",
  computed: {
    carsToShow() {
      return this.$store.getters.carsToShow;
    },
  },
  components: {
    carList,
    carFilter,
  },
  created(){
    this.$store.dispatch({ type: 'loadCars' })
  }
};
</script>