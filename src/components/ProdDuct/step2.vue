<template>
  <div class="prod-step2">
    <el-form
      size="mini"
      :model="form"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
    >
      {{ checkList }}
      <el-form-item
        :label="check + ''"
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
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapMutations } from "vuex";
export default {
  name: "EditTable",
  components: {},
  data() {
    return {
      productsOriginData: [],
      productsDate: {},
      form: {},
    };
  },
  props: {
    productName: String,
    originData: {
      type: Array,
      default: () => [],
    },
    dialogType: {
      type: String,
      default: () => "add",
    },
  },
  computed: {
    ...mapState(["stepIndex", "checkList", "formInfo"]),
  },
  methods: {
    ...mapMutations(["setStepIndex"]),
    getWeek(date) {
      // 参数时间戳
      let week = moment(date).day();
      switch (week) {
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        case 0:
          return "周日";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        debugger;
        if (valid) {
          this.setStepIndex(this.stepIndex + 1);
          if (this.dialogType === "add") {
            this.$emit("updateProd", {
              type: this.dialogType, // 表单状态
              checkList: this.checkList, //构成所需食材
              ...this.formInfo, // 产品属性
              form: { ...this.form }, // 食材价格
            });
            this.$emit("handleClose");
          } else {
            let result = this.productsOriginData.filter(
              (item) => item.id === this.formInfo.id
            );
            if (result.length > 0) {
              this.$message({
                message: `类型${this.formInfo.name}已存在`,
                type: "warning",
              });
              return;
            }
            this.$emit("updateProd", {
              type: this.dialogType,
              checkList: this.checkList,
              ...this.formInfo,
              form: { ...this.form },
            });
            this.$emit("handleClose");
          }
          this.$emit("handleClose");
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    this.productsOriginData = this.currentData.productsOriginData;
    this.productsDate = this.currentData.productsDate;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.prod-step1 {
  .shengyu {
    color: green;
  }
  .ruku {
    color: red;
  }
}
</style>
