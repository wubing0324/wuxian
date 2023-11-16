<template>
  <div class="shicai-container">
    <el-dialog
      title="修改食材"
      :visible.sync="dialogVisible"
      custom-class="edit-table-class"
    >
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
        <el-form-item label="单位" prop="unit">
          <el-input
            type="text"
            v-model="form.unit"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择食材类型">
            <el-option
              v-for="item in assetTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
import moment from "moment";

export default {
  name: "EditTable",
  components: {},
  data() {
    return {
      assetTypeData: [],
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
      },
      form: {
        name: "",
        unit: "",
        type: "",
      },
    };
  },
  props: {
    msg: String,
    originData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    // title() {
    //   const { time, name } = this.form;
    //   let week = this.getWeek(time);
    //   return name + " " + time + " " + week;
    // },
  },
  methods: {
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
          const { name, type } = this.form;
          let result = this.originData.filter(
            (item) => item.name === name && item.type === type
          );
          if (result.length > 0) {
            this.$message({
              message: `类型${this.form.name}已存在`,
              type: "warning",
            });
            return;
          }
          // this.generateColumns();
          this.generateTable();
          // localStorage.setItem("originData", JSON.stringify(this.originData));
          this.$message({
            message: `类型${this.form.name}保存成功`,
            type: "success",
          });
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    showDialog(data) {
      console.log("editdata =", data);
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
