<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-12 p-0">
        <div class="row mt-3">
          <div class="col-12">
            <input type="text" ref="input" placeholder="키워드검색" autocomplete="off" @keyup.enter="search">
          </div>
        </div>
        <div class="row searchList">
          <div class="col-12 p-0" v-for="d in placesData" :key="d.id">
            <ListCard :data="d" @click="viewPlace(d.x, d.y)" style="cursor:pointer;" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ListCard from "@/components/ListCard";
import { getCurLocation } from "@/util/currentLocation";

const input = ref(null);
const placesData = ref(null);
const router = useRouter();

onMounted(() => {
  if (!window.kakao || !window.kakao.maps) {
    loadScript();
  }
  input.value.focus();
  localStorage.clear();
})

// 지도 스크립트 생성
const loadScript = () => {
  const script = document.createElement("script");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_API_KEY}&autoload=false&libraries=services`;
  document.head.appendChild(script);
}

// 장소검색
const search = async (e) => {

  const keyword = e.target.value;

  if (!keyword) return;

  // 현재위치를 구한다.
  let lat = 33.450701;
  let lng = 126.570667;

  const location = JSON.parse(localStorage.getItem("curLocation"));

  if (location) {

    lat = location.Ma;
    lng = location.La;

  } else {

    const curLocation = await getCurLocation().catch(err => { console.log(err); });

    if (curLocation) {
      lat = curLocation.latitude;
      lng = curLocation.longitude;
    }
  }

  const places = new window.kakao.maps.services.Places();

  // 검색옵션
  const options = {
    location: new window.kakao.maps.LatLng(lat, lng),
    sort_by: "DISTANCE",
  }

  places.keywordSearch(keyword, (places, status) => {

    if (status == window.kakao.maps.services.Status.OK) {

      // 목록데이터
      placesData.value = places;

      // 파라미터는 KakaoMap 컴포넌트에서 변경을 감지하기 위함 (watch)
      // 실제 검색결과 데이터는 state 로 넘김
      router.push({
        name: "Search",
        params: {
          keyword,
          seconds: new Date().getSeconds(),
        },
        state: {
          places,
        }
      });
    }
  }, options)
}

// 장소선택
const viewPlace = (x, y) => {

  router.push({
    name: "View",
    params: {
      x,
    },
    state: {
      x,
      y,
    }
  });
}

</script>

<style lang="scss" scoped>
input {
  border: 3px solid #07cb5d;
  outline: none;
  border-radius: 5px;
  width: 93%;
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

.searchList {
  height: 88vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>