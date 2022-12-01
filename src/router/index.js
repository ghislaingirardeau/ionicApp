import { createRouter, createWebHistory } from "@ionic/vue-router";
import MemoriesPage from "../pages/MemoriesPage.vue";
import homePage from "../pages/homePage.vue";

const routes = [
  {
    path: "/",
    redirect: "/transcribe",
  },
  {
    path: "/transcribe",
    component: homePage,
  },
  {
    path: "/transcribe/file",
    component: () => import("../pages/fileToTextPage.vue"),
  },
  {
    path: "/memories",
    component: MemoriesPage,
  },
  {
    path: "/memories/:id",
    component: () => import("../pages/MemoryDetail.vue"),
  },
  {
    path: "/memories/add",
    component: () => import("../pages/addMemoryPage.vue"),
  },
  /* {
    path: "/memories/transcribe",
    component: () => import("../pages/homePage.vue"),
  }, */
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
