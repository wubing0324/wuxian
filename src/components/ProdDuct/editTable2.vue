<template>
  <div class="shicai-container">
    <el-dialog
      width="50vw"
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
        <div class="part-asset">
          <el-form-item
            v-for="data in originData"
            :label="`(${oldFormCopy[data.id]})-${data.name}`"
            :title="data.name"
            :prop="data.id + ''"
            :key="data.id + data.name"
            :rules="[{ required: true, message: '不能为空' }]"
          >
            <el-input-number v-model="form[data.id]"></el-input-number>
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
      assetRules: [],
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
      disables: [],
      priceMap: {},
    };
  },
  props: {
    msg: String,
    originData: {
      type: Array,
      default: () => [],
    },
    nowFromProps: {
      type: String,
      default: () => moment().format("YYYY/MM/DD"),
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
  watch: {
    nowFromProps(val) {
      const weekOfday = moment().format("E");
      let last_monday = moment()
        .subtract(weekOfday - 2, "days")
        .format("YYYY/MM/DD");
      if (val === last_monday) {
        this.now = moment().format("YYYY/MM/DD");
      } else {
        this.now = val;
      }
    },
  },
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
    /**
     * @name wubing
     * @Date 2023-11-17 11:19:01
     * @description 通过食材id查找这个食材属不属于decrease,属于的话说明这个食材的减少需要影响规则中对应食材的增量
     * @param {参数类型} 参数 参数说明
     * @return {返回类型说明} 当前食材在规则中的对应关系
     */
    getDecreaseById(assetRules, id, afters) {
      let result = assetRules.find((data) => {
        return data.decrease[1] + "" === id + "";
      });
      if (result) {
        let addNum = this.date[this.now][result.increase[1]];
        // 修改当前入库量
        this.date[this.now][result.increase[1]][0] =
          Number(addNum[0]) - Number(this.form[id]);
        // if (
        //   Object.prototype.hasOwnProperty.call(this.oldForm, result.decrease[1])
        // ) {
        //   this.oldForm[result.decrease[1]] =
        //     this.date[this.now][result.decrease[1]][0];
        // }
        afters.forEach((after) => {
          // 修改当前时间以及之后的所有剩余量
          let addNum1 = this.date[after][result.increase[1]];
          this.date[after][result.increase[1]][1] =
            Number(addNum1[1]) - Number(this.form[id]);
        });
      }
    },
    /**
     * @name wubing
     * @Date 2023-11-17 11:19:01
     * @description 通过食材id查找这个食材属不属于increase,属于的话说明这个食材的增加需要影响规则中对应食材的减少
     * @param {参数类型} 参数 参数说明
     * @return {返回类型说明} 当前食材在规则中的对应关系
     */
    getIncreaseById(assetRules, id, afters) {
      let result = assetRules.find((data) => {
        return data.increase[1] + "" === id + "";
      });
      if (result) {
        let addNum = this.date[this.now][result.decrease[1]];
        // 修改当前入库量
        this.date[this.now][result.decrease[1]][0] =
          Number(addNum[0]) - Number(this.form[id]);
        if (
          Object.prototype.hasOwnProperty.call(this.oldForm, result.decrease[1])
        ) {
          this.oldForm[result.decrease[1]] =
            this.date[this.now][result.decrease[1]][0];
        }
        afters.forEach((after) => {
          // 修改当前时间以及之后的所有剩余量
          let addNum1 = this.date[after][result.decrease[1]];
          this.date[after][result.decrease[1]][1] =
            Number(addNum1[1]) - Number(this.form[id]);
        });
      }
      debugger;
      return result;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          Object.keys(this.form).forEach((id) => {
            // this.form[id]为0 说明没有被修改过，预处理中的内容是无法修改的，只能通过处理和售出产品变化
            if (this.form[id] + "" === "0") return;
            this.productsDate[this.now][id][0] = Number(this.oldFormCopy[id]);
            this.productsDate[this.now][id][1] = Number(this.oldFormCopy[id]);
          });
          let soldInfo = Object.keys(this.form).map((id) => {
            return {
              id,
              sold: Number(this.oldFormCopy[id]),
              time: this.now,
              allPrice: this.priceMap[id] * Number(this.oldFormCopy[id]),
            };
          });
          // this.setDate();
          this.$emit("updateAssets", soldInfo);
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
    showDialog() {
      this.currentData = this.getCurrentData();
      this.productsDate = this.currentData.productsDate;
      this.assetRules = this.currentData.assetRules;
      this.disables = this.assetRules.map((data) => data.increase[0]);
      this.getFormInfoByTime();
      this.originData.forEach((data) => {
        this.priceMap[data.id] = Number(data.price);
      });
      this.dialogVisible = true;
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key);
      return currentData;
    },
    getFormInfoByTime() {
      if (!this.productsDate[this.now]) {
        this.productsDate[this.now] = {};
        this.originData.forEach((item) => {
          this.productsDate[this.now][item.id] = [0, 0];
        });
      }
      Object.keys(this.productsDate[this.now]).forEach((id) => {
        if (
          this.productsDate[this.now] &&
          Object.prototype.hasOwnProperty.call(this.productsDate[this.now], id)
        ) {
          this.$set(this.oldForm, id, this.productsDate[this.now][id][0]);
          this.$set(this.form, id, 0);
        }
      });
    },
    setDate() {
      this.currentData.productsDate = this.productsDate;
      let key = this.$route.params.id;
      this.setLocalData(key, "productsDate", this.productsDate);
    },
  },
  mounted() {},
  created() {
    this.currentData = this.getCurrentData();
    this.productsDate = this.currentData.productsDate;
    this.assetRules = this.currentData.assetRules;
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
      .el-form-item {
        width: 200px;
      }
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
