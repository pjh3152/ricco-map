<template>
  <div class="container-fluid">
    <div id="map"></div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { getCurLocation } from "@/util/currentLocation";
import { useRoute } from "vue-router";

var map = null;
var markers = [];
var curLat = 33.450701;
var curLng = 126.570667;

const route = useRoute();

// 파라미터를 감시하여 변경이 감지되면 Search 라우트일 경우 실행
// watch(() => [route.params.keyword, route.params.x], ([newKeyword, oldKeyword], [newX, oldX]) => {
watch(() => [route.params.keyword, route.params.seconds, route.params.x, route.params.category], () => {
  if (route.name === "Search") {
    search();
  }
  if (route.name === "View") {
    viewPlace();
  }
  if (route.name === "Category") {
    viewCategory();
  }
})

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
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

  // 현재위치 구하기
  const curLocation = await getCurLocation().catch(err => { console.log(err); });

  if (curLocation) {
    curLat = curLocation.latitude;
    curLng = curLocation.longitude;
  }

  const container = document.getElementById("map");
  const options = {
    center: new window.kakao.maps.LatLng(curLat, curLng),
    level: 3,
  };

  map = new window.kakao.maps.Map(container, options);

  // 지도 이동시 현재 중심좌표 변경 이벤트를 등록한다.
  window.kakao.maps.event.addListener(map, 'dragend', () => {

    // 지도의  레벨을 얻어옵니다
    // var level = map.getLevel();

    // 지도의 중심좌표를 얻어옵니다 
    var latlng = map.getCenter();

    if (latlng) {
      curLat = latlng.Ma;
      curLng = latlng.La;

      // 로컬저장소에 현재 중심좌표 저장
      localStorage.setItem("curLocation", JSON.stringify(latlng));
    }

    if (route.params.category) {
      viewCategory();
    }
  });
}

// 키워드 검색
const search = () => {

  const places = history.state.places;

  var markerPos = null;
  // const bounds = new window.kakao.maps.LatLngBounds();

  // 기존 마커 제거
  removeMarker();

  for (var i = 0; i < places.length; i++) {

    markerPos = new window.kakao.maps.LatLng(places[i].y, places[i].x);

    // 마커생성
    var marker = new window.kakao.maps.Marker({
      position: markerPos
    });

    // 배열에 마커정보 추가
    markers.push(marker);

    // 마커가 지도 위에 표시되도록 설정
    marker.setMap(map);

    // bounds.extend(markerPos);
  }

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정
  // map.setBounds(bounds);
}

// 장소선택
const viewPlace = () => {

  const x = history.state.x;
  const y = history.state.y;

  var markerPos = new window.kakao.maps.LatLng(y, x);

  // 지도레벨 설정
  map.setLevel(3);

  // 좌표로 이동
  map.panTo(markerPos);
}

// 카테고리별 표시
const viewCategory = () => {

  removeMarker();

  const places = new window.kakao.maps.services.Places();

  // 검색옵션
  const options = {
    location: new window.kakao.maps.LatLng(curLat, curLng),
    sort_by: "DISTANCE",
  }

  places.categorySearch(route.params.category, placesSearchCB, options);
}

const placesSearchCB = (places, status) => {

  if (status === window.kakao.maps.services.Status.OK) {

    var markerPos = null;
    // const bounds = new window.kakao.maps.LatLngBounds();

    for (var i = 0; i < places.length; i++) {

      // 마커를 생성하고 지도에 표시합니다
      markerPos = new window.kakao.maps.LatLng(places[i].y, places[i].x);

      // 마커생성
      var marker = new window.kakao.maps.Marker({
        position: markerPos
      });

      // 배열에 마커정보 추가
      markers.push(marker);

      // 마커가 지도 위에 표시되도록 설정
      marker.setMap(map);

      // bounds.extend(markerPos);

      // map.panTo(markerPos);
    }

    // map.setBounds(bounds);
  }
}

// 모든 마커 제거
const removeMarker = () => {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}
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
  height: 92vh;
}
</style>