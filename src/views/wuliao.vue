<template>
  <div class="wuliao-container">
    <div v-show="nodata">暂无数据，请先添加数据</div>
    <showTable
      :originData="originData"
      :date="date"
      @cellDblClick="cellDblClick"
      ref="showtable"
    ></showTable>
    <editTable ref="editTable" :originData="originData"></editTable>
    <editTableCell
      ref="editTableCell"
      @saveTableCell="saveTableCell"
    ></editTableCell>
    <!-- 食材弹窗 -->
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
        <el-form-item label="单位" prop="unit">
          <el-input
            type="text"
            v-model="form.unit"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="type">
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
    <el-button type="primary" @click="goProd">产品</el-button>
    <el-button type="primary" @click="addAssets">添加食材</el-button>
    <el-button type="success" @click="editAssets">修改食材</el-button>
    <el-button type="success" @click="addAssetType">添加种类</el-button>
  </div>
</template>

<script>
import showTable from "@/components/Material/showTable.vue";
import editTable from "@/components/Material/editTable.vue";
import editTableCell from "@/components/Material/editTableCell.vue";
import AssetType from "@/components/AssetType.vue";
import moment from "moment";

export default {
  name: "WuLiao",
  components: {
    showTable,
    AssetType,
    editTable,
    editTableCell,
  },
  data() {
    return {
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
  },
  props: {},
  methods: {
    goProd() {
      let type = this.$route.params.id;
      this.$router.push({ path: `/prod/${type}` });
    },
    saveTableCell({ ruku, shengyu, name, time, needIncrement }) {
      let prev = this.date[time][name];
      if (prev[0] == ruku && prev[1] == shengyu) {
        return;
      } else {
        this.date[time][name] = [ruku, shengyu];
        this.currentData.date = this.date;
        let key = this.$route.params.id;
        let result = this.originData.find((item) => item.name === name);
        console.log("result = ", result);
        // result.count = result.count + ruku;
        localStorage.setItem(key, JSON.stringify(this.currentData));
        this.$refs["showtable"].generateTable();
        Object.keys(this.date).forEach((time1) => {
          if (moment(time1).isAfter(moment(time))) {
            let data = this.date[time1][name];
            data[1] = Number(data[1]) + needIncrement;
          }
        });
      }
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
      let name = row[0].split(" ")[0];
      let timeKey = weeks[column.index - 1];
      if (column.index > 0 && column.index < row.length - 1) {
        let data = this.date[timeKey][name];
        this.$refs.editTableCell.showDialog({
          ruku: data[0],
          shengyu: data[1],
          time: timeKey,
          name: name,
        });
      } else {
        this.$refs.editTable.showDialog({
          form: { ...selectedData },
        });
      }
    },
    editAssets() {
      this.$refs.editTable.showDialog();
    },
    addAssetType() {
      this.$refs.AssetType.showDialog();
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
          if (result.length > 0) {
            this.$message({
              message: `类型${this.form.name}已存在`,
              type: "warning",
            });
            return;
          }
          let id = this.originData.length;
          this.originData.push({
            name: this.form.name.replace(/\s*/g, ""),
            type: this.form.type,
            unit: this.form.unit,
            count: 0,
            id: id,
          });
          this.updateDate(this.date);
          // this.generateColumns();
          let key = this.$route.params.id;
          this.currentData.originData = this.originData;
          localStorage.setItem(key, JSON.stringify(this.currentData));
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
    generateWeeks() {
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
    updateDate(date) {
      let weeks = this.generateWeeks();
      weeks.forEach((time) => {
        if (this.originData.length > 0) {
          if (!date[time]) {
            date[time] = {};
          }
          this.originData.forEach((item) => {
            if (!date[time][item.name]) {
              date[time][item.name] = [0, 0];
            }
          });
        }
      });
      this.currentData.date = date;
      this.date = date;
      let key = this.$route.params.id;
      localStorage.setItem(key, JSON.stringify(this.currentData));
    },
  },
  created() {
    this.currentData = this.getCurrentData();
    this.originData = this.currentData.originData;
    this.assetTypeData = this.currentData.assetTypeData;
    this.date = this.currentData.date;
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.all-card-boxs {
  .p-title {
    font-size: 18px;
    font-weight: 500;
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    .food-card {
      margin-right: 5px;
    }
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
