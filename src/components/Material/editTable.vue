<template>
  <div class="shicai-container">
    <el-dialog
      title="修改食材"
      :visible.sync="dialogVisible"
      width="90vw"
      custom-class="edit-table-class"
    >
      <div class="card-box">
        <shicai
          class="shicai-card"
          v-for="(item, index) in originData"
          :infoFromProps="item"
          :key="item.name + index"
          :assetTypeData="assetTypeData"
        ></shicai>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveData">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";
import shicai from "@/components/shicai.vue";

export default {
  name: "EditTable",
  components: {
    shicai,
  },
  data() {
    return {
      assetTypeData: [],
      dialogVisible: false,
    };
  },
  props: {
    msg: String,
    originData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    saveData() {
      this.dialogVisible = false;
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key, {
        originData: [],
        date: {},
        assetTypeData: [],
      });
      return currentData;
    },
  },
  mounted() {},
  created() {
    this.currentData = this.getCurrentData();
    this.assetTypeData = this.currentData.assetTypeData;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
// .edit-table-class {
//   height: 80vh;
// }
.shicai-container {
  .edit-table-class {
    .el-dialog__header {
      display: none;
    }
  }
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
      margin-bottom: 5px;
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
