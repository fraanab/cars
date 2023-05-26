<template>
  <div class="img-upload-container flex flex-col">
    <template>
      <!-- <template v-if="!isLoading"> -->
      <!-- UPLOAD IMG -->
      <h2>Photos</h2>
      <p>
        Please upload at least 5 photos of the exterior and interior of the car.
      </p>
      <label
        for="imgUploader"
        @drop.prevent="handleFile"
        @dragover.prevent="dragOver"
        @dragleave="isDragOver = false"
        :class="{ drag: isDragOver }"
      >
        <div class="drag-container flex flex-col justify-center align-center">
          <div class="upload-logo-container">
            <img src="../assets/images/upload.png" alt="" />
          </div>
          <p>Click to select photos, or drag and drop here</p>
        </div>

        <!-- <h3 v-else>Drop image here</h3> -->
      </label>
      <!-- <img-list v-if="imgUrls.length" :imgUrls="imgUrls" :isLoading="isLoading"/> -->
      <!-- <img-list v-if="imgUrls.length || isLoading" :imgUrls="imgUrls" :isLoading="isLoading"/> -->
      <img-list
        v-if="imgUrls.length || isLoading"
        :imgUrls="imgUrls"
        v-loading.lock="isLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      />

      <!-- HIDDEN INPUT -->
      <input
        type="file"
        name="img-uploader"
        accept="image/png, image/jpeg"
        id="imgUploader"
        :multiple="true"
        @change="handleFile"
      />
    </template>
    <!-- LOADER -->
    <!-- <img
      class="loader"
      v-else
      src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
      alt=""
    /> -->
  </div>
</template>

<script>
import { uploadImg } from "@/services/img-upload.service.js";
import imgList from '../cmps/img-list';



export default {
  data() {
    return {
      isLoading: false,
      isDragOver: false,
      imgUrls: [],
    };
  },
  methods: {
    dragOver(ev) {
      this.isDragOver = true;
    },
    handleFile(ev) {
      let files;
      if (ev.type === "change") files = ev.target.files;
      else if (ev.type === "drop") files = ev.dataTransfer.files;
      this.onUploadImg(files);
    },

    async onUploadImg(files) {
      this.isDragOver = false;
      try {

        this.isLoading = true;
        const res = await uploadImg(files);
        console.log('res in upload cmp:', res)
        res.forEach(img => {

          this.imgUrls.push(img.url)
        });
        this.$emit('saveImgs', this.imgUrls)
      } catch (err) {
        console.log('can`t upload images', err);
      } finally {
        this.isLoading = false;
      }
      // this.$emit("save", res.url);
    },
  },
  components: {
    imgList
  }
};
</script>