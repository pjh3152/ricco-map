<template>
  <div class="container">
    <div class="card my-2">
      <div class="card-header">
        {{ m.data.place_name }}
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">{{ m.data.road_address_name }}</li>
        <li class="list-group-item">{{ m.data.address_name }}</li>
        <li class="list-group-item">{{ m.data.phone }}</li>
      </ul>
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
.card-header {
  font-weight: bold;
}

.card-header,
.list-group-item {
  font-size: 11px;
}
</style>