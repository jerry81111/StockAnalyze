const request = require("request");

const token = "980385678:AAGLtvuYgjmKYB0pNSJ_3Cam80b6vrPaSbQ";
/* const chatId = -339208335; */
const chatId = -1001486015796;

function notifyMsg(msg) {
  var url =
    "https://api.telegram.org/bot" +
    token +
    "/sendMessage?chat_id=" +
    chatId +
    "&text=" +
    encodeURI(msg);
  console.log(url);

  getRequest(url)
    .catch(function(error) {
      console.log(error);
    });
}

function getRequest(url) {
  return new Promise(function(success, failure) {
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        success(body);
      } else {
        failure(error);
      }
    });
  });
}

notifyMsg("白哥要陸化囉 打尛簡體字");