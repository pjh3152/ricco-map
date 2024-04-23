import { createRouter, createWebHistory } from "vue-router";
import KakaoMap from "@/views/KakaoMap";

const routes = [
  {
    path: "/",
    name: "Default",
    component: KakaoMap,
  },
  {
    path: "/search/:keyword/:seconds",
    name: "Search",
    component: KakaoMap,
  },
  {
    path: "/view/:x",
    name: "View",
    component: KakaoMap,
  },
  {
    path: "/category/:category",
    name: "Category",
    component: KakaoMap,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { router };
