var callSendAPI = require("./callSendApi")
module.exports = function(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    "message":{
        "attachment":{
          "type":"image",
          "payload":{
            "url":"https://image.ibb.co/hPbfqv/zimage.jpg"
          }
        }
      }
}
    callSendAPI(messageData);
}
