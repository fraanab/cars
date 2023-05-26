<template>
  <div class="home-page-container main-layout full">
    <div class="flex justify-center align-center main-hero full">
      <!-- <img src="../assets/images/hero.png" alt="" /> -->
        <home-nav :class="isShown"></home-nav>
      <!-- <transition name="slide-fade">
        <home-nav v-if="isShown"></home-nav>
      </transition> -->
      <div class="hero-slogan-container flex flex-col">
        <h1>Find your dream car</h1>
        <h2>the modern enthusiast cars auctions all around the world</h2>
      </div>
    </div>

    <h2>Most popular cars</h2>
    <car-row :cars="carsToShow"></car-row>
    <h2>Explore cars by body styles</h2>
    <section class="group-container flex justify-between card-type-grid">
      <div
        v-for="style in bodyStyles"
        :key="style.imgUrl"
        class="img-container"
      >
        <img @click="findCars(style.name)" :src="getImgUrl(style.imgUrl)" />
        <h3>{{ style.name }}</h3>
      </div>
      <!-- <div
        v-for="style in bodyStyles"
        :key="style.imgUrl"
        @click="findCars(style.name)"
      >
        <div class="img-container">
          <img :src="getImgUrl(style.imgUrl)" />
        </div>
        <h3>{{ style.name }}</h3>
      </div> -->
    </section>

    <div class="sell-img-container">
      <img src="../assets/images/sell-car.jpg" alt="" />
      <div>
        <h1>Bids & Cars</h1>
        <h2>Is the best place</h2>
        <h2>to sell your modern</h2>
        <h2>enthusiast car</h2>
        <button @click="sellCar" class="sell-btn">Sell your Car</button>
      </div>
    </div>

    <h2>Hotest auctions everyday</h2>
    <section class="sort-group-container flex justify-between card-sort-grid">
      <div v-for="type in sortTypes" :key="type.imgUrl" class="img-container">
        <img
          @click="findSortedCars(type.sortName)"
          :src="getImgUrl(type.imgUrl)"
        />
        <h3>{{ type.name }}</h3>
      </div>
    </section>
  </div>
</template>

<script>
import homeNav from "../cmps/home-nav";
import carRow from "@/cmps/car-row.vue";

export default {
  name: "Home",
  components: {
    homeNav,
    carRow,
  },
  data() {
    return {
      windowTop: true,
      bodyStyles: [
        {
          imgUrl: "images/sedan.jpg",
          name: "Sedan",
        },
        {
          imgUrl: "images/coupe.jpg",
          name: "Coupe",
        },
        {
          imgUrl: "images/cabrio.jpg",
          name: "Cabriolet",
        },
        {
          imgUrl: "images/suv.jpg",
          name: "SUV/Crossover",
        },
      ],
      sortTypes: [
        {
          imgUrl: "images/ending-soon.jpg",
          name: "Ending Soon",
          sortName: "ending-soon",
        },
        {
          imgUrl: "images/newly-listed.jpg",
          name: "Newely listed",
          sortName: "newly-listed",
        },
        {
          imgUrl: "images/lowest-mileage.jpg",
          name: "Lowest Mileage",
          sortName: "lowest-mileage",
        },
      ],
    };
  },
  computed: {
    carsToShow() {
      return this.$store.getters.carsToShowHome
    },
    isShown() {
      return this.windowTop ? '' : 'hide';
    },
    // isShown() {
    //   return this.windowTop ? true : false;
    // },
  },
  methods: {
    onScroll() {
      this.windowTop = window.top.scrollY < 10 ? true : false;
    },
    getImgUrl(pic) {
      return require("../assets/" + pic);
    },
    findCars(name) {
      const filterBy = {
        bodyStyles: name,
      };
      this.$store.commit({ type: "setFilter", filterBy: filterBy });
      this.$router.push("/car");
      this.$store.dispatch({ type: "loadCars" });
    },
    findSortedCars(name) {
      this.$store.commit({ type: "setSort", sortBy: name });
      this.$router.push("/car");
      this.$store.dispatch({ type: "loadCars" });
    },
    sellCar() {
      this.$router.push("/car/edit");
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>
