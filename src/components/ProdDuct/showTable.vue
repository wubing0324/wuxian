<template>
  <div class="shicai-container">
    <el-table
      :data="tableData"
      style="width: 100%"
      @cell-dblclick="cellDblClick"
      :cell-class-name="tableCellClassName"
    >
      <el-table-column
        :label="column"
        v-for="(column, index) in getTitle()"
        :key="column + index"
      >
        <el-table-column
          :label="
            getSubTitle(index, tableData.length > 0 ? tableData[0].length : 0)
          "
        >
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
    <!-- <editTable :rowName="rowName"></editTable> -->
  </div>
</template>

<script>
import moment from "moment";
// import editTable from "./editTable.vue";

export default {
  name: "ShowTavble",
  components: {
    // editTable,
  },
  data() {
    return {
      rowName: "",
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
    getFormatName(prev, next) {
      return `${prev} (${next})`;
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      //注意这里是解构
      //利用单元格的 className 的回调方法，给行列索引赋值
      row.index = rowIndex;
      column.index = columnIndex;
    },
    cellDblClick(row, column) {
      let selectedData = this.originData.find((data) => data.name === row[0]);
      this.$emit("cellDblClick", {
        column,
        selectedData,
        row,
        weeks: this.weeks,
      });
    },
    rowDbClick(row) {
      // @row-dblclick="rowDbClick"
      let selectedData = this.originData.find(
        (data) => this.getFormatName(data.name, data.unit) === row[0]
      );
      console.log("selectedData = ", selectedData);
    },
    isArray(arr) {
      return Object.prototype.toString.call(arr) === "[object Array]";
    },
    getTitle() {
      let mapWeek = {
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
        7: "周日",
      };
      let weeks = this.weeks.map((key, ids) => key + "/" + mapWeek[ids + 1]);
      return ["", "", ...weeks, ""];
    },
    getSubTitle(index, len) {
      let title = "售出/总价";
      if (index === 0) {
        title = "食材名称/规格";
      } else if (index === 1) {
        title = "单价（￥）";
      } else if (index === len - 1) {
        title = "总量";
      } else {
        title = "售出/总价";
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
      let matrixData = this.originData.map((row) => {
        let arr = [];
        for (let key in row) {
          arr.push(row[key]);
        }
        return arr;
      });
      this.tableData = matrixData.map((col) => {
        return [
          col[0],
          col[1],
          ...this.weeks.map((key) => {
            return this.date[key][col[2]];
          }),
          col[3],
        ];
      });
    },
  },
  mounted() {},
  created() {
    this.weeks = this.generateWeeks();
    if (this.originData.length > 0) {
      this.generateTable();
    }
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
