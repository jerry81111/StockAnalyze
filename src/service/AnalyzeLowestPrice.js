const monthHistory = require("../dao/MonthHistory.js");

/* async function analyzeLowestPrice(stockNo) {
  monthHistory.findByCode(stockNo), function(err, docs) {
    let lowestPriceArr = [];
    docs.forEach(doc =>
      doc.data.forEach(data => {
        lowestPriceArr.push(parseFloat(data[6]));
      })
    )
    return Math.min(...lowestPriceArr);
  }
}
 */

async function analyzeLowestPrice(stockNo) {
  return new Promise((resolve, reject) => {
    monthHistory.findByCode(stockNo, function(err, docs) {
      if (err) return reject(err);
      resolve(getLowestPrice(docs));
    });
  });
}

function getLowestPrice(docs) {
  let lowestPriceArr = [];
  docs.forEach(doc =>
    doc.data.forEach(data => {
      lowestPriceArr.push(parseFloat(data[6]));
    })
  );
  return Math.min(...lowestPriceArr);
}

module.exports = async function() {
  return await analyzeLowestPrice(stockNo);
};
