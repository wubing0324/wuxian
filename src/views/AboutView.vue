<template>
  <div class="hello">
    <el-button type="primary" @click="addAssets">添加食材</el-button>
    <el-button type="success" @click="addProd">添加产品</el-button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  watch: {
    $route: {
      handler: function (val) {
        let key = val.params.id;
        let data = localStorage.getItem(key);
        if (!data) {
          localStorage.setItem(key, JSON.stringify([]));
        }
      },
      immediate: true,
    },
  },
  computed: {
    currentName() {
      return this.$route.params.id;
    },
    cacheData() {
      let key = this.$route.params.id;
      let data = localStorage.getItem(key);
      return data;
    },
  },
  props: {
    msg: String,
  },
  methods: {
    addAssets() {},
    addProd() {},
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.test {
  color: red;
  .re {
    color: red;
  }
}
</style>
