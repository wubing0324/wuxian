<template>
  <div class="prod-step2">
    <el-form
      size="mini"
      :model="form"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="check"
        :key="check"
        :prop="check"
        :rules="[{ required: true, message: '数量不能为空' }]"
        v-for="check in checkList"
      >
        {{ check }}-{{ form[check] }}
        <el-input
          type="text"
          v-model="form[check]"
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
      dialogVisible: false,
      productsOriginData: [],
      productsDate: {},
      form: {},
      recipes: {},
    };
  },
  props: {
    productName: String,
    originData: {
      type: Array,
      default: () => [],
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
        if (valid) {
          this.setStepIndex(this.stepIndex + 1);
          this.$message({
            message: `保存成功`,
            type: "success",
          });
          this.dialogVisible = false;
          this.recipes[this.formInfo.name] = { ...this.form };
          this.$refs[formName].resetFields();
          this.$emit("handleClose");
          console.log("this.recipes = ", this.recipes);
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
      let currentData = this.getLocalData(key, {
        productsOriginData: [],
        productsDate: {},
      });
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
