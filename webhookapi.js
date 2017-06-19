var express = require("express");
var request = require("request");
var bodyParser = require('body-parser');
var apiai = require("apiai");
var callSendAPI = require("./callSendApi");

var api = apiai("7433fe3c52d24fe18ab37483aadb517a");

var app = express();
app.set('port',(process.env.PORT||5000));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/',function(req,res){
    res.send("webhook is working .......");
})


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
          console.log("logging event object");
        //  console.log(event);
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
  if (message.quick_reply && !isNaN(message.quick_reply.payload)) {
    //console.log("in quick_reply");
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

          //console.log(messageData);
          callSendAPI(messageData);
    });
  }

  var messageAttachments = message.attachments;
  if (messageText) {
    //console.log("text message came");
    //console.log(messageText);
        sendTextMessage(senderID, messageText);
    } else if (messageAttachments) {
      console.log("attachment came");
      sendAttachmentMessage(senderID, messageText);
    }
}//closing of receivedMessage function
//for response as a text
function sendTextMessage(recipientId, messageText) {
  var msg = api.textRequest(messageText, {
      sessionId: 'recipientId'
  });

  msg.on('response', function(response) {
    console.log("parameters object log");
    //console.log(response.result.parameters);
    if (response.result.parameters.tutorials||response.result.parameters.subject) {
        console.log("got parameter");
        if (response.result.parameters.subject) {
        var url =response.result.parameters.subject;
        request({
          url:"https://prixie-api.herokuapp.com/tutorial_urls/"+url,
          method:'Get',
        },function(error,res){

        var data = JSON.parse(res.body);
        //console.log(data);
        var textmsg = data.urls[0];
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
        }else
        {
          request({
              url:"https://prixie-api.herokuapp.com/tutorials_list",
              method:"get"
          },function(error,res){
            var tutlist = JSON.parse(res.body);
            var listarr = [];
            for (var i = 0; i < 10; i++) {
          listarr.push({"content_type":"text","title":tutlist[i].title,"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"})
          }
            var listarrdata = JSON.stringify(listarr);
            var messageData ={
              "recipient":{
                "id":recipientId
              },
                "message":{
                  "text":"Choose a tutorial:",
                  "quick_replies":listarrdata
                }
              }
              callSendAPI(messageData);
          });

        }

      }
      if(response.result.parameters.schedule) {
        console.log("parameter came as schedule");
        request({
          url:"https://prixie-api.herokuapp.com/interview_schedules/0/5",
          method:"Get"
        },function(error,res){
          var today = JSON.parse(res.body);
          var data1 = "";
          for (var i = 0; i < today.length; i++) {
            data1 = data1+(today[i].company+":\n http://todaywalkins.com/"+today[i].website+"\n\n");
          }
            var messageData = {
                "recipient":{
                    "id":recipientId
                    },
                    "message":{
                      "text":data1,
                      "quick_replies":[
                        {
                          "content_type":"text",
                          "title":"more",
                          "payload":"5"
                        }
                      ]
                    }
                  };
                  callSendAPI(messageData);
        });

      }

    else {
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

  });//closing of apiai msg.on(response) function
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


app.listen(app.get('port'),function(){
console.log("webhook is running on port "+app.get('port'));
})
