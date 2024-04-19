<template>
  <div class="container-fluid">

    <div class="row border">
      <div class="col-2">
        <div class="row">
          <div class="col-12 text-center my-4">
            <input type="text" ref="input" placeholder="키워드검색" autocomplete="off" @keyup.enter="search">
          </div>
          
          <div class="col-12" v-for="d in placesData" :key="d.id">
            <ListCard :data="d" @click="viewPlace(d.x, d.y)" style="cursor:pointer;"/>
          </div>
        </div>
      </div>
      <div class="col-10">
        <div id="map"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCurLocation } from "@/util/currentLocation";
import ListCard from "@/components/ListCard";

const map = ref(null);
const input = ref(null);
const placesData = ref(null);
const marker = ref(null);

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
  input.value.focus();
})

// 지도 스크립트 생성
const loadScript = () => {
  const script = document.createElement("script");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_API_KEY}&autoload=false&libraries=services`;
  script.onload = () => window.kakao.maps.load(loadMap);
  document.head.appendChild(script);
}

// 지도로드
const loadMap = async () => {

  let lat = 33.450701;
  let lng = 126.570667;

  // 현재위치
  const curLocation = await getCurLocation().catch(err => { console.log(err); });

  if (curLocation) {
    lat = curLocation.latitude;
    lng = curLocation.longitude;
  }

  const container = document.getElementById("map");
  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 3,
  };

  map.value = new window.kakao.maps.Map(container, options);
}

// 장소검색
const search = (e) => {

  const keyword = e.target.value;

  if (!keyword) return;

  // var markerPos = null;
  // const bounds = new window.kakao.maps.LatLngBounds();
  const places = new window.kakao.maps.services.Places();

  places.keywordSearch(keyword, (places, status) => {

    if (status == window.kakao.maps.services.Status.OK) {

      placesData.value = places;

      console.log(places);

      // for (var i = 0; i < places.length; i++) {


      //   markerPos = new window.kakao.maps.LatLng(places[i].y, places[i].x);

      //   // 마커생성
      //   // var marker = new window.kakao.maps.Marker({
      //   //   position: markerPos
      //   // });

      //   // markers.push(marker);

      //   // // 마커가 지도 위에 표시되도록 설정
      //   // marker.setMap(map.value);

      //   bounds.extend(markerPos);
      // }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정
      // map.value.setBounds(bounds);
    }
  })
}

const viewPlace = (x, y) => {

  if (marker.value) {
    marker.value.setMap(null);
  }
  marker.value = null;

  var markerPos = new window.kakao.maps.LatLng(y, x);

  // 마커생성
  marker.value = new window.kakao.maps.Marker({
    position: markerPos
  });

  marker.value.setMap(map.value);

  // 마커 위치로 이동
  map.value.panTo(markerPos);

  // map.value.setLevel(3);
}

// const removeMarker = () => {

//   for (var i = 0; i < markers.length; i++) {
//     markers[i].setMap("");
//   }
//   markers = [];

//   run.value += 1;
// }
</script>

<style lang="scss" scoped>
input {
  border: 3px solid #07cb5d;
  outline: none;
  border-radius: 5px;
  width: 100%;
  height: 35px;
  padding-left: 30px;

  background-image: url("../assets/search.png");
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: 5px 50%;
}

input::placeholder {
  color: darkgray;
  font-weight: bold;
}

#map {
  width: 100%;
  height: 100vh;
}
</style>