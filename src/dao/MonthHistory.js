const mongoose = require("../config/MongoConfig.js");

var Schema = mongoose.Schema;
var monthHistorySchema = new Schema({
  _id: String,
  code: Number,
  name: String,
  date: String,
  data: Object
}, {
  versionKey: false // set to false then it wont create in mongodb
});

var monthHistory = mongoose.model("month_history", monthHistorySchema);

module.exports = {
  findByCode: function(stockNo,callback) {
     monthHistory.find({ code: stockNo }).exec(function (err, docs) {callback(err,docs)});
  },
  findLastDate: function(stockNo, callback) {
    monthHistory.find(
      { code: stockNo },
      null,
      { sort: { date: -1 }, limit: 1 },
      function(err, docs) {
        callback(err, docs);
      }
    );
  },
  upsert: function(id, monthHistoryModel) {
    monthHistory.updateOne(
      { _id: id },
      monthHistoryModel,
      { upsert: true, setDefaultsOnInsert: true }, // options
      function(err, rawResponse) {
        console.log(rawResponse);
        if (err) {
          console.log(err);
        }
      }
    );
  },
  findDistinctNo:function(callback){
    monthHistory.find().distinct('code', function(err, docs) {
      callback(err, docs);
    })
  },
  model: monthHistory
};
