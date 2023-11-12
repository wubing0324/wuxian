<template>
  <div class="wuliao-container">
    {{ $route.params.id }}
    <div v-show="nodata">暂无数据，请先添加数据</div>
    <showTable :originData="originData" :date="date"></showTable>
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
import showTable from "@/components/Material/showTable.vue";
import AssetType from "@/components/AssetType.vue";
import moment from "moment";

export default {
  name: "WuLiao",
  components: {
    showTable,
    AssetType,
  },
  data() {
    return {
      date: [],
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
          this.originData.push({
            name: this.form.name,
            type: this.form.type,
            unit: this.form.unit,
            count: 0,
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
        date: {},
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
      debugger;
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
