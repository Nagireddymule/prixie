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
    console.log(response.result.parameters);
    if (response.result.parameters.tutorials||response.result.parameters.subject) {
        console.log("got parameter");
        if (response.result.parameters.subject) {
        var url =response.result.parameters.subject;
        request({
          url:"https://prixie-api.herokuapp.com/tutorial_urls/"+url,
          method:'Get',
        },function(error,res){
        //  var data = JSON.parse(res.body);
        console.log(res.body);
        });
        }else
        {
        var messageData = {
        "recipient":{
          "id":recipientId
        },
        "message":[{
      "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button",
          "text":"choose a subject?",
          "buttons":[
            {
              "type":"postback",
              "title":"java",
              "payload":"USER_DEFINED_PAYLOAD"
            },
            {
              "type":"postback",
              "title":".net",
              "payload":"USER_DEFINED_PAYLOAD"
            },
            {
              "type":"postback",
              "title":"javascript",
              "payload":"USER_DEFINED_PAYLOAD"
            },
            /*{
              "type":"web_url",
              "url":"https://petersapparel.parseapp.com",
              "title":"Show Website"
            }*/
          ]
        }
      }
    },{
  "attachment":{
    "type":"template",
    "payload":{
    "template_type":"button",
      "text":"choose a subject?",
      "buttons":[
        {
          "type":"postback",
          "title":"java",
          "payload":"USER_DEFINED_PAYLOAD"
        },
        {
          "type":"postback",
          "title":".net",
          "payload":"USER_DEFINED_PAYLOAD"
        },
        {
          "type":"postback",
          "title":"javascript",
          "payload":"USER_DEFINED_PAYLOAD"
        },

        /*{
          "type":"web_url",
          "url":"https://petersapparel.parseapp.com",
          "title":"Show Website"
        }*/
      ]
    }
  }
}
]

        /*
        "message":{
          "text":"choose a subject:",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"java",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
              "content_type":"text",
              "title":"javascript",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
              "content_type":"text",
              "title":".net",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
              "content_type":"text",
              "title":"php",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
              "content_type":"text",
              "title":"nodejs",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
          ]
        }*/
        }
      }
callSendAPI(messageData);
    }else {
      console.log("no parameters");
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
    }
  });
  msg.on('error', function(error) {
    console.log(error);
  });
  msg.end();
}//closing sendTextMessage function
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
