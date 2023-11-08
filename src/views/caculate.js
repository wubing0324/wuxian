// 定义食材和数量
let ingredients = {
  面粉: 500,
  鸡蛋: 4,
  牛奶: 200,
  糖: 50,
  盐: 5,
};

// 定义不同食物所需的食材和数量
let recipes = {
  面包: {
    面粉: 250,
    鸡蛋: 2,
    牛奶: 100,
    糖: 25,
    盐: 2.5,
  },
  蛋糕: {
    面粉: 200,
    鸡蛋: 2,
    牛奶: 50,
    糖: 25,
    盐: 2.5,
  },
  煎饼: {
    面粉: 100,
    鸡蛋: 1,
    牛奶: 50,
    糖: 10,
    盐: 1,
  },
};

// 计算每制作一种食物后，不同食材的剩余数量
function calculateIngredients(ingredients, recipe) {
  for (let ingredient in recipe) {
    ingredients[ingredient] -= recipe[ingredient];
  }
  return ingredients;
}

// 测试
console.log("制作前食材数量:", ingredients);

let breadIngredients = calculateIngredients(ingredients, recipes["面包"]);
console.log("制作面包后食材数量:", breadIngredients);

let cakeIngredients = calculateIngredients(ingredients, recipes["蛋糕"]);
console.log("制作蛋糕后食材数量:", cakeIngredients);

let pancakeIngredients = calculateIngredients(ingredients, recipes["煎饼"]);
console.log("制作煎饼后食材数量:", pancakeIngredients);
