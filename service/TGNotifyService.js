var request = require("request");

var token = "980385678:AAGLtvuYgjmKYB0pNSJ_3Cam80b6vrPaSbQ";
var chatId = -1001153524741;

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
    .then(function(body1) {})
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
