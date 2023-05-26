<template>
  <div class="img-list-container flex">
    <!-- <div v-html="listHeader"></div> -->
    <div v-for="(imgUrl, idx) in imgUrls" :key="idx" class="img-container">
      <img
        :src="imgUrl"
        alt="img..."
        @click="setAsAvatar(imgUrl)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgUrls: Array
  },
  computed: {
    // listHeader() {
    //   return (this.imgUrls && this.imgUrls.length) ? '<h2>Images List</h2><h3>picture</h3>' : '<h2>No Images</h2>';
    // }
  },
  methods: {
    setAsAvatar(imgUrl) {
      this.$emit('setAvatar', imgUrl)
    }
  }
}
</script>