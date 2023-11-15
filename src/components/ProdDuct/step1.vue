<template>
  <div class="prod-step1">
    <el-form
      size="mini"
      :rules="rules"
      :model="form"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="产品名称" prop="name">
        <el-input type="text" v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input
          type="text"
          v-model="form.price"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="组成" prop="checkList">
        <el-checkbox-group
          v-model="form.checkList"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="asset in originData"
            :label="asset.name"
            :key="asset.name"
            >{{ asset.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">下一步</el-button>
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
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入单位", trigger: "blur" }],
        checkList: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
      },
      form: {
        name: "",
        price: "",
        checkList: [],
        id: "",
      },
    };
  },
  watch: {
    currentForm: {
      handler: function (val) {
        if (this.dialogType === "edit" && Object.keys(val).length > 0) {
          this.form = { ...val };
        }
        this.setCheckList(this.form.checkList);
      },
      deep: true,
    },
  },
  props: {
    msg: String,
    currentForm: {
      type: Object,
      default: () => {},
    },
    dialogType: {
      type: String,
      default: () => "add",
    },
  },
  computed: {
    ...mapState(["stepIndex"]),
    // title() {
    //   const { time, name } = this.form;
    //   let week = this.getWeek(time);
    //   return name + " " + time + " " + week;
    // },
  },
  methods: {
    ...mapMutations(["setStepIndex", "setCheckList", "setFormInfo"]),
    handleCheckedCitiesChange(val) {
      console.log("val = ", val);
      console.log("checklist = ", this.form.checkList);
    },
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
          this.setCheckList(this.form.checkList);
          this.setFormInfo({ ...this.form });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.form.name = "";
      this.form.price = "";
      this.form.checkList = [];
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
    this.originData = this.currentData.originData;
    if (this.dialogType === "edit") {
      this.form = { ...this.currentForm };
    }
    this.setCheckList(this.form.checkList);
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
