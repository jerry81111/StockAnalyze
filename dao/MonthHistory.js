const mongoose = require("../config/MongoConfig.js");

var Schema = mongoose.Schema;
var monthHistorySchema = new Schema({
  _id: String,
  code: Number,
  name: String,
  date: String,
  data: Object
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
  upsert: function(modelDate, monthHistoryModel) {
    monthHistory.updateOne(
      { date: modelDate },
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
  model: monthHistory
};
