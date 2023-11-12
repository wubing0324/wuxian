<template>
  <div class="shicai-container">
    <div v-for="(data, ids) in tableData" :key="types[ids]">
      <p class="table-type">{{ types[ids] }}</p>
      <el-table :data="data" style="width: 100%">
        <el-table-column
          :label="column"
          v-for="(column, index) in getTitle(ids)"
          :key="column + index"
        >
          <el-table-column :label="getSubTitle(index, data[0].length)">
            <template slot-scope="scope">
              <div v-if="isArray(scope.row[index])">
                <span class="ruku">{{ scope.row[index][0] }}</span>
                /
                <span class="shengyu">{{ scope.row[index][1] }}</span>
              </div>
              <div v-else>
                {{ scope.row[index] }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {
      types: [],
      columns: [],
      tableData: [],
      weeks: [],
      // originData: [{ name: "gfd123", type: "解冻", unit: "ml", count: 0 }],
    };
  },
  props: {
    msg: String,
    originData: {
      type: Array,
      default: () => [],
    },
    date: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    originData: {
      handler: function () {
        this.generateTable();
      },
      deep: true,
    },
    date: {
      handler: function () {
        this.generateTable();
      },
      deep: true,
    },
  },
  computed: {
    transTitle() {
      return ["", ...this.weeks, ""];
    },
  },
  methods: {
    isArray(arr) {
      return Object.prototype.toString.call(arr) === "[object Array]";
    },
    getTitle(index) {
      let mapWeek = {
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
        7: "周日",
      };
      let weeks = this.weeks.map(
        (key, index) => key + "/" + mapWeek[index + 1]
      );
      return [this.types[index], ...weeks, ""];
    },
    getSubTitle(index, len) {
      let title = "入库/剩余";
      if (index === 0) {
        title = "食材名称/规格";
      } else if (index === len - 1) {
        title = "总量";
      } else {
        title = "入库/剩余";
      }

      return title;
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
    generateTable() {
      let types = new Set(this.originData.map((item) => item.type));
      this.types = types = [...types];
      let columns = types.map((type) => {
        return this.originData.filter((item) => item.type === type);
      });
      console.log("columns222 ===", columns);
      let matrixData = columns.map((data) =>
        data.map((row) => {
          let arr = [];
          for (let key in row) {
            arr.push(row[key]);
          }
          return arr;
        })
      );
      console.log("matrixData = ", matrixData);
      // let dateValue = [
      //   [12, 60],
      //   [13, 61],
      //   [13, 61],
      //   [13, 61],
      //   [13, 61],
      //   [13, 61],
      //   [13, 61],
      // ];
      // let date = {
      //   "2023/11/05": {
      //     fds: [11, 61],
      //     gfd: [111, 600],
      //     gfd1: [12, 60],
      //     gfd12: [12, 60],
      //     橙子: [12, 60],
      //     gfd123: [12, 60],
      //   },
      //   "2023/11/06": {
      //     fds: [12, 611],
      //     gfd: [12, 602],
      //     gfd1: [12, 603],
      //     gfd12: [12, 604],
      //     橙子: [12, 605],
      //     gfd123: [12, 606],
      //   },
      //   "2023/11/07": {
      //     fds: [12, 62],
      //     gfd: [12, 60],
      //     gfd1: [12, 60],
      //     gfd12: [12, 60],
      //     橙子: [12, 60],
      //     gfd123: [12, 60],
      //   },
      //   "2023/11/08": {
      //     fds: [12, 63],
      //     gfd: [12, 60],
      //     gfd1: [12, 60],
      //     gfd12: [12, 60],
      //     橙子: [12, 60],
      //     gfd123: [12, 60],
      //   },
      //   "2023/11/09": {
      //     fds: [12, 64],
      //     gfd: [12, 60],
      //     gfd1: [12, 60],
      //     gfd12: [12, 60],
      //     橙子: [12, 60],
      //     gfd123: [12, 60],
      //   },
      //   "2023/11/10": {
      //     fds: [12, 65],
      //     gfd: [12, 60],
      //     gfd1: [12, 60],
      //     gfd12: [12, 60],
      //     橙子: [12, 60],
      //     gfd123: [12, 60],
      //   },
      //   "2023/11/11": {
      //     fds: [12, 66],
      //     gfd: [12, 60],
      //     gfd1: [12, 60],
      //     gfd12: [12, 60],
      //     橙子: [12, 60],
      //     gfd123: [12, 60],
      //   },
      //   "2023/11/12": {
      //     fds: [12, 67],
      //     gfd: [12, 60],
      //     gfd1: [12, 650],
      //     gfd12: [12, 670],
      //     橙子: [12, 680],
      //     gfd123: [12, 680],
      //   },
      //   "2023/11/13": {
      //     fds: [12, 610],
      //     gfd: [12, 60],
      //     gfd1: [12, 610],
      //     gfd12: [12, 60],
      //     橙子: [12, 60],
      //     gfd123: [12, 60],
      //   },
      //   "2023/11/14": {
      //     fds: [12, 602],
      //     gfd: [12, 602],
      //     gfd1: [12, 602],
      //     gfd12: [12, 602],
      //     橙子: [12, 620],
      //     gfd123: [12, 620],
      //   },
      //   "2023/11/15": {
      //     fds: [121, 6000],
      //     gfd: [121, 600],
      //     gfd1: [121, 600],
      //     gfd12: [121, 600],
      //     橙子: [121, 600],
      //     gfd123: [521, 600],
      //   },
      // };
      this.tableData = matrixData.map((data, index) =>
        data.map((col, i) => {
          let name = columns[index][i].name;
          return [
            `${columns[index][i].name} (${columns[index][i].unit})`,
            ...this.weeks.map((key) => {
              return this.date[key][name];
            }),
            columns[index][i].count,
          ];
        })
      );
      console.log("this.tableData = ", this.tableData);
    },
  },
  mounted() {},
  created() {
    this.weeks = this.generateWeeks();
    if (this.originData.length > 0) {
      this.generateTable();
    }
    console.log("originData =", this.originData);
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
  .table-type {
    font-size: 16px;
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    .shicai-card {
      margin-right: 5px;
    }
  }
  .shengyu {
    color: green;
  }
  .ruku {
    color: red;
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
