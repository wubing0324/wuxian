<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html,
body {
  margin: 0;
  background: rgba(246, 246, 249, 1);
}
body {
  font-size: 14px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .daohang {
    font-size: 12px;
  }
  margin: 0 20px 20px 20px;
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
