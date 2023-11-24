<template>
  <div class="combine-container">
    <el-dialog
      title="食材构成"
      :visible.sync="dialogVisible"
      custom-class="edit-table-class"
    >
      <el-form
        size="mini"
        :model="form"
        ref="form"
        label-width="300px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="assetMap[id + '']"
          :key="id"
          v-for="(check, id) in form"
        >
          <el-input
            type="text"
            v-model="form[id]"
            autocomplete="off"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";

export default {
  name: "ShowCombine",
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
      this.dialogVisible = true;
      this.currentData = this.getCurrentData();
      this.recipes = this.currentData.recipes;
      this.productsOriginData = this.currentData.productsOriginData;
      let result = this.productsOriginData.find((data) => data.name === row[0]);
      this.form = this.recipes[result.id];
      this.$set(this, "checkList", result.checkList);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    resetForm() {
      this.$emit("handleClose");
      this.dialogVisible = false;
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
.combine-container {
  .el-step {
    text-align: left;
  }
}
</style>
