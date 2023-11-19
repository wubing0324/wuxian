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
        <el-form-item label="售出" prop="sold">
          <el-input-number
            v-model="form.sold"
            @change="handleChange"
            :min="0"
            :max="1000"
            label="售出"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="总价" prop="allPrice">
          <el-input
            readonly=""
            type="number"
            v-model.number="form.allPrice"
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
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sold: [{ required: true, message: "请输入售出数量", trigger: "blur" }],
        allPrice: [
          { required: true, message: "请输入总售价", trigger: "blur" },
        ],
      },
      time: "",
      form: {
        name: "",
        sold: 0,
        allPrice: 0,
        time: "",
        price: 0,
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
    handleChange() {
      this.form.allPrice = this.form.price * this.form.sold;
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
          this.$emit("saveTableCell", { ...this.form });
          this.$message({
            message: `${this.form.name} 修改成功`,
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
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    showDialog(form) {
      this.dialogVisible = true;
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
      let currentData = this.getLocalData(key);
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
