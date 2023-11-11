<template>
  <div class="shicai-container">
    <div class="card-box">
      <shicai
        class="shicai-card"
        v-for="(item, index) in assetsData"
        :name="item.name"
        :key="item.type"
        :index="index"
        @deleteData="deleteData(item, index)"
      ></shicai>
    </div>
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

export default {
  name: "HelloWorld",
  components: {
    shicai,
    AssetType,
  },
  data() {
    return {
      assetsData: [],
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
  watch: {
    $route: {
      handler: function (val) {
        let key = val.params.id;
        let data = localStorage.getItem(key);
        if (!data) {
          localStorage.setItem(key, JSON.stringify([]));
        }
      },
      immediate: true,
    },
  },
  computed: {
    transTitle() {
      return ["", ...this.weeks];
    },
    currentName() {
      return this.$route.params.id;
    },
    cacheData() {
      let key = this.$route.params.id;
      let data = localStorage.getItem(key);
      return data;
    },
  },
  props: {
    msg: String,
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name, type } = this.form;
          let result = this.assetsData.filter(
            (item) => item.name === name && item.type === type
          );
          if (result.length > 0) {
            this.$message({
              message: `类型${this.form.name}已存在`,
              type: "warning",
            });
            return;
          }
          this.assetsData.push({
            name: this.form.name,
            type: this.form.type,
            unit: this.form.unit,
            count: 0,
          });
          localStorage.setItem("assetsData", JSON.stringify(this.assetsData));
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
    this.assetsData = this.getLocalData("assetsData", []);
    this.assetTypeData = this.getLocalData("assetTypeData", []);
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
