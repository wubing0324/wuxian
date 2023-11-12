<template>
  <div class="shicai-container">
    <div class="card-box">
      <shicai
        class="shicai-card"
        v-for="(item, index) in originData"
        :name="item.name"
        :key="item.type"
        :unit="item.unit"
        :index="index"
        @deleteData="deleteData(item, index)"
      ></shicai>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        :label="column"
        v-for="(column, index) in transTitle"
        :key="column + index"
      >
        <el-table-column :label="getTitle(index)">
          <template slot-scope="scope">
            {{ scope.row[index] }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 食材弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
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
        <el-form-item label="活动区域" prop="type">
          <el-select v-model="form.type" placeholder="请选择活动区域">
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
    <el-button type="primary" @click="addAssets">添加食材</el-button>
    <el-button type="success" @click="addAssetType">添加种类</el-button>
  </div>
</template>

<script>
// import moment from "moment";
import shicai from "@/components/shicai.vue";
import AssetType from "@/components/AssetType.vue";
import moment from "moment";

export default {
  name: "HelloWorld",
  components: {
    shicai,
    AssetType,
  },
  data() {
    return {
      columns: [],
      tableData: [],
      weeks: [],
      originData: [],
      dealData: [],
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
      assetTypeData: [],
      dialogVisible: false,
    };
  },
  props: {
    msg: String,
  },
  computed: {
    transTitle() {
      return ["", "", ...this.weeks];
    },
  },
  methods: {
    getTitle(index) {
      let title = "入库/剩余";
      if (index === 0) {
        title = "品类";
      } else if (index === 1) {
        title = "食材名称";
      } else {
        title = "入库/剩余";
      }
      return title;
    },
    generateWeeks() {
      let weeks = [];
      let mapWeek = {
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
        7: "周日",
      };
      var weekOfday = moment().format("E"); //计算今天是这周第几天
      for (let i = 6; i >= 0; i--) {
        weeks.push(
          moment()
            .add(weekOfday - 1 - i, "days")
            .format("YYYY/MM/DD") +
            "/" +
            mapWeek[7 - i]
        );
      }
      return weeks;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    generateColumns() {
      let data = [];
      let columns = [];
      data = new Set(this.originData.map((item) => item.type));
      data = [...data];
      columns = data.map((type) => {
        return {
          name: type,
          children: this.originData
            .filter((item) => item.type === type)
            .map((data) => {
              return {
                name: `${data.name} (单位/${data.unit})`,
              };
            }),
        };
      });
      this.columns = columns
        .map((col) => {
          return col.children.map((item) => [col.name, item.name]);
        })
        .flat();
      console.log("columns = ", this.columns);
    },
    generateTable() {
      let types = new Set(this.originData.map((item) => item.type));
      types = [...types];
      let columns = types.map((type) => {
        return this.originData.filter((item) => item.type === type);
      });
      console.log("odata = ", columns);
      let matrixData = columns.flat().map((row) => {
        let arr = [];
        for (let key in row) {
          arr.push(row[key]);
        }
        return arr;
      });
      let dateValue = [
        [12, 60],
        [13, 61],
        [13, 61],
        [13, 61],
        [13, 61],
        [13, 61],
        [13, 61],
      ];
      this.tableData = matrixData.map((col, i) => {
        console.log([this.columns[i], ...col]);
        return [
          ...this.columns[i],
          ...dateValue.map((item) => item[0] + "/" + item[1]),
        ];
      });
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
          this.originData.push({
            name: this.form.name,
            type: this.form.type,
            unit: this.form.unit,
            count: 0,
          });
          this.generateColumns();
          this.generateTable();
          localStorage.setItem("originData", JSON.stringify(this.originData));
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
    addAssetType() {
      this.$refs.AssetType.showDialog();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    deleteData(data, index) {
      data.splice(index, 1);
    },
    addAssets() {
      this.assetTypeData = this.getLocalData("assetTypeData", []);
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
  },
  mounted() {},
  created() {
    this.originData = this.getLocalData("originData", []);
    if (this.originData.length > 0) {
      this.generateColumns();
      this.generateTable();
    }
    this.assetTypeData = this.getLocalData("assetTypeData", []);
    this.weeks = this.generateWeeks();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.shicai-container {
  .p-title {
    font-size: 18px;
    font-weight: 500;
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    .shicai-card {
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
