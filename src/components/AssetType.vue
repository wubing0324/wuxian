<template>
  <div class="shicai-container">
    <!-- 食材种类弹窗 -->
    <el-dialog
      title="食材种类"
      :visible.sync="dialogVisibleType"
      width="30%"
      :before-close="handleCloseType"
    >
      <el-form
        :model="form"
        ref="form"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="食材种类"
          prop="name"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input
            type="name"
            v-model="form.name"
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
export default {
  name: "HelloWorld",
  data() {
    return {
      currentData: {},
      assetTypeData: [],
      form: {
        name: "",
      },
      dialogVisibleType: false,
      selectOptions: [
        {
          value: "预处理",
          label: "预处理",
        },
        {
          value: "解冻",
          label: "解冻",
        },
        {
          value: "水果",
          label: "水果",
        },
        {
          value: "中种",
          label: "中种",
        },
        {
          value: "蔬菜*未处理",
          label: "蔬菜*未处理",
        },
      ],
    };
  },
  props: {
    msg: String,
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
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let names = this.assetTypeData.map((item) => item.value);
          if (names.includes(this.form.name)) {
            this.$message({
              message: `类型${this.form.name}已存在`,
              type: "warning",
            });
            return;
          }
          this.assetTypeData.push({
            value: this.form.name,
            label: this.form.name,
          });
          let key = this.$route.params.id;
          this.currentData.assetTypeData = this.assetTypeData;
          localStorage.setItem(key, JSON.stringify(this.currentData));
          this.$message({
            message: `类型${this.form.name}保存成功`,
            type: "success",
          });
          this.dialogVisibleType = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisibleType = false;
    },
    showDialog() {
      this.dialogVisibleType = true;
    },
    addAssetType() {
      this.dialogVisibleType = true;
    },
    handleCloseType(done) {
      done();
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
  created() {
    this.currentData = this.getCurrentData();
    this.assetTypeData = this.currentData.assetTypeData;
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
