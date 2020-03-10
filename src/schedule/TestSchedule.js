const schedule = require("node-schedule");
const monthHistory = require("../service/MonthHistory");
const currentStockInfo = require("../service/CurrentStockInfo");
const notifyService = require("../service/NotifyService");

var downloadMonthHistorySchedule = schedule.scheduleJob('* 0 * * * *', function() {
  downloadMonthHistory();
});

/* var analyzePastYearLowestPricSchedule = schedule.scheduleJob('0 * * * * *', function() {
  analyzePastYearLowestPric();
}); */

async function downloadMonthHistory() {
  var startStamp = new Date().getTime();
  await monthHistory.downloadMonthHistory();
  console.log("Execution time: " + msToTime(new Date().getTime() - startStamp));
}

async function analyzePastYearLowestPric() {
  let stockNoArr = await monthHistory.findDistinctNo();
  let stockInfoArr = await currentStockInfo.getStockInfo(stockNoArr);

  for (i in stockInfoArr) {
    let currentPrice = stockInfoArr[i].z;
    let lowestPrice = await monthHistory.analyzeLowestPrice(stockInfoArr[i].c);

    if (currentPrice < lowestPrice)
      notifyService.notifyMsg(stockInfoArr[i].c + " " + stockInfoArr[i].n + " CurrentPrice:" + currentPrice + " LowestPrice:" + lowestPrice);
  }
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

downloadMonthHistory();
