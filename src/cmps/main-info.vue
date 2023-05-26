<template>
  <div class="main-info-container">
    <h2>Car info</h2>
    <div class="main-info details-icon-grid">
      <pre
        class="flex align-center"
      ><font-awesome-icon icon="trademark" class="main-info-icon" />  Make:</pre>
      <span>{{ car.vendor }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="list-ul" class="main-info-icon" />  Model:</pre>
      <span>{{ car.model }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="calendar-alt" class="main-info-icon" />  Year:</pre>
      <span>{{ car.year }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="car-side" class="main-info-icon" />  Body Style:</pre>
      <span>{{ car.bodyStyle }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="calendar-alt" class="main-info-icon" />  Mileage:</pre>
      <span>{{ mileage }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="truck-monster" class="main-info-icon" />  Drivetrain:</pre>
      <span>{{ car.drivetrain }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="microchip" class="main-info-icon" />  Engine:</pre>
      <span>{{ car.engine }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="cogs" class="main-info-icon" />  Gear:</pre>
      <span>{{ car.transmission }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="palette" class="main-info-icon" />  Ext. color:</pre>
      <span>{{ car.exteriorColor }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="palette" class="main-info-icon" />  Int. color:</pre>
      <span>{{ car.interiorColor }}</span>
    </div>
    <h3>{{car.desc}}</h3>
  </div>
</template>



<script>
import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faCarSide, faTrademark, faCalendarAlt, faMicrochip, faCogs, faTruckMonster, faPalette, faListUl
} from '@fortawesome/free-solid-svg-icons'



library.add(faCarSide, faTrademark, faCalendarAlt, faMicrochip, faCogs, faTruckMonster, faPalette, faListUl)


export default {
  name: "main-info",
  props: {
    car: {
      type: Object,
    },
  },
  computed: {
    mileage() {
      return this.car.mileage.toLocaleString('en-US')
    }
  }
}
</script>