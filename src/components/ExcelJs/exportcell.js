import fs from "file-saver";
import XLSX from "xlsx";

export function xlsx(json, positions, filename = ".xlsx") {
  //导出xlsx
  // json.forEach((item) => {
  //   for (let index in item) {
  //     if (Object.prototype.hasOwnProperty.call(fields, index)) {
  //       item[fields[index]] = item[index];
  //     }
  //     delete item[index]; //删除原先的对象属性
  //   }
  // });
  let sheetName = filename; //excel的文件名称
  let wb = XLSX.utils.book_new(); //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
  let ws = XLSX.utils.aoa_to_sheet(json); //将JS对象数组转换为工作表。
  wb.SheetNames.push(sheetName);
  wb.Sheets[sheetName] = ws;
  ws["!cols"] = [
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
  ];
  const merge = positions.map((pos) => {
    return { s: { r: pos[0], c: 0 }, e: { r: pos[1], c: 0 } };
  });
  // const merge = [
  //   // 纵向合并，范围是第1列的行1到行2
  //   { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
  //   // 纵向合并，范围是第2列的行1到行2
  //   { s: { r: 5, c: 0 }, e: { r: 24, c: 0 } },
  // ];
  if (merge.length > 0) {
    ws["!merges"] = merge;
  }
  const defaultCellStyle = {
    font: { name: "Verdana", sz: 20, color: "FF00FF88" },
    fill: { fgColor: { rgb: "FFFFAA00" } },
  }; //设置表格的样式
  let wopts = {
    bookType: "xlsx",
    bookSST: false,
    type: "binary",
    cellStyles: true,
    defaultCellStyle: defaultCellStyle,
    showGridLines: false,
  }; //写入的样式
  let wbout = XLSX.write(wb, wopts);
  let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  fs.saveAs(blob, filename + ".xlsx");
}

const s2ab = (s) => {
  var buf;
  if (typeof ArrayBuffer !== "undefined") {
    buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  } else {
    buf = new Array(s.length);
    for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
};
