import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./utils/rem.js";
Vue.use(ElementUI);
Vue.config.productionTip = false;

function getLocalData(key, typeData) {
  let data = localStorage.getItem(key);
  data = data ? JSON.parse(data) : typeData;
  if (data.length === 0) {
    localStorage.setItem(key, JSON.stringify(typeData));
  }
  return data;
}
Vue.prototype.getLocalData = getLocalData;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
