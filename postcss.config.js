/* eslint-disable */
module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 100, // 75表示750设计稿，37.5表示375设计稿
      propList: ["*"], //（数组）可以从 px 更改为 rem 的属性  使用通配符*启用所有属性。例子：['*']
    },
  },
};
