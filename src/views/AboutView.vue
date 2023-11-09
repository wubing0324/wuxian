<template>
  <div class="hello">
    <el-button type="primary" @click="addAssets">添加食材</el-button>
    <el-button type="success" @click="addProd">添加产品</el-button>
    <el-table :data="tableData3" style="width: 100%">
      <el-table-column prop="date" label="日期" width="150"> </el-table-column>
      <el-table-column
        :label="column.name"
        v-for="column in columns"
        :key="column.name"
      >
        <el-table-column
          prop="name"
          :label="column2.name"
          width="120"
          v-for="column2 in column.children"
          :key="column2.name"
        ></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "HelloWorld",
  data() {
    return {
      weeks: [],
      originData: [
        {
          type: "选择题",
          num: "5题",
          average: "3分/题",
        },
        {
          type: "填空题",
          num: "5题",
          average: "3分/题",
        },
        {
          type: "选择题",
          num: "2题",
          average: "10分/题",
        },
      ],
      originTitle: ["题型", "数量", "均分"], // originTitle 该标题为 正常显示的标题, 数组中的顺序就是上面数据源对象中的字段标题对应的顺序
      transTitle: ["", "学生1", "学生2", "学生3"], // transTitle 该标题为转化后的标题, 注意多一列,  因为原来的标题变成了竖着显示了, 所以多一列标题, 第一个为空即可
      transData: [],
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
              name: "橙子煮红茶",
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
      tableData3: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
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
    this.transData = matrixData[0].map((col, i) => {
      return [
        this.originTitle[i],
        ...matrixData.map((row) => {
          return row[i];
        }),
      ];
    });
    console.log("this.transData = ", this.transData);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.test {
  color: red;
  .re {
    color: red;
  }
}
</style>
