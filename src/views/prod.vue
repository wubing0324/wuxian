<template>
  <div class="wuliao-container">
    <div v-show="nodata">暂无数据，请先添加数据</div>
    <showTable
      :date="productsDate"
      :originData="productsOriginData"
      @cellDblClick="cellDblClick"
      ref="showtable"
    ></showTable>
    <editTable
      ref="editTable"
      @updateProd="updateProd"
      :originData="productsOriginData"
    ></editTable>
    <editTableCell
      ref="editTableCell"
      @saveTableCell="saveTableCell"
    ></editTableCell>
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
    <addProduct ref="addProduct"></addProduct>
    <el-button type="primary" @click="goWuliao">食材界面</el-button>
    <el-button type="primary" @click="addAssets">添加产品</el-button>
    <el-button type="primary" @click="addAssets2">添加产品22</el-button>
    <el-button type="success" @click="editAssets">修改产品</el-button>
  </div>
</template>

<script>
import showTable from "@/components/ProdDuct/showTable.vue";
import editTable from "@/components/ProdDuct/editTable.vue";
import addProduct from "@/components/ProdDuct/addProduct.vue";
import editTableCell from "@/components/ProdDuct/editTableCell.vue";
import moment from "moment";

export default {
  name: "ProductView",
  components: {
    showTable,
    editTable,
    editTableCell,
    addProduct,
  },
  data() {
    return {
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
  },
  props: {},
  methods: {
    goWuliao(type) {
      this.$router.push({ path: `/wuliao/${type}` });
    },
    saveTableCell({ sold, name, time, allPrice }) {
      Object.keys(this.recipes[name]).forEach((assetsName) => {
        let shengyu = this.date[time][assetsName][1];
        this.date[time][assetsName][1] =
          shengyu - sold * this.recipes[name][assetsName];
        Object.keys(this.date).forEach((time1) => {
          if (moment(time1).isAfter(moment(time))) {
            let shengyu2 = this.date[time1][assetsName][1];
            this.date[time1][assetsName][1] =
              shengyu2 - sold * this.recipes[name][assetsName];
          }
        });
      });
      this.currentData.date = this.date;
      this.productsDate[time][name] = [sold, allPrice];
      this.currentData.productsDate = this.productsDate;
      let key = this.$route.params.id;
      localStorage.setItem(key, JSON.stringify(this.currentData));
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
        let data = this.productsDate[timeKey][name];
        console.log(data);
        this.$refs.editTableCell.showDialog({
          sold: data[0],
          allPrice: Number(data[0]) * Number(row[1]),
          time: timeKey,
          name: name,
          price: Number(row[1]),
        });
      } else {
        this.$refs.editTable.showDialog({
          form: { ...selectedData },
          dialogType: "edit",
        });
      }
    },
    editAssets() {
      this.$refs.editTable.showDialog();
    },
    addAssets() {
      // this.currentData = this.getCurrentData();
      // this.dialogVisible = true;
      this.$refs.editTable.showDialog({
        form: {},
        dialogType: "add",
      });
    },
    addAssets2() {
      this.$refs["addProduct"].showDialog();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    updateProd({ id, name, price, checkList, form, type }) {
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
        this.currentData.recipes[name] = form;
        this.currentData.productsOriginData = this.productsOriginData;
        this.updateDate(this.productsDate);
      } else {
        let result = this.productsOriginData.find((item) => item.id === id);
        if (!result) {
          this.$message({
            message: `类型${name}已存在`,
            type: "warning",
          });
          return;
        }
        result.name = name;
        result.price = price;
        result.checkList = checkList;
        this.currentData.recipes[name] = form;
        this.currentData.productsOriginData = this.productsOriginData;
        this.updateDate(this.productsDate);
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
          this.updateDate(this.productsDate);
          let key = this.$route.params.id;
          this.currentData.productsOriginData = this.productsOriginData;
          localStorage.setItem(key, JSON.stringify(this.currentData));
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
        if (this.productsOriginData.length > 0) {
          if (!date[time]) {
            date[time] = {};
          }
          this.productsOriginData.forEach((item) => {
            if (!date[time][item.name]) {
              date[time][item.name] = [0, 0];
            }
          });
        }
      });
      this.currentData.productsDate = date;
      this.productsDate = date;
      let key = this.$route.params.id;
      debugger;
      localStorage.setItem(key, JSON.stringify(this.currentData));
    },
  },
  created() {
    this.currentData = this.getCurrentData();
    this.productsOriginData = this.currentData.productsOriginData;
    this.productsDate = this.currentData.productsDate;
    this.recipes = this.currentData.recipes;
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
