<template>
  <div class="img-upload-container flex flex-col">
    <img v-if="imgUrl" :src="imgUrl" alt="" />

    <template v-else>
      <!-- <template v-if="!isLoading"> -->
      <!-- UPLOAD IMG -->
      <label
        for="imgUploader"
        @drop.prevent="handleFile"
        @dragover.prevent="dragOver"
        @dragleave="isDragOver = false"
        :class="{ drag: isDragOver }"
      >
        <div
          class="drag-container flex flex-col justify-center align-center"
          v-loading.lock="isLoading"
        >
          <div class="upload-logo-container">
            <img src="../assets/images/plus.png" alt="" />
          </div>
          <!-- <p>➕</p> -->
        </div>
      </label>

      <!-- HIDDEN INPUT -->
      <input
        type="file"
        name="img-uploader"
        accept="image/png, image/jpeg"
        id="imgUploader"
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
  name: 'avatar-upload',
  data() {
    return {
      isLoading: false,
      isDragOver: false,
      imgUrl: '',
    };
  },
  methods: {
    dragOver(ev) {
      this.isDragOver = true;
    },
    handleFile(ev) {
      console.log('ev:', ev)
      let file;
      if (ev.type === "change") file = ev.target.files[0];
      else if (ev.type === "drop") file = ev.dataTransfer.files[0];
      this.onUploadImg(file);
    },

    async onUploadImg(file) {
      this.isDragOver = false;
      try {

        this.isLoading = true;
        const res = await uploadImg([file]);
        console.log('res in upload cmp:', res)
        this.imgUrl = res[0].url
        this.$emit('saveImg', this.imgUrl)
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