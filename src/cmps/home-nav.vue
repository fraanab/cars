<template>
  <section class="home-nav flex justify-between align-center">
    <div v-if="filterBtnsOpen" class="flex justify-between align-center">
      <button
        @click="yearsRangeIsOpen = !yearsRangeIsOpen"
        class="filter-btn years-range-open"
      >
        Years
      </button>
      <div v-if="yearsRangeIsOpen" class="block years-range">
        <el-slider
          v-model="filterBy.byYears"
          range
          :min="1970"
          :max="2021"
          :marks="marks"
        >
          >
        </el-slider>
      </div>

      <el-select
        v-model="filterBy.bodyStyles"
        placeholder="Body styles"
        class="body-style"
      >
        <el-option
          v-for="item in bodyStyles"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="filterBy.vendors"
        placeholder="Vendors"
        multiple
        collapse-tags
        class="vendor"
      >
        <el-option
          v-for="item in vendors"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <el-input
      @change="findCars"
      placeholder='Try "Audi S6"'
      v-model="filterName"
      ref="search"
      class="search"
      clearable
    >
    </el-input>
    <button @click="findCars" class="round-main go">
      <font-awesome-icon icon="search" class="main-info-icon" /> Search
    </button>
  </section>
</template>

<script>
// function debounce(callback, wait) {
//   let timeout;
//   return (...args) => {
//     const context = this;
//     clearTimeout(timeout);
//     timeout = setTimeout(() => callback.apply(context, args), wait);
//   };
// }
import { carService } from "@/services/car.service.js";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
library.add(faSearch)

export default {
  name: 'home-nav',
  data() {
    return {
      filterBy: {
        byYears: [1970, 2021],
      },
      filterName: '',
      bodyStyles: carService.getBodyStyleList(),
      vendors: carService.getVendorList(),
      yearsRangeIsOpen: false,
    }
  },
  computed: {
    marks() {
      return {
        [this.filterBy.byYears[0]]: '' + this.filterBy.byYears[0],
        [this.filterBy.byYears[1]]: '' + this.filterBy.byYears[1],
      }
    },
    filterBtnsOpen() {
      return this.$store.getters.windowWidth >= 460 ? true : false
    },
  },
  methods: {
    setFilter() {
      this.$store.commit({ type: 'setFilter', filterBy: this.filterBy })
    },
    setFilterName() {
      this.$store.commit({ type: 'setFilterName', name: this.filterName })
    },
    findCars() {
      this.$store.commit({ type: 'setFilterName', name: this.filterName })
      this.$store.commit({ type: 'setFilter', filterBy: this.filterBy })
      this.$router.push('/car')
      this.$store.dispatch({ type: 'loadCars' })
    }
  },
  created() {
    //this.filterDebounce = debounce(this.setFilter, 1000);
    this.$store.commit({ type: 'setFilterName', name: '' })
    // this.$store.commit({ type: 'setSort', sortBy: 'ending-soon' })
    window.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.yearsRangeIsOpen = false
      }
    })
  },
  mounted() {
    this.$refs.search.focus();
  }
}
</script>

