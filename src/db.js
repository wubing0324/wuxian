const resolvablePromise = () => {
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
};
const promisify = (request) => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
const dbPromise = resolvablePromise();
const dbPromiseMap = {};
export const openDb = function (dbName, storeName = []) {
  // 1.新建或者打开数据库
  const request = window.indexedDB.open(dbName);
  request.onupgradeneeded = () => {
    const db = request.result;
    // 2.创建对象仓库，即新建表
    storeName.forEach((name) => {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, {
          autoIncrement: true,
        });
      }
    });
    dbPromiseMap[dbName] = dbPromise.resolve(db);
  };
  request.onsuccess = (event) => {
    var db = event.target.result;
    window.db = db;
    console.log("onsuccess...", db);
    dbPromise.resolve(db);
  };
};

const getStore = async (tableName, storeName, operationMode) => {
  const db = await dbPromiseMap[tableName];
  const store = db.transaction(storeName, operationMode).objectStore(storeName);
  return store;
};

// 3.添加数据
export const setItem = async (tableName, key, value) => {
  const store = await getStore(tableName, "readwrite");

  const request = store.put(value, key);
  return promisify(request);
};
// 4.读取数据
export const getItem = async (tableName, key) => {
  const store = await getStore(tableName, "readonly");

  const request = store.get(key);
  return promisify(request);
};
