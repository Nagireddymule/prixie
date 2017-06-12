var express = require("express");
var request = require("request");
var bodyParser = require('body-parser');

var app = express();
app.set('port',(process.env.PORT||5000));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/',function(req,res){
    res.send("webhook is working .......");
})

var token="EAACHuWOOEu4BAIAEpfIELBhs63ExhJNZARLGrwCChkteb3arwFHTJ2i9ZBrDKc175HwEy3MrM1n55Y68QEQ3XjUyveljluZAVlxOyhnxayo4Bu445p2YTZA02rbnUUyoZAZAHNdSuNXNYb5mx2rZAeOBSKYfSoHfyGcqV7L4bdf6wZDZD";

app.get('/webhook/', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "prixieverificationtoken") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;
  console.log("req body"+JSON.stringify(data));
  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;
      entry.messaging.forEach(function(event) {
        if (event.message.text) {
          receivedMessage(event);
        }
        else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
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

    }
  });
}







app.listen(app.get('port'),function(){
console.log("webhook is running on port "+app.get('port'));
})
