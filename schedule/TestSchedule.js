var schedule = require('node-schedule');

var j = schedule.scheduleJob('*/10 * * * * *', function(){
  console.log('生命，宇宙，一切的答案。。。!');
});