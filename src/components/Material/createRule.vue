<template>
  <div class="create-rule">
    <el-dialog
      width="50vw"
      title="添加规则"
      :visible.sync="dialogVisible"
      custom-class="edit-table-class"
    >
      <el-form
        size="mini"
        :model="dyForm"
        ref="dyForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-row v-for="(domain, index) in dyForm.assetRules" :key="domain.key">
          <el-col :span="6">
            <el-form-item
              :label="'减少' + index"
              :prop="'assetRules.' + index + '.decrease'"
              :rules="{
                required: true,
                message: '食材不能为空',
                trigger: 'blur',
              }"
            >
              <el-cascader
                expand-trigger="hover"
                :options="selectOptions"
                v-model="domain.decrease"
                @change="handleChange"
                filterable
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :label="'增加' + index"
              :prop="'assetRules.' + index + '.increase'"
              :rules="{
                required: true,
                message: '食材不能为空',
                trigger: 'blur',
              }"
            >
              <el-cascader
                expand-trigger="hover"
                :options="selectOptions"
                v-model="domain.increase"
                @change="handleChange"
                filterable
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-button size="mini" @click.prevent="removeDomain(domain)"
            >删除</el-button
          >
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dyForm')" size="mini"
            >提交</el-button
          >
          <el-button size="mini" @click="addDomain">新增</el-button>
          <el-button size="mini" @click="resetForm('dyForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CreateRule",
  components: {},
  data() {
    return {
      dialogVisible: false,
      dyForm: {
        assetRules: [
          {
            decrease: "",
            increase: "",
          },
        ],
      },
      selectOptions: [],
      assetRules: [],
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
  },
  watch: {},
  methods: {
    handleChange(value) {
      console.log(value);
    },
    getDataByType(type) {
      return this.originData.filter((data) => data.type === type);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dyForm);
          let key = this.$route.params.id;
          this.currentData.assetRules = [
            ...this.assetRules,
            ...this.dyForm.assetRules,
          ];
          this.setLocalData(key, "assetRules", this.currentData.assetRules);
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
    removeDomain(item) {
      var index = this.dyForm.assetRules.indexOf(item);
      if (index !== -1) {
        this.dyForm.assetRules.splice(index, 1);
      }
    },
    addDomain() {
      this.dyForm.assetRules.push({
        decrease: "",
        increase: "",
      });
    },
    showDialog() {
      this.selectOptions = this.getSelectOptions();
      this.currentData = this.getCurrentData();
      this.assetRules = this.currentData.assetRules;
      this.dyForm.assetRules = this.currentData.assetRules;
      this.dialogVisible = true;
    },
    getCurrentData() {
      let key = this.$route.params.id;
      let currentData = this.getLocalData(key);
      return currentData;
    },
    setDate() {
      this.currentData.date = this.date;
      let key = this.$route.params.id;
      this.setLocalData(key, "date", this.date);
    },
    getSelectOptions() {
      let columns = this.types.map((type) => {
        return {
          value: type,
          label: type,
          children: this.originData
            .filter((item) => item.type === type)
            .map((data) => {
              return {
                value: data.id,
                label: data.name,
              };
            }),
        };
      });
      console.log(columns);
      return columns;
    },
  },
  mounted() {},
  created() {
    this.currentData = this.getCurrentData();
    this.date = this.currentData.date;
    this.selectOptions = this.getSelectOptions();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.create-rule {
  .edit-table-class {
  }
  .re {
    color: red;
  }
}
</style>
