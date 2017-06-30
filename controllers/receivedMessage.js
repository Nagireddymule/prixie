var request =  require("request");

var sendTextMessage = require("./sendTextMessage");
var sendAttachmentMessage = require("./sendAttachmentMessage");
var callSendAPI = require("./callSendApi");

module.exports.receivedMessage = function(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;

  if (event.postback){
    if (event.postback.payload == "GET_STARTED_PAYLOAD") {
      sendTextMessage(senderID, "hi");
    }

  }
  if (event.message) {
    var messageText = message.text;
    var messageAttachments = message.attachments;
    else if (messageText) {
          sendTextMessage(senderID, messageText);
      }
    else if (messageAttachments) {
        console.log("attachment came");
        sendAttachmentMessage(senderID, messageText);
      }
    }
  }

}
