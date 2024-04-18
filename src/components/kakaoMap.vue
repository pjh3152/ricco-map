<template>
  <div class="container">
    <div class="d-flex justify-content-end my-4">
      <input type="text" ref="input" autocomplete="off" v-model="keyword" @keyup.enter="search">
    </div>
    <div id="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCurLocation } from "@/util/currentLocation";

const map = ref(null);
const markerPos = ref(null);
const input = ref(null);
const keyword = ref(null);

onMounted(() => {
  loadMap();
  input.value.focus();
})

// 지도로드
const loadMap = () => {

  const script = document.createElement("script");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_API_KEY}&autoload=false&libraries=services`;
  script.onload = () => window.kakao.maps.load(
    () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      map.value = new window.kakao.maps.Map(container, options);
    }
  );
  document.head.appendChild(script);

  // 사용자의 현재위치로 지도 이동 (타이머 처리 안하면 안됨)
  setTimeout(async () => {
    const curLocation = await getCurLocation().catch(err => { console.log(err); });
    markerPos.value = new window.kakao.maps.LatLng(curLocation.latitude, curLocation.longitude);
    map.value.panTo(markerPos.value);
  }, 1000);
}

// 장소검색
const search = () => {

  if (!keyword.value) return;

  const places = new window.kakao.maps.services.Places();

  places.keywordSearch(keyword.value, (result, status) => {

    if (status == window.kakao.maps.services.Status.OK) {
      markerPos.value = new window.kakao.maps.LatLng(result[0].y, result[0].x);

      // 마커생성
      var marker = new window.kakao.maps.Marker({
        position: markerPos.value
      });

      // 마커가 지도 위에 표시되도록 설정
      marker.setMap(map.value);

      // 마커위치로 지도이동
      map.value.panTo(markerPos.value);
    }
  })
}
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 80vh;
  border-radius: 10px;
}
</style>