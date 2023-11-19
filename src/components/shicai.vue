<template>
  <div class="food-card">
    <el-card :body-style="{ padding: '0px' }" class="box-card">
      <div class="edit-box" v-show="edit">
        <div class="row-item">
          <span class="row-item-span">名称</span>
          <el-input
            size="mini"
            type="age"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </div>
        <div class="row-item">
          <span class="row-item-span">数量</span>
          <el-input
            type="age"
            size="mini"
            v-model="form.count"
            autocomplete="off"
          ></el-input>
        </div>
        <div class="row-item">
          <span class="row-item-span">单位</span>
          <el-input
            type="age"
            size="mini"
            v-model="form.unit"
            autocomplete="off"
          ></el-input>
        </div>
        <div class="row-item">
          <span class="row-item-span">类型</span>
          <el-select v-model="form.type" placeholder="请选择" size="mini">
            <el-option
              v-for="item in assetTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
    assetTypeData: {
      type: Array,
      default: () => [],
    },
    infoFromProps: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      edit: true,
      form: {
        name: "",
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
      this.edit = false;
    },
    deleteCard() {
      this.$emit("deleteData");
    },
  },
  created() {
    // this.generateTagsColor();
    if (!this.name) {
      this.edit = true;
    }
  },
  mounted() {
    this.form = { ...this.infoFromProps };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.food-card {
  width: 228px;
  height: 220px;
  font-size: 14px;
  position: relative;
  .edit-box {
    position: relative;
    padding: 40px 14px 14px 14px;
    .card-delete {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-size: 24px;
    }
    .row-item-span {
      width: 50px;
      text-align: left;
    }
  }
  .el-card {
    font-size: 14px;
    width: 100%;
    height: 100%;
  }
  .row-item {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
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
