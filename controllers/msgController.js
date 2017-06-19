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
            "title":"Welcome to Interview Schedules",
            "image_url":"https://preview.ibb.co/mSwUOQ/interview.png",
            "subtitle":"@Interviews",
            "buttons":[
              {
                "type":"postback",
                "title":"Interviews",
                "payload":"interview_schedules"
              },
            ]
          },
          {
           "title":"Welcome to Tutorials",
           "image_url":"https://preview.ibb.co/doe5xk/tutorials.jpg",
           "subtitle":"@Tutorials",
           "buttons":[
             {
               "type":"postback",
               "title":"Tutorials",
               "payload":"Tutorials"
             },
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
