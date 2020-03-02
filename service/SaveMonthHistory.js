/* const request = require("request-promise"); */
const monthHistory = require("../dao/MonthHistory.js");
const got = require("got");

var year;
var month;
var today = new Date();
var dateNow = today.getFullYear() + pad(today.getMonth() + 1);
var slash = "/";
var aa;
const downloadMonthHistory = async stockNo => {
  const newestData = await findNewestData(stockNo);
  if (newestData.length != 0) {
    year = parseInt(newestData[0].date.split(slash)[0]) + 1911;
    month = newestData[0].date.split(slash)[1];
  } else {
    year = today.getFullYear();
    month = today.getMonth() + 1;
    year = year - 1;
  }
  aa = setInterval(function() {
    callExternalApi(stockNo);
  }, 5000);
};

function findNewestData(stockNo) {
  return new Promise(resove => {
    monthHistory.findLastDate(stockNo, function(err, doc) {
      resove(doc);
    });
  });
}

function pad(num) {
  return (Array(2).join("0") + num).slice(-2);
}

function callExternalApi(stockNo) {
  var url =
    "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=" +
    year +
    pad(month) +
    "01&stockNo=" +
    stockNo;
  console.log(url);

  month++;
  if (month > 12) {
    year++;
    month = 1;
  }
  if (parseInt(year + pad(month)) >= parseInt(dateNow)) {
    month = month-1;
    clearInterval(aa);
    console.log("Break Interval");
  }

   got(url)
    .then(response => {
      upsert(stockNo, response.body);
    })
    .catch(error => {
      console.log(error);
    });
}

function upsert(stockNo, body) {
  var json = JSON.parse(body);
  var titleArr = json["title"].split(" ");
  var modelDate = titleArr[0].replace("年", slash).replace("月", "");
  var monthHistoryModel = new monthHistory.model({
    _id: stockNo + "_" + modelDate.replace(slash, "_"),
    code: titleArr[1],
    name: titleArr[2],
    date: modelDate,
    data: json["data"]
  });

  monthHistory.upsert(modelDate, monthHistoryModel);
}

/* module.exports ={
  downloadMonthHistory: function(stockNo) {
    downloadMonthHistory(stockNo);
  }
}; */

module.exports = {
  downloadMonthHistory: function(stockNo) {
    return new Promise((resolve, reject) => {
      downloadMonthHistory(stockNo, result => {
        resolve(result);
      });
    });
  }
};
