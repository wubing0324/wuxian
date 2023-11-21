<template>
  <div class="shicai-container">
    <el-dialog
      title="食材构成"
      :visible.sync="dialogVisible"
      custom-class="edit-table-class"
    >
      {{ checkList }}
      <el-form
        size="mini"
        :model="form"
        ref="form"
        label-width="300px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="assetMap[check + '']"
          :key="check"
          :prop="check + ''"
          :rules="[{ required: true, message: '数量不能为空' }]"
          v-for="check in checkList"
        >
          <el-input
            type="text"
            v-model="form[check + '']"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";

export default {
  name: "EditTable",
  components: {},
  data() {
    return {
      dialogVisible: false,
      currentForm: {},
      dialogType: "add",
      assetMap: {},
      productsOriginData: [],
      productsDate: {},
      form: {},
      originData2: [],
      recipes: {},
      checkList: [],
    };
  },
  props: {
    msg: String,
    originData: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    showDialog(row) {
      console.log("row = ", row);
      this.dialogVisible = true;
      this.currentData = this.getCurrentData();
      this.recipes = this.currentData.recipes;
      this.productsOriginData = this.currentData.productsOriginData;
      let result = this.productsOriginData.find((data) => data.name === row[0]);
      this.$set(this, "checkList", result.checkList);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    resetForm() {
      this.$emit("handleClose");
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key);
      return currentData;
    },
  },
  mounted() {},
  created() {
    this.currentData = this.getCurrentData();
    this.recipes = this.currentData.recipes;
    this.productsOriginData = this.currentData.productsOriginData;
    this.productsDate = this.currentData.productsDate;
    this.originData2 = this.currentData.originData;
    this.originData2.forEach((asset) => {
      this.assetMap[asset.id] = asset.name;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.shicai-container {
  .edit-table-class {
    .el-dialog__header {
      // display: none;
    }
  }
  .el-step {
    text-align: left;
  }
}
</style>
