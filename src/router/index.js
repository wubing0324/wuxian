import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/wuliao/:id",
    name: "wuliao",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "wuliao" */ "../views/wuliao.vue"),
  },
  {
    path: "/prod/:id",
    name: "prod",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "prod" */ "../views/prod.vue"),
  },
  {
    path: "/indexDb",
    name: "indexDb",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "indexDb" */ "../views/IndexDb.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
