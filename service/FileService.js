const fs = require("fs");

async function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", async (err, input) => {
      if (err) return reject(err);
      resolve(input);
    });
  });
}

module.exports ={
    readFile:async function(filePath) {
        return await readFilePromise(filePath); 
      }      
} 