var request =  require("request");

var sendTextMessage = require("./sendTextMessage");
var sendAttachmentMessage = require("./sendAttachmentMessage");
var callSendAPI = require("./callSendApi");
var msgControllermodule = require("./msgController");

module.exports.receivedMessage = function(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  if (messageText) {
    if (messageText == "home") {
      msgControllermodule.getStartMenu(senderID);
    }else {
        sendTextMessage(senderID, messageText);
      }
    }
  else if (messageAttachments) {
      console.log("attachment came");
      sendAttachmentMessage(senderID, messageText);
    }
}
