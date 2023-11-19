<template>
  <div class="shicai-container">
    <el-dialog
      :title="'修改食材' + dialogType"
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
        @updateProd="updateProd"
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
      this.setStepIndex(1);
      if (dialogType === "edit") {
        this.currentForm = form;
      } else {
        this.currentForm = {};
      }
      this.dialogType = dialogType;
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.currentForm = {};
    },
    updateProd(data) {
      this.$emit("updateProd", data);
    },
  },
  mounted() {},
  created() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.shicai-container {
  .edit-table-class {
    .el-dialog__header {
      // display: none;
    }
  }
  .el-step {
    text-align: left;
  }
}
</style>
