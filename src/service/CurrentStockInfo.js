const axios = require("axios");

async function getStockInfo(stockNoArr) {
  let url = "https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=";

  stockNoArr.forEach(element => {
    url = url + "tse_" + element + ".tw|";
  });

  let stockArr;
  try {
    const response = await axios.get(url);
    const data = response.data;
    stockArr = data.msgArray;
  } catch (error) {
    console.error("GetCurrentStockInfoUrl Error "+url);
  }
  return stockArr;
}

module.exports = {
  getStockInfo: async function(stockNoArr) {
    return await getStockInfo(stockNoArr);
  }
};
/* let arr = [2330];
getStockInfo(arr); */