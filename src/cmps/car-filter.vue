<template>
  <section class="car-filter flex flex-col justify-between">
    <!-- <div class="flex flex-col justify-center align-center"> -->

    <div class="flex btn-container">
      <button @click="yearsRangeIsOpen = !yearsRangeIsOpen" class="filter-btn">
        Years
      </button>
      <div v-if="yearsRangeIsOpen" class="block years-range">
        <el-slider
          @change="setFilter"
          v-model="filterBy.byYears"
          range
          :min="1970"
          :max="2021"
          :marks="marks"
        >
          >
        </el-slider>
      </div>

      <div class="flex flex-col justify-center align-center">
        <el-select
          v-model="filterBy.bodyStyles"
          @change="setFilter"
          placeholder="Body style"
        >
          <el-option
            v-for="item in bodyStyles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="flex flex-col justify-center align-center">
        <!-- <label for="sort">Sort:</label> -->
        <el-select
          v-model="filterBy.vendors"
          @change="setFilter"
          placeholder="Vendors"
          multiple
          collapse-tags
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
    </div>
    <div class="flex align-center sort-btn-container">
      <button
        @click="setSort('ending-soon')"
        class="sort-btn"
        :class="endingSoonActive"
      >
        Ending soon
      </button>
      <button
        @click="setSort('newly-listed')"
        class="sort-btn"
        :class="newlyListedActive"
      >
        Newly listed
      </button>
      <button
        @click="setSort('lowest-mileage')"
        class="sort-btn"
        :class="lowestMileageActive"
      >
        Lowest mileage
      </button>
    </div>
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

export default {
  data() {
    return {
      filterBy: {
        byYears: [1970, 2021],
        sortBy: 'ending-soon'
      },
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
    endingSoonActive() {
      return this.filterBy.sortBy === 'ending-soon' ? 'active' : ''
    },
    newlyListedActive() {
      return this.filterBy.sortBy === 'newly-listed' ? 'active' : ''
    },
    lowestMileageActive() {
      return this.filterBy.sortBy === 'lowest-mileage' ? 'active' : ''
    }
  },
  methods: {
    setFilter() {
      this.$store.commit({ type: 'setFilter', filterBy: this.filterBy })
      this.$store.dispatch({ type: 'loadCars' })
    },
    setSort(sortBy) {
      this.filterBy.sortBy = sortBy
      this.$store.commit({ type: 'setSort', sortBy: this.filterBy.sortBy })
      this.$store.dispatch({ type: 'loadCars' })
    }
  },
  created() {
    this.filterBy = { byYears: this.filterBy.byYears, sortBy: this.filterBy.sortBy,...this.$store.getters.filterBy };
    // this.filterBy = { byYears: this.$store.getters.filterBy.byYears, sortBy: this.$store.getters.filterBy.sortBy,...this.$store.getters.filterBy };

// if (!this.filterBy.sortBy) this.filterBy.sortBy = 'ending-soon' //////////////////////
    window.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.yearsRangeIsOpen = false
      }
    })
  },
  destroyed() {
    this.filterBy.byYears = [1970, 2021]
    this.filterBy.bodyStyles = ''
    this.filterBy.vendors = []
    this.filterBy.sortBy = ''
    this.$store.commit({ type: 'setFilter', filterBy: this.filterBy })
  }
}
</script>

