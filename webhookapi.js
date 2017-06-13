var express = require("express");
var request = require("request");
var bodyParser = require('body-parser');
var apiai = require("apiai");

var api = apiai("7433fe3c52d24fe18ab37483aadb517a");

var app = express();
app.set('port',(process.env.PORT||5000));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/',function(req,res){
    res.send("webhook is working .......");
})

var token="EAACHuWOOEu4BAIAEpfIELBhs63ExhJNZARLGrwCChkteb3arwFHTJ2i9ZBrDKc175HwEy3MrM1n55Y68QEQ3XjUyveljluZAVlxOyhnxayo4Bu445p2YTZA02rbnUUyoZAZAHNdSuNXNYb5mx2rZAeOBSKYfSoHfyGcqV7L4bdf6wZDZD";

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'prixieverificationtoken') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
  });

app.post('/webhook', function (req, res) {
  var data = req.body;
  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
          console.log(event);
        }
      });
    });
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  if (messageText) {

        sendTextMessage(senderID, messageText);

  } else if (messageAttachments) {

      sendAttachmentMessage(senderID, messageText);
    }
}
//for response as a text
function sendTextMessage(recipientId, messageText) {

  var msg = api.textRequest(messageText, {
      sessionId: 'recipientId'
  });

  msg.on('response', function(response) {
    if (response.result.parameters.documents) {
      console.log("got parameter");
    }else {
      console.log("no parameters");
    }









      var textmsg = response.result.fulfillment.speech;
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
            text: textmsg
          }
      };
      callSendAPI(messageData);
  });
  msg.on('error', function(error) {
    console.log(error);
  });
  msg.end();
}
//for response as an attachments
function sendAttachmentMessage(recipientId, messageText) {
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


function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.log(body);
    }
  });
}
app.listen(app.get('port'),function(){
console.log("webhook is running on port "+app.get('port'));
})
