const monthHistory = require("../dao/MonthHistory.js");
const fileService = require("./FileService.js");
const got = require("got");

var year;
var month;
var today = new Date();
const dateNow = today.getFullYear() + pad(today.getMonth() + 1);
const slash = "/";
const delayTime = 5 * 1000;
const pastYear = 10;

function findNewestData(stockNo) {
  return new Promise(resolve => {
    monthHistory.findLastDate(stockNo, function(err, doc) {
      if (err) return reject(err);
      resolve(doc);
    });
  });
}
function pad(num) {
  return (Array(2).join("0") + num).slice(-2);
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function downloadMonthHistory(input) {
  let stockNoArr = input.split(",");
  for (let i = 0; i < stockNoArr.length; i++) {
    await analyzeStartDate(stockNoArr[i]);
  }
}

async function analyzeStartDate(stockNo) {
  const newestData = await findNewestData(stockNo);

  if (newestData.length != 0) {
    year = parseInt(newestData[0].date.split(slash)[0]) + 1911;
    month = newestData[0].date.split(slash)[1];
  } else {
    year = today.getFullYear();
    month = today.getMonth() + 1;
    year = year - pastYear;
  }

  await loop(stockNo).catch(err => {
    console.log(err);
  });
}

async function loop(stockNo) {
  while (parseInt(year + pad(month)) <= parseInt(dateNow)) {
    var url = "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=" + year + pad(month) + "01&stockNo=" + stockNo;

    /* console.log(url) */
    got(url)
      .then(response => {
        console.log("Execute " + url);
        if (JSON.parse(response.body)["stat"] != "OK") {
          console.error("Api Response Error");
          return;
        }
        upsert(stockNo, response.body);
      })
      .catch(err => {
        console.log(err);
      });

    await delay(delayTime);
    month++;
    if (month > 12) {
      year++;
      month = 1;
    }
  }
  console.log("Break StockNo : " + stockNo);
}

function upsert(stockNo, body) {
  var json = JSON.parse(body);
  var titleArr = json["title"].split(" ");
  var modelDate = titleArr[0].replace("年", slash).replace("月", "");
  let id = stockNo + "_" + modelDate.replace(slash, "_");
  var monthHistoryModel = new monthHistory.model({
    _id: id,
    code: titleArr[1],
    name: titleArr[2],
    date: modelDate,
    data: json["data"]
  });
  monthHistory.upsert(id, monthHistoryModel);
}

//analyzeLowestPrice
async function analyzeLowestPrice(stockNo) {
  return new Promise((resolve, reject) => {
    monthHistory.findByCode(stockNo, function(err, docs) {
      if (err) return reject(err);
      resolve(getLowestPrice(docs));
    });
  });
}
function getLowestPrice(docs) {
  let lowestPriceArr = [];
  docs.forEach(doc =>
    doc.data.forEach(data => {
      lowestPriceArr.push(parseFloat(data[6]));
    })
  );
  return Math.min(...lowestPriceArr);
}

//findDistinctNo
function findDistinctNo() {
  return new Promise(resolve => {
    monthHistory.findDistinctNo(function(err, doc) {
      if (err) return reject(err);
      resolve(doc);
    });
  });
}
//module export
module.exports = {
  downloadMonthHistory: async function() {
    let input = await fileService.readFile("./MonthHistory.txt");
    await downloadMonthHistory(input);
  },
  analyzeLowestPrice: async function(stockNo) {
    return await analyzeLowestPrice(stockNo);
  },
  findDistinctNo: async function() {
    return await findDistinctNo();
  }
};
