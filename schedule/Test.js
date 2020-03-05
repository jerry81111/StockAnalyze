const saveMonthHistory = require("../service/SaveMonthHistory");
const monthHistory = require("../dao/MonthHistory.js");
var analyzeLowestPrice = require('../service/AnalyzeLowestPrice');


/* const stockNoArr = [2330, 2410];

async function aa() {
  for (let i = 0; i < 2; i++) {
    await saveMonthHistory(stockNoArr);
  }
  console.log("dddd");
}

aa();
 */

let  aa = async function (){return await analyzeLowestPrice(2330)}


async function bb(){
 let cc = await analyzeLowestPrice(2330)
 console.log(cc)
 return cc
}
console.log(aa())
