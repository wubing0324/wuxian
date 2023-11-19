<script>
export default {
  name: "dynamicTable",
  data() {
    return {
      tableData: [
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
      handler: function (val) {},
      immediate: true,
    },
  },
  render() {
    return (
      <el-table data={this.tableData3} style="width: 100%">
        {
          <el-table-column label="配送信息">
            <el-table-column
              prop="name"
              label="姓名"
              width="120"
            ></el-table-column>
            <el-table-column label="地址">
              <el-table-column
                prop="province"
                label="省份"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="city"
                label="市区"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="address"
                label="地址"
                width="300"
              ></el-table-column>
              <el-table-column
                prop="zip"
                label="邮编"
                width="120"
              ></el-table-column>
            </el-table-column>
          </el-table-column>
        }
      </el-table>
    );
  },
  methods: {},
  mounted() {},
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
