<template>
  <div class="home">
    <div class="menu-container">
      <el-input v-model="tableName" />
      <el-button @click="updateTable">更新表{{ version }}</el-button>
      <el-button @click="insertData">插入</el-button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "IndexDb",
  components: {},
  data() {
    return {
      version: 1,
      tableName: "fdsfds",
    };
  },
  methods: {
    jump(type) {
      // this.$router.push({ name: "wuliao", params: { type } });
      this.$router.push({ path: `/wuliao/${type}` });
    },
    insertData() {
      var transaction = window.db.transaction(["originData"], "readwrite");
      var objectStore = transaction.objectStore("originData");
      // 在表中添加数据
      var data = { id: 1, name: "John" };
      var addRequest = objectStore.add(data);
      addRequest.onsuccess = function () {
        console.log("数据添加成功");
      };
      addRequest.onerror = function () {
        console.log("数据添加失败");
      };
    },
    updateTable() {
      this.version = this.version + 1;
      var request = window.indexedDB.open("wubing", this.version);
      request.onupgradeneeded = function (event) {
        var db = event.target.result;
        console.log(
          "db.objectStoreNames = ",
          db.objectStoreNames,
          db.objectStoreNames.contains(this.tableName)
        );
        debugger;
        if (!db.objectStoreNames.contains(this.tableName)) {
          db.createObjectStore(this.tableName, { autoIncrement: true });
        }
      };
    },
  },
  created() {
    const databaseName = "database";
    let version = "1";
    var request = window.indexedDB.open(databaseName, version);
    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      window.db = db;
      var objectStore;
      debugger;
      if (!db.objectStoreNames.contains("originData")) {
        objectStore = db.createObjectStore("originData", {
          autoIncrement: true,
        });
      }
      objectStore.createIndex("name", "name", { unique: false });
    };
    request.onsuccess = function (event) {
      var db = event.target.result;
      window.db = db;
      // var objectStore = db.createObjectStore("productOriginData", {
      //   autoIncrement: true,
      // });
      // objectStore.createIndex("name", "name", { unique: false });
      // var transaction = db.transaction(["productOriginData"], "readwrite");
      // objectStore = transaction.objectStore("productOriginData");
      // // 在表中添加数据
      // var data = { id: 1, name: "John" };
      // var addRequest = objectStore.add(data);
      // addRequest.onsuccess = function () {
      //   console.log("数据添加成功");
      // };
      // addRequest.onerror = function () {
      //   console.log("数据添加失败");
      // };
    };
  },
};
</script>
<style lang="less">
.menu-container {
  display: flex;
  width: 800px;
  margin: 180px auto;
  justify-content: space-between;
  .menu-item {
    width: 240px;
    height: 270px;
    font-size: 26px;
    cursor: pointer;
  }
}
time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
