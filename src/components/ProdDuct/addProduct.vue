<template>
  <div class="wuliao-container">
    <!-- 产品弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form
        size="mini"
        :rules="rules"
        :model="form"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="食材名称" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            type="text"
            v-model="form.price"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="resetForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";

export default {
  name: "ProductView",
  components: {},
  data() {
    return {
      productsOriginData: [],
      currentData: {},
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入单价", trigger: "blur" }],
      },
      form: {
        name: "",
        price: 0,
      },
      dialogVisible: false,
    };
  },
  watch: {
    $route: {
      handler: function (val) {
        let key = val.params.id;
        this.currentData = this.getLocalData(key, {});
      },
      immediate: true,
    },
  },
  computed: {
    nodata() {
      let data = Object.keys(this.currentData);
      return data.length === 0;
    },
  },
  props: {},
  methods: {
    addAssets() {
      this.currentData = this.getCurrentData();
      this.dialogVisible = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    showDialog() {
      this.currentData = this.getCurrentData();
      this.productsOriginData = this.currentData.productsOriginData;
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name } = this.form;
          let result = this.productsOriginData.filter(
            (item) => item.name === name
          );
          if (result.length > 0) {
            this.$message({
              message: `类型${this.form.name}已存在`,
              type: "warning",
            });
            return;
          }
          let id = this.productsOriginData.length;
          this.productsOriginData.push({
            name: this.form.name.replace(/\s*/g, ""),
            price: this.form.price,
            id: id,
            count: 0,
          });
          let key = this.$route.params.id;
          this.currentData.productsOriginData = this.productsOriginData;
          localStorage.setItem(key, JSON.stringify(this.currentData));
          this.$message({
            message: `产品 ${this.form.name}保存成功`,
            type: "success",
          });
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key, {
        productsOriginData: [],
      });
      return currentData;
    },
  },
  created() {
    this.currentData = this.getCurrentData();
    this.productsOriginData = this.currentData.productsOriginData;
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
