<template>
  <div id="app">
    <nav class="daohang">
      <router-link class="daohang" to="/wuliao/coffee">咖啡</router-link> |
      <router-link class="daohang" to="/wuliao/branch">菜品</router-link> |
      <router-link class="daohang" to="/wuliao/cake">蛋糕</router-link> |
      <router-link class="daohang" to="/shicai/branch">食材</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .daohang {
    font-size: 12px;
  }
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.el-message__icon {
  font-size: 14px;
}
</style>
