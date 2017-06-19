var receivedMessage = require("./receivedMessage");
var callSendAPI = require("./callSendApi");
module.exports = function(event){
  console.log(event);
  if (event.postback) {
    console.log(event.postback);
    if (event.postback.payload == "GET_STARTED_PAYLOAD") {
      var messageData ={
  "recipient":{
    "id":event.sender.id
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"welcome to interview_schedules",
            "image_url":"https://preview.ibb.co/mSwUOQ/interview.png",
            "subtitle":"We\'ve got the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://preview.ibb.co/doe5xk/tutorials.jpg",
              "messenger_extensions": true,
              "webview_height_ratio": "tall",
              "fallback_url": "https://image.ibb.co/hPbfqv/zimage.jpg"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://image.ibb.co/hPbfqv/zimage.jpg",
                "title":"View Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"DEVELOPER_DEFINED_PAYLOAD"
              }
            ]
          }
        ]
      }
    }
  }
}

callSendAPI(messageData);

    }


  }
  else if (event.message) {
    receivedMessage(event);
    console.log("logging event object");
    console.log(event);
  }
}
