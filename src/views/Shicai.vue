<template>
  <div class="shicai-container">
    <div class="card-box">
      <shicai
        class="shicai-card"
        v-for="(item, index) in originData"
        :name="item.name"
        :key="item.type"
        :unit="item.unit"
        :index="index"
        @deleteData="deleteData(item, index)"
      ></shicai>
    </div>
  </div>
</template>

<script>
// import moment from "moment";
import shicai from "@/components/shicai.vue";

export default {
  name: "HelloWorld",
  components: {
    shicai,
  },
  data() {
    return {};
  },
  props: {
    msg: String,
  },
  computed: {},
  methods: {},
  mounted() {},
  created() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.shicai-container {
  .p-title {
    font-size: 18px;
    font-weight: 500;
  }
  .table-type {
    font-size: 16px;
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    .shicai-card {
      margin-right: 5px;
    }
  }
  .shengyu {
    color: green;
  }
  .ruku {
    color: red;
  }
  .add-card {
    width: 178px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
.test {
  color: red;
  .re {
    color: red;
  }
}
</style>
