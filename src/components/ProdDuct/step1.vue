<template>
  <div class="prod-step1">
    <el-form
      size="mini"
      :rules="rules"
      :model="form"
      ref="form"
      label-width="180px"
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
          <div
            class="assetTypeData"
            v-for="type in assetTypeData"
            :key="type.value"
          >
            <span class="type-class">{{ type.value }}：</span>
            <el-checkbox
              v-for="asset in filterData(type.value)"
              :label="asset.id"
              :key="asset.id"
              :value="asset.id"
              >{{ asset.name }}</el-checkbox
            >
          </div>
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
      assetTypeData: [],
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
    ...mapState(["stepIndex", "types"]),
    // title() {
    //   const { time, name } = this.form;
    //   let week = this.getWeek(time);
    //   return name + " " + time + " " + week;
    // },
  },
  methods: {
    ...mapMutations(["setStepIndex", "setCheckList", "setFormInfo"]),
    filterData(type) {
      let data = this.originData.filter((data) => data.type === type);
      return data;
    },
    handleCheckedCitiesChange() {},
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
    this.assetTypeData = this.currentData.assetTypeData;
    if (this.dialogType === "edit") {
      this.form = { ...this.currentForm };
    }
    this.setCheckList(this.form.checkList);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.assetTypeData {
  display: flex;
  .type-class {
    font-size: 16px;
    margin-right: 10px;
    width: 120px;
    text-align: left;
  }
}
.prod-step1 {
  .shengyu {
    color: green;
  }
  .ruku {
    color: red;
  }
}
</style>
