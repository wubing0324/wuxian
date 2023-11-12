<template>
  <div class="food-card">
    <el-card :body-style="{ padding: '0px' }" class="box-card">
      <!-- <img
        v-show="!edit"
        src="@/assets/hanbao.jpg"
        class="top-image"
        @click="handleEdit"
      /> -->
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
          <span
            class="bottom-title"
            :class="{ 'small-size': form.currentName.length > 20 }"
            >{{ form.currentName }}</span
          >
          {{ form.count }}
          <div class="desc">
            <el-input
              size="mini"
              v-model.number="form.count"
              placeholder="请输入内容"
            ></el-input>
            <span>{{ form.unit }}</span>
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
      default: () => "",
    },
    type: {
      type: String,
      default: () => "其他",
    },
    unit: {
      type: String,
      default: () => "ml",
    },
    selectOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      edit: true,
      form: {
        currentName: "",
        unit: "",
        type: "",
        count: "",
      },
      colorList: ["#ecf5ff", "#f0f9eb", "#f4f4f5", "#fcf6eb", "#fef0f0"],
    };
  },
  methods: {
    generateRandomColor() {
      // 生成RGB颜色的随机值
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);

      // 将RGB值转换为十六进制
      var hexR = r.toString(16).padStart(2, "0");
      var hexG = g.toString(16).padStart(2, "0");
      var hexB = b.toString(16).padStart(2, "0");

      // 返回生成的随机颜色
      return "#" + hexR + hexG + hexB;
    },
    generateTagsColor() {
      for (let i = 0; i < this.selectOptions.length; i++) {
        this.colorList.push(this.generateRandomColor());
      }
    },
    saveCard() {
      console.log("保存");
      this.edit = false;
    },
    deleteCard() {
      console.log("删除");
      this.$emit("deleteData");
    },
    handleEdit() {
      this.edit = !this.edit;
    },
  },
  created() {
    // this.generateTagsColor();
    if (!this.name) {
      this.edit = true;
    }
  },
  mounted() {
    this.form.currentName = this.name;
    this.form.type = this.type;
    this.form.unit = this.unit;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.food-card {
  width: 178px;
  height: 120px;
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
    &.small-size {
      font-size: 12px;
    }
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
    .tag-box {
      display: flex;
      flex-wrap: wrap;
      .el-tag {
        margin-right: 5px;
        margin-top: 3px;
        cursor: pointer;
        &:hover {
          color: #0d7ef2;
        }
      }
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
