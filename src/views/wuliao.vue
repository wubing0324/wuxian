<template>
  <div class="wuliao-container">
    <div v-show="nodata">暂无数据，请先添加数据</div>
    <div class="switch-week">
      <p class="shicai-title">食材列表</p>
      <el-button size="mini" type="primary" @click="goProd">产品界面</el-button>
      <el-button size="mini" type="primary" @click="addAssets"
        >添加食材</el-button
      >
      <el-button size="mini" type="success" @click="editAssets"
        >修改食材</el-button
      >
      <el-button size="mini" type="success" @click="addAssetType"
        >添加食材种类</el-button
      >
      <el-button size="mini" type="success" @click="addRule"
        >添加食材之间规则</el-button
      >
      <el-button size="mini" type="primary" @click="exportExcel"
        >导出表格</el-button
      >
      <span class="label-span-picker">选择日期:</span>
      <el-date-picker
        v-model="weekData"
        size="mini"
        type="week"
        :format="formatDate"
        placeholder="选择周"
        :picker-options="pickerOptions"
        value-format="yyyy/MM/dd"
        @change="changeWeek"
      >
      </el-date-picker>
    </div>
    <showTable
      :originData="originData"
      :date="date"
      :weeks="weeks"
      :formatDate="formatDate"
      ref="showtable"
    ></showTable>
    <editTable
      ref="editTable"
      @updateAssets="updateAssets"
      :originData="originData"
      :date="date"
      :nowFromProps="weekData"
      @nowChange="changeWeek"
    ></editTable>
    <createRule ref="createRule" :originData="originData"></createRule>
    <!-- 食材弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form
        size="mini"
        :rules="rules"
        :model="form"
        ref="form"
        label-width="160px"
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
        <el-form-item label="食材种类" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
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
    <AssetType ref="AssetType"></AssetType>
  </div>
</template>

<script>
import showTable from "@/components/Material/showTable.vue";
import editTable from "@/components/Material/editTable.vue";
import createRule from "@/components/Material/createRule.vue";
import AssetType from "@/components/AssetType.vue";
import moment from "moment";
export default {
  name: "WuLiao",
  components: {
    showTable,
    AssetType,
    editTable,
    createRule,
  },
  data() {
    return {
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      weeks: [],
      weekData: moment().format("YYYY/MM/DD"),
      date: {},
      originData: [],
      currentData: {},
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
      dealData: [],
      assetTypeData: [],
      dialogVisible: false,
    };
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
  computed: {
    nodata() {
      let data = Object.keys(this.currentData);
      return data.length === 0;
    },
    formatDate() {
      let val = moment(this.weekData).format("MM/DD");
      const weekOfday = moment().format("E");
      let last_monday = moment().format("MM/DD");
      if (val === last_monday) {
        let startTime = moment()
          .subtract(weekOfday - 1, "days")
          .format("MM/DD");
        let endTime = moment()
          .subtract(7 - weekOfday, "days")
          .format("MM/DD");
        return `${startTime} 至 ${endTime}`;
      } else {
        let startTime = moment(this.weekData)
          .subtract(1, "days")
          .format("MM/DD");
        let endTime = moment(this.weekData).add(5, "days").format("MM/DD");
        return `${startTime} 至 ${endTime}`;
      }
    },
  },
  props: {},
  methods: {
    exportExcel() {
      this.$refs["showtable"].exportExcel();
    },
    changeWeek(val) {
      this.weeks = this.generateWeeks(val);
      let date = {};
      this.weeks.forEach((time) => {
        if (!this.date[time]) {
          date[time] = {};
          this.originData.forEach((item) => {
            date[time][item.id] = [0, 0];
          });
        }
      });
      this.date = Object.assign(this.date, date);
      const dates = { ...this.date, ...date };
      this.$set(this, "date", dates);
      this.updateDate(this.date);
      // this.$refs["showtable"].generateTable();
    },
    generateWeeks(val) {
      let weeks = [];
      let weekOfday = val ? moment(val).format("E") : moment().format("E"); //计算今天是这周第几天
      let last_monday = (val ? moment(val) : moment())
        .startOf()
        .subtract(weekOfday - 1, "days")
        .format("YYYY/MM/DD"); //周一日期
      for (let i = 0; i < 7; i++) {
        weeks.push(moment(last_monday).add(i, "days").format("YYYY/MM/DD"));
      }
      return weeks;
    },
    goProd() {
      let type = this.$route.params.id;
      this.$router.push({ path: `/prod/${type}` });
    },
    editAssets() {
      this.$refs.editTable.showDialog();
    },
    addAssetType() {
      this.$refs.AssetType.showDialog();
    },
    addRule() {
      this.$refs.createRule.showDialog();
    },
    deleteData(data, index) {
      data.splice(index, 1);
    },
    addAssets() {
      this.currentData = this.getCurrentData();
      this.assetTypeData = this.currentData.assetTypeData;
      if (this.assetTypeData.length === 0) {
        this.$confirm("食材种类为空,不能添加食材", "提示", {
          confirmButtonText: "去添加食材种类",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$refs.AssetType.showDialog();
          })
          .catch(() => {});
      } else {
        this.dialogVisible = true;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name, type } = this.form;
          let result = this.originData.filter(
            (item) => item.name === name && item.type === type
          );
          let id = this.originData.length;
          if (result.length > 0) {
            this.$message({
              message: `${this.form.name}已存在`,
              type: "warning",
            });
            return;
          } else {
            this.originData.push({
              name: this.form.name.replace(/\s*/g, ""),
              type: this.form.type,
              unit: this.form.unit,
              count: 0,
              id: id,
            });
            this.updateDate2(this.date);
            // this.generateColumns();
            let key = this.$route.params.id;
            this.currentData.originData = this.originData;
            this.setLocalData(key, "originData", this.originData);
            this.$message({
              message: `类型${this.form.name}保存成功`,
              type: "success",
            });
            this.dialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key, {
        originData: [],
        productsOriginData: [],
        date: {},
        productsDate: {},
        assetTypeData: [],
      });
      return currentData;
    },
    updateDate() {
      this.currentData.date = this.date;
      let key = this.$route.params.id;
      this.setLocalData(key, "date", this.date);
    },
    updateDate2(date) {
      this.weeks.forEach((time) => {
        if (this.originData.length > 0) {
          if (!date[time]) {
            date[time] = {};
          }
          this.originData.forEach((item) => {
            if (!date[time][item.id]) {
              date[time][item.id] = [0, 0];
            }
          });
        }
      });
      this.currentData.date = date;
      this.date = date;
      let key = this.$route.params.id;
      this.setLocalData(key, "date", this.date);
    },
    updateAssets(date) {
      this.date = date;
      this.$refs["showtable"].generateTable();
    },
  },
  created() {
    this.currentData = this.getCurrentData();
    this.originData = this.currentData.originData;
    this.assetTypeData = this.currentData.assetTypeData;
    this.date = this.currentData.date;
    this.changeWeek();
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.wuliao-container {
  .el-select {
    width: 100%;
  }
  .switch-week {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: end;
    position: sticky;
    top: 0;
    z-index: 10000;
    padding-right: 2px;
    background: #3d6170;
    font-size: 14px;
    .shicai-title {
      color: #fff;
      position: absolute;
      left: 20px;
      font-size: 18px;
    }
    .label-span-picker {
      margin: 0 10px;
      color: #fff;
    }
  }
}
</style>
