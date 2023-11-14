<template>
  <div class="shicai-container">
    <el-dialog
      title="修改食材"
      :visible.sync="dialogVisible"
      custom-class="edit-table-class"
    >
      <el-steps :active="stepIndex" finish-status="success">
        <el-step title="选择食材"></el-step>
        <el-step title="定义食材数量"></el-step>
        <!-- <el-step title="步骤 3"></el-step> -->
      </el-steps>
      <component
        :is="componentName"
        @handleClose="handleClose"
        :currentForm="currentForm"
        :dialogType="dialogType"
      />
    </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";
import step1 from "./step1.vue";
import step2 from "./step2.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "EditTable",
  components: {
    step1,
    step2,
  },
  data() {
    return {
      assetTypeData: [],
      dialogVisible: false,
      currentForm: {},
      dialogType: "add",
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
    ...mapState(["stepIndex"]),
    componentName() {
      let map = {
        1: "step1",
        2: "step2",
      };
      return map[this.stepIndex];
    },
  },
  methods: {
    ...mapMutations(["setStepIndex"]),
    showDialog({ form, dialogType }) {
      console.log("editdata =", form);
      this.setStepIndex(1);
      this.currentForm = form;
      this.dialogType = dialogType;
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.currentForm = {};
    },
    saveData() {
      this.dialogVisible = false;
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
  },
  mounted() {},
  created() {
    this.currentData = this.getCurrentData();
    this.assetTypeData = this.currentData.assetTypeData;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.shicai-container {
  .edit-table-class {
    .el-dialog__header {
      display: none;
    }
  }
  .el-step {
    text-align: left;
  }
}
</style>
