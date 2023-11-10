<template>
  <div class="hello">
    <div class="all-card-boxs" v-for="(cols, index) in menu" :key="index">
      <p class="p-title">{{ cols[0].split("/")[0] }}</p>
      <div class="card-box">
        <shicai
          :name="name.split('/')[1]"
          v-for="(name, index) in cols"
          :key="name || 'add'"
          :index="index"
          @deleteData="deleteData(cols, index)"
          :selectOptions="selectOptions"
        ></shicai>
        <el-card class="add-card">
          <i class="el-icon-plus" @click="addCard(cols, index)"></i>
        </el-card>
      </div>
    </div>
    <el-button type="primary" @click="addAssets">添加食材</el-button>
    <el-button type="success" @click="addProd">添加产品</el-button>
    <el-table :data="transData3" style="width: 100%">
      <el-table-column
        :label="column"
        v-for="(column, index) in transTitle"
        :key="column + index"
      >
        <template slot-scope="scope">
          {{ scope.row[index] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
import shicai from "@/components/shicai.vue";

export default {
  name: "HelloWorld",
  components: {
    shicai,
  },
  data() {
    return {
      selectOptions: [
        {
          value: "预处理",
          label: "预处理",
        },
        {
          value: "解冻",
          label: "解冻",
        },
        {
          value: "水果",
          label: "水果",
        },
        {
          value: "中种",
          label: "中种",
        },
        {
          value: "蔬菜*未处理",
          label: "蔬菜*未处理",
        },
      ],
      menu: [],
      weeks: [],
      transData3: [],
      originData: [
        {
          type: "选择题",
          num: "5题",
          average: "3分/题",
          average1: "3分/题",
          average2: "3分/题",
          average3: "3分/题",
          average4: "3分/题",
          average5: "3分/题",
          average6: "3分/题",
          average7: "3分/题",
        },
        {
          type: "选择题",
          num: "5题",
          average: "3分/题",
          average1: "3分/题",
          average2: "3分/题",
          average3: "3分/题",
          average4: "3分/题",
          average5: "3分/题",
          average6: "3分/题",
          average7: "3分/题",
        },
        {
          type: "选择题",
          num: "5题",
          average: "3分/题",
          average1: "3分/题",
          average2: "3分/题",
          average3: "3分/题",
          average4: "3分/题",
          average5: "3分/题",
          average6: "3分/题",
          average7: "3分/题",
        },
        {
          type: "选择题",
          num: "5题",
          average: "3分/题",
          average1: "3分/题",
          average2: "3分/题",
          average3: "3分/题",
          average4: "3分/题",
          average5: "3分/题",
          average6: "3分/题",
          average7: "3分/题",
        },
      ],
      originTitle: ["招牌咖喱酱", "番茄牛腩酱", "橙子煮红茶发财发财发财发财"], // originTitle 该标题为 正常显示的标题, 数组中的顺序就是上面数据源对象中的字段标题对应的顺序
      columns: [
        {
          name: "预处理",
          children: [
            {
              name: "招牌咖喱酱",
            },
            {
              name: "番茄牛腩酱",
            },
            {
              name: "橙子煮红茶发财发财发财发财范德萨范德萨范德萨富士达富士达",
            },
            {
              name: "6分熟意面",
            },
            {
              name: "培根切块",
            },
          ],
        },
        {
          name: "解冻",
          children: [
            {
              name: "台式香肠",
            },
            {
              name: "日式生吐司",
            },
            {
              name: "草莓白巧恰巴塔",
            },
            {
              name: "黑豆松子恰巴塔",
            },
            {
              name: "广式甜肠恰巴塔",
            },
          ],
        },
        {
          name: "水果",
          children: [
            {
              name: "冷冻蓝莓",
            },
            {
              name: "小番茄",
            },
            {
              name: "牛油果",
            },
            {
              name: "无花果",
            },
            {
              name: "芒果",
            },
          ],
        },
        {
          name: "中种",
          children: [
            {
              name: "液种",
            },
            {
              name: "汤种",
            },
            {
              name: "老面",
            },
            {
              name: "新品",
            },
          ],
        },
        {
          name: "蔬菜*未处理",
          children: [
            {
              name: "胡萝卜",
            },
            {
              name: "黄洋葱",
            },
            {
              name: "迷迭香",
            },
            {
              name: "樱桃萝卜",
            },
          ],
        },
      ],
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
    deleteData(data, index) {
      data.splice(index, 1);
    },
    addCard(name, index) {
      console.log("menus = ", this.menu);
      console.log("menu = ", this.menu[index]);
      this.menu[index].push("");
    },
    addAssets() {},
    addProd() {},
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
  },
  mounted() {
    // this.originTitle = []
    this.menu = this.columns.map((col) => {
      return col.children.map((item) => col.name + "/" + item.name);
    });
    this.originTitle = this.menu.flat();
    this.weeks = this.generateWeeks();
    let matrixData = this.originData.map((row) => {
      let arr = [];
      for (let key in row) {
        arr.push(row[key]);
      }
      return arr;
    });
    console.log("matrixData = ", matrixData);
    // 加入标题拼接最终的数据
    this.transData3 = matrixData[0].map((col, i) => {
      return [
        this.originTitle[i],
        ...matrixData.map((row) => {
          return row[i];
        }),
      ];
    });
    console.log("this.transData = ", this.transData3);
  },
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
    width: 268px;
    height: 280px;
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
