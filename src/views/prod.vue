<template>
  <div class="prod-container">
    <div v-show="nodata">暂无数据，请先添加数据</div>
    <div class="switch-week">
      <p class="chanpin-title">产品列表</p>
      <el-button size="mini" type="primary" @click="goWuliao"
        >食材界面</el-button
      >
      <el-button size="mini" type="primary" @click="addAssets"
        >添加产品</el-button
      >
      <el-button size="mini" type="success" @click="editAssets"
        >修改产品</el-button
      >
      <el-button size="mini" type="primary" @click="exportExcel"
        >导出表格</el-button
      >
      <span class="label-span-picker">选择日期:</span>
      <el-date-picker
        size="mini"
        v-model="weekData"
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
      :date="productsDate"
      :originData="productsOriginData"
      @cellDblClick="cellDblClick"
      @handleEdit="handleEdit"
      :weeks="weeks"
      :formatDate="formatDate"
      @combine="combine"
      ref="showtable"
    ></showTable>
    <editTable-all
      ref="editTableAll"
      @updateAssets="updateAssets"
      :originData="productsOriginData"
      :date="date"
      :nowFromProps="weekData"
      @nowChange="changeWeek"
    ></editTable-all>
    <editTable
      ref="editTable"
      @updateProd="updateProd"
      :originData="productsOriginData"
    ></editTable>
    <editTableCell
      ref="editTableCell"
      @saveTableCell="saveTableCell"
    ></editTableCell>
    <showCombine ref="showCombine"></showCombine>
    <!-- 产品弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
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
        <el-form-item label="价格" prop="price">
          <el-input
            type="text"
            v-model="form.price"
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
import showTable from "@/components/ProdDuct/showTable.vue";
import showCombine from "@/components/ProdDuct/showCombine.vue";
import editTable from "@/components/ProdDuct/editTable.vue";
import editTableAll from "@/components/ProdDuct/editTableAll.vue";
import editTableCell from "@/components/ProdDuct/editTableCell.vue";
import moment from "moment";

export default {
  name: "ProductView",
  components: {
    showTable,
    editTable,
    editTableCell,
    editTableAll,
    showCombine,
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
      productsDate: {},
      productsOriginData: [],
      currentData: {},
      recipes: {},
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入单价", trigger: "blur" }],
      },
      form: {
        name: "",
        price: 0,
      },
      dealData: [],
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
      debugger;
      if (val === last_monday) {
        let startTime = moment()
          .subtract(weekOfday - 1, "days")
          .format("MM/DD");
        let endTime = moment()
          .add(7 - weekOfday, "days")
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
    combine(row) {
      this.$refs.showCombine.showDialog(row);
    },
    exportExcel() {
      this.$refs["showtable"].exportExcel();
    },
    changeWeek(val) {
      this.weeks = this.generateWeeks(val);
      let date = {};
      this.weeks.forEach((time) => {
        if (!this.productsDate[time]) {
          date[time] = {};
          this.productsOriginData.forEach((item) => {
            date[time][item.id] = [0, 0];
          });
        }
      });
      // this.productsDate = Object.assign(this.productsDate, date);
      const dates = { ...this.productsDate, ...date };
      this.$set(this, "productsDate", dates);
      this.updateDate(this.productsDate);
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
    goWuliao() {
      let key = this.$route.params.id;
      this.$router.push({ path: `/wuliao/${key}` });
    },
    updateAssets(soldInfos) {
      soldInfos.forEach((info) => {
        this.caculate(info);
      });
      this.currentData.date = this.date;
      this.currentData.productsDate = this.productsDate;
      let key = this.$route.params.id;
      this.setLocalData(key, "productsDate", this.productsDate);
      this.setLocalData(key, "date", this.date);
      this.$refs["showtable"].generateTable();
    },
    caculate({ id, sold, time, allPrice, solding }) {
      // 根据产品找出对应的食材，找到date对应的这一天的时才两并更新
      Object.keys(this.recipes[id]).forEach((assetsId) => {
        let shengyu = this.date[time][assetsId][1];
        this.date[time][assetsId][1] =
          shengyu - solding * this.recipes[id][assetsId];
        Object.keys(this.date).forEach((time1) => {
          if (moment(time1).isAfter(moment(time))) {
            let shengyu2 = this.date[time1][assetsId][1];
            this.date[time1][assetsId][1] =
              shengyu2 - solding * this.recipes[id][assetsId];
          }
        });
      });
      this.productsDate[time][id] = [sold, allPrice];
    },
    saveTableCell({ id, sold, time, allPrice }) {
      // 根据产品找出对应的食材，找到date对应的这一天的时才两并更新
      Object.keys(this.recipes[id]).forEach((assetsId) => {
        let shengyu = this.date[time][assetsId][1];
        this.date[time][assetsId][1] =
          shengyu - sold * this.recipes[id][assetsId];
        Object.keys(this.date).forEach((time1) => {
          if (moment(time1).isAfter(moment(time))) {
            let shengyu2 = this.date[time1][assetsId][1];
            this.date[time1][assetsId][1] =
              shengyu2 - sold * this.recipes[id][assetsId];
          }
        });
      });
      this.currentData.date = this.date;
      this.productsDate[time][id] = [sold, allPrice];
      this.currentData.productsDate = this.productsDate;
      let key = this.$route.params.id;
      this.setLocalData(key, "productsDate", this.productsDate);
      this.setLocalData(key, "date", this.date);
      this.$refs["showtable"].generateTable();
    },
    checkAssets() {
      this.$confirm("食材种类为空,不能添加食材", "提示", {
        confirmButtonText: "去添加食材种类",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs.AssetType.showDialog();
        })
        .catch(() => {});
    },
    cellDblClick({ column, selectedData, row, weeks }) {
      if (column.index === row.length - 1) {
        return;
      }
      // console.log("column = ", column);
      // console.log("weeks = ", weeks);
      // console.log("选中的数据 = ", row[column.index]);
      // console.log("对应的日期 = ", weeks[column.index - 1]);
      // console.log("selectedData = ", selectedData);
      let name = row[0];
      let timeKey = weeks[column.index - 2];
      if (column.index > 1 && column.index < row.length - 1) {
        let data = this.productsDate[timeKey][selectedData.id];
        this.$refs.editTableCell.showDialog({
          sold: data[0],
          allPrice: Number(data[0]) * Number(row[1]),
          time: timeKey,
          name: name,
          price: Number(row[1]),
          id: selectedData.id,
        });
      }
    },
    handleEdit({ selectedData }) {
      this.$refs.editTable.showDialog({
        form: { ...selectedData },
        dialogType: "edit",
      });
    },
    editAssets() {
      this.$refs.editTableAll.showDialog();
    },
    addAssets() {
      // this.currentData = this.getCurrentData();
      // this.dialogVisible = true;
      this.$refs.editTable.showDialog({
        form: {},
        dialogType: "add",
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    updateProd({ id, name, price, checkList, form, type }) {
      let key = this.$route.params.id;
      if (type === "add") {
        let newID = this.productsOriginData.length;
        let result = this.productsOriginData.filter(
          (item) => item.id === newID
        );
        if (result.length > 0) {
          this.$message({
            message: `类型${name}已存在`,
            type: "warning",
          });
          return;
        }
        this.productsOriginData.push({
          name: name,
          price: price,
          id: newID,
          count: 0,
          checkList: checkList,
        });
        this.$message({
          message: `产品 ${this.form.name}保存成功`,
          type: "success",
        });
        this.currentData.recipes[newID] = form;
        this.currentData.productsOriginData = this.productsOriginData;
        this.setLocalData(key, "productsOriginData", this.productsOriginData);
        this.setLocalData(key, "recipes", this.currentData.recipes);
        this.updateDate2(this.productsDate);
      } else {
        let result = this.productsOriginData.find((item) => item.id === id);
        result.name = name;
        result.price = price;
        result.checkList = checkList;
        this.currentData.recipes[id] = form;
        this.currentData.productsOriginData = this.productsOriginData;
        this.updateDate2(this.productsDate);
        this.setLocalData(key, "productsOriginData", this.productsOriginData);
        this.setLocalData(key, "recipes", this.currentData.recipes);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name } = this.form;
          let result = this.productsOriginData.filter(
            (item) => item.name === name
          );
          if (result.length > 0) {
            this.$message({
              message: `类型${this.form.name}已存在`,
              type: "warning",
            });
            return;
          }
          let id = this.productsOriginData.length;
          this.productsOriginData.push({
            name: this.form.name.replace(/\s*/g, ""),
            price: this.form.price,
            id: id,
            count: 0,
            checkList: [],
          });
          this.updateDate2(this.productsDate);
          let key = this.$route.params.id;
          this.currentData.productsOriginData = this.productsOriginData;
          this.setLocalData(key, "productsOriginData", this.productsOriginData);
          this.$message({
            message: `产品 ${this.form.name}保存成功`,
            type: "success",
          });
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key);
      return currentData;
    },
    generateWeeks2() {
      let weeks = [];
      let weekOfday = moment().format("E"); //计算今天是这周第几天
      let last_monday = moment()
        .startOf()
        .subtract(weekOfday - 1, "days")
        .format("YYYY/MM/DD"); //周一日期
      for (let i = 0; i < 7; i++) {
        weeks.push(moment(last_monday).add(i, "days").format("YYYY/MM/DD"));
      }
      return weeks;
    },
    updateDate() {
      this.currentData.productsDate = this.productsDate;
      let key = this.$route.params.id;
      this.setLocalData(key, "productsDate", this.productsDate);
    },
    updateDate2(date) {
      this.weeks.forEach((time) => {
        if (this.productsOriginData.length > 0) {
          if (!date[time]) {
            date[time] = {};
          }
          this.productsOriginData.forEach((item) => {
            if (!date[time][item.id]) {
              date[time][item.id] = [0, 0];
            }
          });
        }
      });
      this.currentData.productsDate = date;
      this.productsDate = date;
      let key = this.$route.params.id;
      this.setLocalData(key, "productsDate", this.productsDate);
    },
  },
  created() {
    this.currentData = this.getCurrentData();
    this.productsOriginData = this.currentData.productsOriginData;
    this.productsDate = this.currentData.productsDate;
    this.recipes = this.currentData.recipes;
    this.date = this.currentData.date;
    this.changeWeek();
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.prod-container {
  .switch-week {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: end;
    position: sticky;
    top: 0;
    z-index: 100;
    padding-right: 2px;
    background: #3d6170;
    font-size: 14px;
    .chanpin-title {
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
