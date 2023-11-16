<template>
  <div class="shicai-container">
    <el-dialog
      width="70vw"
      title="修改食材"
      :visible.sync="dialogVisible"
      custom-class="edit-table-class"
    >
      <el-date-picker
        v-model="now"
        type="date"
        :picker-options="pickerOptions"
        placeholder="选择日期"
        value-format="yyyy/MM/dd"
        @change="getFormInfoByTime"
      >
      </el-date-picker>
      <el-form
        size="mini"
        :model="form"
        ref="form"
        label-width="160px"
        class="demo-ruleForm"
      >
        <div v-for="type in types" :key="type">
          <p>{{ type }}</p>
          <div class="part-asset">
            <el-form-item
              :label="`(${oldFormCopy[data.name]})-${data.name}`"
              :title="data.name"
              :prop="data.name"
              v-for="data in getDataByType(type)"
              :key="data.name"
              :rules="[{ required: true, message: '不能为空' }]"
            >
              <el-input-number v-model="form[data.name]"></el-input-number>
            </el-form-item>
            <el-form-item
              v-for="i in 10"
              style="
                 {
                  height: 0;
                }
              "
              :key="i"
            ></el-form-item>
          </div>
        </div>
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
import { mapState } from "vuex";

export default {
  name: "EditTable",
  components: {},
  data() {
    return {
      now: moment().format("YYYY/MM/DD"),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      list: [],
      dialogVisible: false,
      form: {},
      oldForm: {},
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
    ...mapState(["types"]),
    oldFormCopy() {
      let form = {};
      Object.keys(this.oldForm).forEach((name) => {
        form[name] = this.oldForm[name] + this.form[name];
      });
      return form;
    },
  },
  watch: {},
  methods: {
    getDataByType(type) {
      return this.originData.filter((data) => data.type === type);
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
          this.dialogVisible = false;
          // 找出今天以后的日期，更新剩余数量
          let afters = Object.keys(this.date).filter((time) =>
            moment(time).isAfter(moment(this.now))
          );
          console.log("afters = ", afters);
          Object.keys(this.form).forEach((name) => {
            // this.date[this.now][name][0] = Number(this.form[name]);
            this.date[this.now][name][0] = Number(this.oldFormCopy[name]);
            this.date[this.now][name][1] =
              Number(this.form[name]) + this.date[this.now][name][1];
            afters.forEach((after) => {
              this.date[after][name][1] =
                Number(this.form[name]) + this.date[after][name][1];
            });
          });
          this.setDate();
          this.$emit("updateAssets", this.date);
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
      this.getFormInfoByTime();
      this.dialogVisible = true;
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key);
      return currentData;
    },
    getFormInfoByTime() {
      if (!this.date[this.now]) {
        this.date[this.now] = {};
        this.originData.forEach((item) => {
          this.date[this.now][item.name] = [0, 0];
        });
      }
      Object.keys(this.date[this.now]).forEach((name) => {
        if (
          this.date[this.now] &&
          Object.prototype.hasOwnProperty.call(this.date[this.now], name)
        ) {
          this.$set(this.oldForm, name, this.date[this.now][name][0]);
          this.$set(this.form, name, 0);
        }
      });
    },
    setDate() {
      this.currentData.date = this.date;
      let key = this.$route.params.id;
      localStorage.setItem(key, JSON.stringify(this.currentData));
    },
  },
  mounted() {},
  created() {
    this.currentData = this.getCurrentData();
    this.date = this.currentData.date;
    this.getFormInfoByTime();
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
    .part-asset {
      width: 86%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      .el-form-item__content {
        width: 70px;
      }
      .el-form-item__label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
