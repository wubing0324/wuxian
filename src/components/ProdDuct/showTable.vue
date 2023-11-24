<template>
  <div class="prod-container-table">
    <el-table class="header-sticky" :data="[]" style="width: 100%">
      <el-table-column
        :label="column"
        v-for="(column, index) in transTitle"
        :key="column + index"
      >
        <el-table-column :label="getSubTitle(index)">
          <template slot-scope="scope">
            {{ scope.row[index] }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看食材</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="tableData"
      style="width: 100%"
      @cell-dblclick="cellDblClick"
      :cell-class-name="tableCellClassName"
      :show-header="false"
      border
      stripe
    >
      <el-table-column
        :label="column"
        v-for="(column, index) in transTitle"
        :key="column + index"
      >
        <el-table-column :label="getSubTitle(index)">
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
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <editTable :rowName="rowName"></editTable> -->
  </div>
</template>

<script>
import moment from "moment";
import { xlsx } from "../ExcelJs/exportcell";
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
    weeks: {
      type: Array,
      default: () => [],
    },
    formatDate: {
      type: String,
      default: () => moment().format("YYYYMMDD"),
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
      let weeks = this.weeks.map((time) => `${time} ${this.getWeek(time)}`);
      return ["", "", ...weeks];
    },
    todayIndex() {
      let weeks = ["", "", ...this.weeks];
      let today = moment().format("YYYY/MM/DD");
      return weeks.findIndex((time) => time === today);
    },
  },
  methods: {
    handleClick(row) {
      this.$emit("combine", row);
    },
    exportExcel() {
      let subTitles = this.transTitle.map((data, index) => {
        return this.getSubTitle(index);
      });
      let dataAll = this.tableData.map((data) =>
        data.map((item, index) => {
          if (index > 1) {
            return `${item[0]} / ${item[1]}`;
          } else {
            return item;
          }
        })
      );
      dataAll.unshift(subTitles);
      dataAll.unshift(this.transTitle);
      var filename = this.formatDate
        .replace(/\//g, "")
        .replace(/\s*/g, "")
        .replace(/至/g, "-");
      xlsx(dataAll, [], `产品${filename}`);
    },
    getWeek(date) {
      // 参数时间戳
      let week = moment(date).day();
      switch (week) {
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        case 0:
          return "周日";
      }
    },
    getFormatName(prev, next) {
      return `${prev} (${next})`;
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      //注意这里是解构
      //利用单元格的 className 的回调方法，给行列索引赋值
      row.index = rowIndex;
      column.index = columnIndex;
      if (column.index === this.todayIndex) {
        return "is-today";
      }
    },
    handleEdit(row) {
      let selectedData = this.originData.find((data) => data.name === row[0]);
      this.$emit("handleEdit", {
        selectedData,
        row,
        weeks: this.weeks,
      });
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
    rowDbClick() {},
    isArray(arr) {
      return Object.prototype.toString.call(arr) === "[object Array]";
    },
    getSubTitle(index) {
      let title = "售出/总价";
      if (index === 0) {
        title = "产品名称";
      } else if (index === 1) {
        title = "单价（￥）";
      } else {
        title = "售出/总价";
      }

      return title;
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
        ];
      });
    },
  },
  mounted() {},
  created() {
    if (this.originData.length > 0) {
      this.generateTable();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.prod-container-table {
  .is-today {
    background: rgba(136, 197, 154, 0.31);
    position: relative;
    &::after {
      position: absolute;
      content: "今天";
      bottom: 0;
      right: 0;
      font-size: 12px;
    }
  }
  .header-sticky {
    position: sticky;
    top: 40px;
    z-index: 11;
    .el-table__body-wrapper {
      display: none;
    }
  }
  td.el-table__cell {
    font-size: 18px;
  }
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
