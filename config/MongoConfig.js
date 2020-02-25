const mongoose = require("mongoose");

mongoose.pluralize(null);
mongoose.connect("mongodb://192.168.56.1:27017/stock");
const db = mongoose.connection;
db.on("error", err => {
  console.error(err);
});
db.once("open", db => {
  console.log("Connected to MongoDB");
});

var Schema = mongoose.Schema;

var monthHistorySchema = new Schema({
  code: Number,
  name: String,
  date: String,
  data: Object
});

var monthHistory = mongoose.model("month_history", monthHistorySchema);

module.exports = {
  findLastDate: function(callback) {
    monthHistory.find({},null,{sort:{ date: -1 },limit:1},function(err, docs) { 
      callback(err, docs);
    });
  },
  model: monthHistory
};

