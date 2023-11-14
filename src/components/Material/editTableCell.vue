<template>
  <div class="shicai-container">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      custom-class="edit-table-cell-class"
    >
      <el-form
        size="mini"
        :rules="rules"
        :model="form"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="入库" prop="ruku">
          <el-input-number
            v-model="increment"
            @change="incrementChange"
            label="新增"
          ></el-input-number>
          <span @click="handleAdd">计算</span>
          <el-input
            type="number"
            v-model.number="form.ruku"
            autocomplete="off"
            @change="rukuChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="剩余" prop="shengyu">
          <el-input
            type="number"
            v-model.number="form.shengyu"
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
import moment from "moment";

export default {
  name: "EditTable",
  components: {},
  data() {
    return {
      increment: 0,
      needIncrement: 0,
      prev: 0,
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        ruku: [{ required: true, message: "请输入入库数", trigger: "blur" }],
        shengyu: [{ required: true, message: "请输入剩余数", trigger: "blur" }],
      },
      time: "",
      form: {
        name: "",
        ruku: 0,
        shengyu: 0,
        time: "",
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
    title() {
      const { time, name } = this.form;
      let week = this.getWeek(time);
      return name + " " + time + " " + week;
    },
  },
  methods: {
    handleAdd() {
      this.form.ruku = Number(this.form.ruku) + this.increment;
      this.form.shengyu = Number(this.form.shengyu) + this.increment;
      this.needIncrement = this.increment;
    },
    incrementChange() {
      // this.form.ruku = Number(this.form.ruku) + (val - this.prev);
      // this.form.shengyu = Number(this.form.shengyu) + (val - this.prev);
      // this.prev = val;
    },
    rukuChange(val) {
      console.log(val, this.form.shengyu);
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
          // this.form.shengyu =
          //   Number(this.form.shengyu) + Number(this.form.ruku);
          this.$emit("saveTableCell", {
            ...this.form,
            needIncrement: this.needIncrement,
          });
          this.$message({
            message: `${this.form.name} 修改成功`,
            type: "success",
          });
          this.dialogVisible = false;
          this.needIncrement = 0;
          this.increment = 0;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.increment = 0;
      this.needIncrement = 0;
      this.$refs[formName].resetFields();
    },
    showDialog(form) {
      console.log("editdata =", form);
      this.dialogVisible = true;
      this.increment = 0;
      this.needIncrement = 0;
      this.form = form;
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
      });
      return currentData;
    },
  },
  mounted() {},
  created() {
    this.currentData = this.getCurrentData();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.shicai-container {
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
