import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./utils/rem.js";
import { openDb, setItem, getItem } from "./db";
Vue.use(ElementUI);
Vue.config.productionTip = false;

function getLocalData(key) {
  let data = localStorage.getItem(key);
  data = data ? JSON.parse(data) : [];
  if (data.length === 0) {
    let tmp = {
      originData: [],
      date: {},
      recipes: {},
      productsDate: {},
      productsOriginData: [],
      assetTypeData: [],
      assetRules: [
        {
          decrease: "",
          increase: "",
        },
      ],
    };
    localStorage.setItem(key, JSON.stringify(tmp));
  }
  return data;
}
function setLocalData(key, subKey, data) {
  let currentData = JSON.parse(localStorage.getItem(key));
  currentData[subKey] = data;
  localStorage.setItem(key, JSON.stringify(currentData));
}
Vue.prototype.getLocalData = getLocalData;
Vue.prototype.setLocalData = setLocalData;

Vue.prototype.openDb = openDb;
Vue.prototype.setItem = setItem;
Vue.prototype.getItem = getItem;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
