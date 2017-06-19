var request =  require("request");
var sendTextMessage = require("./sendTextMessage");
var sendAttachmentMessage = require("./sendAttachmentMessage");
module.exports = function(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  if (message.quick_reply && !isNaN(message.quick_reply.payload)) {
    messageText = "";
    var paystart = message.quick_reply.payload;
    console.log(paystart);
    var payend = parseInt(paystart)+5;
    console.log(payend);
  var data1 = "";

    request({
      url:"https://prixie-api.herokuapp.com/interview_schedules/"+paystart+"/"+payend,
      method:"Get"
    },function(error,res){
      var today = JSON.parse(res.body);

      for (var i = 0; i < today.length; i++) {
        data1 = data1+(today[i].company+":\n http://todaywalkins.com/"+today[i].website+"\n\n");
      }
    console.log(data1);
    var messageData = {
        "recipient":{
            "id":senderID
            },
            "message":{
              "text":data1,
              "quick_replies":[
                {
                  "content_type":"text",
                  "title":"more",
                  "payload":payend
                }
              ]
            }
          };
          callSendAPI(messageData);
    });
  }
  if (messageText) {
        sendTextMessage(senderID, messageText);
    } else if (messageAttachments) {
      console.log("attachment came");
      sendAttachmentMessage(senderID, messageText);
    }
}
