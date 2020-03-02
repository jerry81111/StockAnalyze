const monthHistory = require("../dao/MonthHistory.js");

function getLowestPrice() {
  monthHistory.findByCode(2330, function(err, docs) {
    console.log(analyzeLowestPrice(docs)) ;
  });
}

function analyzeLowestPrice(docs) {
  let lowestPriceArr = [];
  docs.forEach(doc =>
    doc.data.forEach(data => {
      lowestPriceArr.push(parseFloat(data[6]));
    })
  );
  return Math.min(...lowestPriceArr);
}

module.exports = {getLowestPrice:function(){getLowestPrice()}};
