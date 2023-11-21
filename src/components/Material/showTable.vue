<template>
  <div class="shicai-container-table">
    <el-table :data="[]" class="header-sticky" style="width: 100%" border>
      <el-table-column
        :label="column"
        v-for="(column, index) in transTitle"
        :key="column + index"
      >
        <el-table-column :label="getSubTitle(index, 8)">
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
    <div v-for="(data, ids) in tableData" :key="types[ids]">
      <p class="table-type">{{ types[ids] }}</p>
      <el-table
        :data="data"
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
    <!-- <editTable :rowName="rowName"></editTable> -->
  </div>
</template>

<script>
import moment from "moment";
// import editTable from "./editTable.vue";
import { mapMutations } from "vuex";
import { xlsx } from "../ExcelJs/exportcell";

export default {
  name: "ShowTable",
  components: {
    // editTable,
  },
  data() {
    return {
      allTableData: [],
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
    weeks: {
      type: Array,
      default: () => [],
    },
    date: {
      type: Object,
      default: () => {},
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
    // weeks: {
    //   handler: function (val) {
    //     console.log("更新weeks，刷新表格", val);
    //     this.generateTable();
    //   },
    //   deep: true,
    // },
  },
  computed: {
    transTitle() {
      let weeks = this.weeks.map((time) => `${time} ${this.getWeek(time)}`);
      return ["", ...weeks];
    },
    todayIndex() {
      let weeks = ["", ...this.weeks];
      let today = moment().format("YYYY/MM/DD");
      return weeks.findIndex((time) => time === today);
    },
  },
  methods: {
    ...mapMutations(["setAssetTypes"]),
    exportExcel() {
      let subTitles = this.transTitle.map((data, index) => {
        return this.getSubTitle(index, 9);
      });
      console.log("subTitles = ", subTitles);
      // let data = this.tableData.flat();
      let dataAll = [];
      this.tableData.forEach((data, ids) => {
        let d = data.map((items) =>
          items.map((item, index) => {
            if (index > 0) {
              return `${item[0]} / ${item[1]}`;
            } else {
              return item;
            }
          })
        );
        dataAll.push(...d);
        let line = new Array(data[0].length).fill(this.types[ids]);
        dataAll.push(line);
        console.log("data==========", data, this.types[ids], line);
      });
      dataAll.unshift(subTitles);
      dataAll.unshift(this.transTitle);
      var filename = this.formatDate
        .replace(/\//g, "")
        .replace(/\s*/g, "")
        .replace(/至/g, "-");
      console.log("filename = ", filename);
      xlsx(dataAll, this.weeks, `食材${filename}`);
    },
    getFormatName(prev, next) {
      return `${prev} (${next})`;
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      //注意这里是解构
      //利用单元格的 className 的回调方法，给行列索引赋值
      row.index = rowIndex;
      if (column.index === this.todayIndex) {
        return "is-today";
      }
      column.index = columnIndex;
    },
    cellDblClick(row, column) {
      let selectedData = this.originData.find(
        (data) => this.getFormatName(data.name, data.unit) === row[0]
      );
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
    getSubTitle(index) {
      let title = "入库/剩余";
      if (index === 0) {
        title = "食材名称/规格";
      } else {
        title = "入库/剩余";
      }

      return title;
    },
    generateTable() {
      let types = new Set(this.originData.map((item) => item.type));
      this.types = types = [...types];
      this.setAssetTypes([...types]);
      let columns = types.map((type) => {
        return this.originData.filter((item) => item.type === type);
      });
      let matrixData = columns.map((data) =>
        data.map((row) => {
          let arr = [];
          for (let key in row) {
            arr.push(row[key]);
          }
          return arr;
        })
      );
      this.tableData = matrixData.map((data, index) =>
        data.map((col, i) => {
          let id = columns[index][i].id;
          return [
            this.getFormatName(columns[index][i].name, columns[index][i].unit),
            ...this.weeks.map((key) => {
              return this.date[key][id];
            }),
          ];
        })
      );
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
.small-title {
  font-size: 14px;
}
.is-today {
  background: rgba(136, 197, 154, 0.31);
}
.shicai-container-table {
  position: relative;
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
  .export-btn {
    position: absolute;
    right: 80px;
    top: 0;
  }
  .switch-week {
    font-size: 16px;
  }
  .p-title {
    font-size: 18px;
    font-weight: 500;
  }
  .table-type {
    font-size: 16px;
    position: sticky;
    top: 136px;
    z-index: 10;
    height: 40px;
    line-height: 40px;
    color: rgba(46, 75, 72, 0.72);
    font-weight: 700;
    background: #9bccc8;
    margin: 0;
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
