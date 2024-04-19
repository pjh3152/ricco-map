<template>
  <div class="container">
   <div class="row">
    <div class="col-12">
      {{ m.data.place_name }}
    </div>
   </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

 const m = defineProps({
  data: Object,
 })
</script>

<style lang="scss" scoped>
  
</style>