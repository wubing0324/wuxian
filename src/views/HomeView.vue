<template>
  <div class="home">
    <!-- <nav class="daohang">
      <router-link class="daohang" to="/wuliao/coffee">咖啡</router-link> |
      <router-link class="daohang" to="/wuliao/branch">菜品</router-link> |
      <router-link class="daohang" to="/wuliao/cake">蛋糕</router-link> |
      <router-link class="daohang" to="/shicai/branch">食材</router-link>
    </nav> -->
    <div class="menu-container">
      <el-card
        class="menu-item"
        v-for="item in menuData"
        :key="item.name"
        @click.native="jump(item.routerName)"
      >
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
        <div style="padding: 14px">
          <span>{{ item.name }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      currentDate: new Date(),
      menuData: [
        {
          name: "咖啡",
          routerName: "coffee",
        },
        {
          name: "菜品",
          routerName: "branch",
        },
        {
          name: "蛋糕",
          routerName: "cake",
        },
      ],
    };
  },
  methods: {
    jump(type) {
      // this.$router.push({ name: "wuliao", params: { type } });
      this.$router.push({ path: `/wuliao/${type}` });
    },
  },
};
</script>
<style lang="less">
.menu-container {
  display: flex;
  width: 800px;
  margin: 180px auto;
  justify-content: space-between;
  .menu-item {
    width: 240px;
    height: 270px;
    font-size: 26px;
    cursor: pointer;
  }
}
time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
