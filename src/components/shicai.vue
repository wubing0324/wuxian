<template>
  <div class="food-card">
    <el-card :body-style="{ padding: '0px' }" class="box-card">
      <img
        v-show="!edit"
        src="@/assets/hanbao.jpg"
        class="top-image"
        @click="handleEdit"
      />
      <div class="edit-box" v-show="edit">
        <div class="row-item">
          <span>名称</span>
          <el-input
            size="mini"
            type="age"
            v-model="form.currentName"
            autocomplete="off"
          ></el-input>
        </div>
        <div class="row-item">
          <span>单位</span>
          <el-input
            type="age"
            size="mini"
            v-model="form.unit"
            autocomplete="off"
          ></el-input>
        </div>
        <div class="row-item">
          <span>类型</span>
          <div class="tag-box">
            <el-tag size="mini" v-for="tag in selectOptions" :key="tag.value">{{
              tag.value
            }}</el-tag>
          </div>
        </div>
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="saveCard"
            >保存</el-button
          >
          <el-button type="text" class="button" @click="deleteCard"
            >删除</el-button
          >
        </div>
      </div>
      <div v-show="!edit">
        <div class="bottom clearfix">
          <span class="bottom-title">{{ form.currentName }}</span>
          <div class="desc">
            <span>单位：{{ form.unit }}</span>
            <span>类型：{{ form.type }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
    name: {
      type: String,
      default: () => "食材名称",
    },
    type: {
      type: String,
      default: () => "其他",
    },
    selectOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      edit: false,
      form: {
        currentName: "",
        unit: "",
        type: "",
      },
    };
  },
  methods: {
    saveCard() {
      console.log("保存");
    },
    deleteCard() {
      console.log("删除");
    },
    handleEdit() {
      this.edit = !this.edit;
    },
  },
  mounted() {
    this.form.currentName = this.name;
    this.form.type = this.type;
    this.form.unit = "ml";
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.food-card {
  width: 268px;
  height: 280px;
  font-size: 14px;
  position: relative;
  .edit-box {
    position: relative;
    padding: 30px 14px 14px 14px;
  }
  .el-card {
    font-size: 14px;
    width: 100%;
    height: 100%;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .top-image {
    width: 100%;
  }
  .el-icon-edit-box {
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 0;
    font-size: 28px;
  }
  .bottom-title {
    font-size: 16px;
  }
  .desc {
    display: flex;
    justify-content: space-between;
    padding: 5px 15px;
  }
  .row-item {
    display: flex;
    span {
      font-size: 12px;
    }
  }
}
.text {
  font-size: 12px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 180px;
}
</style>
