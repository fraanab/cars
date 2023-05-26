<template>
  <section v-if="carToEdit" class="car-edit flex flex-col align-center">
    <h1>Tell us about your car</h1>
    <p>Give us the following info and we’ll work to get the auction live.</p>

    <form @submit.prevent="saveCar">
      <div>
        <h2>Car details</h2>
        <div class="flex justify-center justify-between align-center">
          <div class="flex flex-col">
            <label for="e-set-vendor">Vendor</label>
            <el-select
              @change="setModel"
              v-model="carToEdit.vendor"
              placeholder=""
              id="e-set-vendor"
              filterable
              no-match-text="Not here yet..."
            >
              <el-option
                v-for="item in vendors"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div class="flex flex-col">
            <label for="e-set-model">Model</label>
            <el-select
              v-model="carToEdit.model"
              placeholder=""
              id="e-set-model"
              filterable
              :allow-create="true"
              no-match-text="Not here yet..."
              no-data-text="Choose car vendor first / no matches"
            >
              <el-option
                v-for="item in models"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="flex justify-between align-center">
          <div class="flex flex-col">
            <label for="e-set-style">Body style</label>
            <el-select
              v-model="carToEdit.bodyStyle"
              placeholder=""
              id="e-set-style"
              filterable
              no-match-text="Not here yet..."
            >
              <el-option
                v-for="item in bodyStyles"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div class="flex flex-col">
            <label for="e-set-year">Year</label>
            <el-select
              v-model.number="carToEdit.year"
              placeholder=""
              id="e-set-year"
              filterable
              no-match-text="Only 1970-2021 alowed"
            >
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="flex justify-between align-center">
          <div class="flex flex-col">
            <label for="e-set-drivetrain">Drivetrain</label>
            <el-select
              v-model="carToEdit.drivetrain"
              placeholder=""
              id="e-set-drivetrain"
              filterable
              :allow-create="true"
              no-match-text="Not here yet"
            >
              <el-option
                v-for="item in drivetrains"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div class="flex flex-col">
            <label for="e-set-transmission">Transmission</label>
            <el-select
              v-model="carToEdit.transmission"
              placeholder=""
              id="e-set-transmission"
              filterable
              no-match-text="Not here yet"
            >
              <el-option
                v-for="item in transmissions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="flex justify-between align-center">
          <div class="flex flex-col">
            <label for="e-set-exterior-color">Exterior color</label>
            <el-select
              v-model="carToEdit.exteriorColor"
              placeholder=""
              id="e-set-exterior-color"
              filterable
              no-match-text="Not here yet"
            >
              <el-option
                v-for="item in colors"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div class="flex flex-col">
            <label for="e-set-interior-color">Interior color</label>
            <el-select
              v-model="carToEdit.interiorColor"
              placeholder=""
              id="e-set-interior-color"
              filterable
              no-match-text="Not here yet"
            >
              <el-option
                v-for="item in colors"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="flex flex-col justify-center">
          <label for="e-set-description">Description</label>
          <el-input
            type="textarea"
            :rows="4"
            v-model="carToEdit.desc"
            placeholder=""
            clearable
            id="e-set-description"
          >
          </el-input>
        </div>
        <div class="flex flex-col justify-center">
          <label for="e-set-address">Address</label>
          <el-input
            v-model="carToEdit.location.address"
            placeholder=""
            clearable
            id="e-set-address"
          >
          </el-input>
        </div>

        <div class="flex justify-between align-center">
          <div class="flex flex-col">
            <label for="e-set-mileage">Mileage (mi)</label>
            <el-input-number
              v-model="carToEdit.mileage"
              :min="0"
              :controls="false"
              id="e-set-mileage"
            ></el-input-number>
          </div>
          <div class="flex flex-col">
            <label for="e-set-start-price">Reserve price (USD)</label>
            <el-input-number
              v-model="carToEdit.auction.startPrice"
              :min="0"
              :step="50"
              :controls="false"
              id="e-set-start-price"
            >
            </el-input-number>
          </div>
        </div>

        <div>
          <img-upload @saveImgs="saveImgs"></img-upload>
        </div>

        <div class="flex justify-between">
          <router-link to="/car" class="reg-btn back">Back</router-link>
          <button class="clean-btn reg-btn save">Save</button>
        </div>
      </div>
    </form>
  </section>
  <div
    v-else
    v-loading.fullscreen.lock="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>

<script>
import { dataService } from "@/services/data.service.js";
import { carService } from "@/services/car.service.js";
import { socketService } from "@/services/socket.service.js";
import { showMsg } from "../services/eventBus.service.js";
import imgUpload from "../cmps/img-upload";

export default {
  name: "car-edit",
  data() {
    return {
      carToEdit: null,
      bodyStyles: carService.getBodyStyleList(),
      vendors: carService.getVendorList(),
      models: dataService.getCars(""),
      years: [],
      transmissions: carService.getTransmissionList(),
      drivetrains: carService.getDrivetrainList(),
      colors: dataService.getColors(),
      imgUrls: []
    };
  },
  computed: {
    carId() {
      return this.$route.params.carId;
    },
    loading() {
      return this.carToEdit ? false : true;
    },
  },
  methods: {
    setModel() {
      this.models = dataService.getCars(this.carToEdit.vendor);
    },
    async saveCar() {
      try {
        if (!this.$store.getters.loggedinUser) {
          this.$store.commit("toggleLogin", { isShown: true });
        } else {
          const newCar = await this.$store.dispatch({ type: "saveCar", car: this.carToEdit });
          socketService.emit('details newCar', newCar)
          showMsg("Car saved");
          this.carToEdit = carService.getEmptyCar();
          this.$router.push("/car");
          try {
            await this.$store.dispatch({ type: "loadCars" });
          } catch (err) {
            this.$message({
              showClose: true,
              message: 'Can not load cars',
              type: 'danger'
            });
          }
        }
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'Can not save cars',
          type: 'danger'
        });
      }
    },
    saveImgs(imgUrls) {
      this.carToEdit.imgUrls = imgUrls;
    },
  },
  created() {
    for (let i = 2021; i >= 1970; i--) {
      this.years.push({ value: i, label: i });
    }
    if (this.carId) {
      try {
        carService.getById(this.carId).then((car) => {
          this.carToEdit = car;
        });
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'Can not load car',
          type: 'danger'
        });
      }
    } else {
      this.carToEdit = carService.getEmptyCar();
    }
  },
  components: {
    imgUpload,
  },
};
</script>