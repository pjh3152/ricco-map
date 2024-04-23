<template>
  <div class="container-fluid d-flex justify-content-between align-items-center">
    <div class="logo">
      <img src="@/assets/ricco.png" class="logoPic"> Riccomap
    </div>
    <div class="my-2 me-2">
      <ul>
        <li @click="goCurLocation"><img src="@/assets/curPos.png" alt="curPos" class="curPos"></li>
        <li @click="search('BK9')" :style="style.s1">은행</li>
        <li @click="search('MT1')" :style="style.s2">마트</li>
        <li @click="search('PM9')" :style="style.s3">약국</li>
        <li @click="search('OL7')" :style="style.s4">주유소</li>
        <li @click="search('CE7')" :style="style.s5">카페</li>
        <li @click="search('CS2')" :style="style.s6">편의점</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getCurLocation } from "@/util/currentLocation";

const style = ref({
  s1: "",
  s2: "",
  s3: "",
  s4: "",
  s5: "",
  s6: "",
});

const router = useRouter();

// 현재위치로 이동
const goCurLocation = async () => {

  const curLocation = await getCurLocation().catch(err => { console.log(err); });

  if (curLocation) {
    router.push({
      name: "View",
      params: {
        x: curLocation.longitude,
      },
      state: {
        x: curLocation.longitude,
        y: curLocation.latitude,
      }
    });
  }
}

const clearStyle = () => {
  style.value.s1 = "";
  style.value.s2 = "";
  style.value.s3 = "";
  style.value.s4 = "";
  style.value.s5 = "";
  style.value.s6 = "";
}

const search = (category) => {

  clearStyle();

  if (category === "BK9") style.value.s1 = "background:#4b96f3;";
  if (category === "MT1") style.value.s2 = "background:#4b96f3;";
  if (category === "PM9") style.value.s3 = "background:#4b96f3;";
  if (category === "OL7") style.value.s4 = "background:#4b96f3;";
  if (category === "CE7") style.value.s5 = "background:#4b96f3;";
  if (category === "CS2") style.value.s6 = "background:#4b96f3;";

  router.push({
    name: "Category",
    params: {
      category,
    },
  })
}
</script>

<style lang="scss" scoped>

.logo {
  color:white;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;

  .logoPic {
    width: 40px;
    border-radius: 70%;
  }
}

li {
  float: left;
  list-style: none;
  border: 1px solid gray;
  padding: 5px 8px;
  border-radius: 7px;
  margin-right: 8px;
  font-size: 12px;
  background:ghostwhite;
  cursor: pointer;
}

.curPos {
  float: left;
  width: 17px;
}

.selected {
  background: red;
}
</style>