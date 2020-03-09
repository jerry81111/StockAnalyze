const mongoose = require("mongoose");

mongoose.pluralize(null);
mongoose.connect("mongodb://192.168.56.1:27017/stock", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on("error", err => {
  console.error(err);
});
db.once("open", db => {
  console.log("Connected to MongoDB");
});

module.exports = mongoose;

