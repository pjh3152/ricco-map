<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12 header">
        <HeaderView />
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <ListView />
      </div>
      <div class="col-10">
        <router-view />
      </div>
    </div>

  </div>
</template>

<script setup>
import HeaderView from "@/views/HeaderView";
import ListView from "@/views/ListView";

</script>

<style lang="scss" scoped>
.header {
  background: #258fff;
}
</style>