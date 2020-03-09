var schedule = require('node-schedule');
var saveMonthHistory = require('../service/SaveMonthHistory');
var lowestPrice = require('../service/AnalyzeLowestPrice');

let rule = new schedule.RecurrenceRule();
rule.minute = 30;


/* var j = schedule.scheduleJob(rule, function(){
  saveMonthHistory.downloadMonthHistory(2330);
  lowestPrice.getLowestPrice();
});  */

saveMonthHistory();

