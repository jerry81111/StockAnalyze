const request = require("request");
const monthHistory = require("../config/MongoConfig.js");

var stockNo = 2330;

const init = async () => {
  const result = await find();

  var year;
  var month;
  var today = new Date();
  if (result.length != 0) {
    year = parseInt(result[0].date.split("/")[0]) + 1911;
    month = result[0].date.split("/")[1];
  } else {
    year = today.getFullYear();
    month = today.getMonth() + 1;
    year = year - 1;
  }
  loop(year, month, today);
};

init();

function find() {
  return new Promise(resove => {
    monthHistory.findLastDate(function(err, doc) {
      resove(doc);
    });
  });
}
function sleep(milliseconds) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + milliseconds) {
    /* do nothing */
  }
}

function loop(year, month, today) {
  var dateNow = today.getFullYear() + pad(today.getMonth() + 1);

  while (year + pad(month) <= dateNow) {
    sleep(5000);

    call({
      date: year + pad(month),
      no: stockNo
    });
    month = month + 1;
    if (month > 12) {
      year = year + 1;
      month = 1;
    }
  }
}

function pad(num) {
  return (Array(2).join("0") + num).slice(-2);
}

function call(param) {
  var url =
    "http://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=" +
    param.date +
    "01&stockNo=" +
    param.no;
  console.log(url);

  request(url, function(error, response, body) {
    save(body);
  });
}

function save(body) {
  console.log(body);
  var json = JSON.parse(body);
  var titleArr = json["title"].split(" ");
  var modelDate = titleArr[0].replace("年", "/").replace("月", "");
  var monthHistoryModel = new monthHistory.model({
    code: titleArr[1],
    name: titleArr[2],
    date: modelDate,
    data: json["data"]
  });
  /*  monthHistoryModel.save(function(err) {
    if (err) return handleError(err);
  }); */

  monthHistoryModel.findOneAndUpdate(
    { date: modelDate },
    monthHistoryModel,
    { upsert: true, new: true, runValidators: true }, // options
    function(err, doc) {
      // callback
      if (err) {
        // handle error
      } else {
        // handle document
      }
    }
  );
}
