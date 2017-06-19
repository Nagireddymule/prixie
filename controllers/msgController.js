var request = require("request");
var receivedMessage = require("./receivedMessage");
var callSendAPI = require("./callSendApi");
module.exports = function(event){
  console.log(event);
  if (event.postback) {
    console.log(event.postback);
    if (event.postback.payload == "GET_STARTED_PAYLOAD") {
        getStartMenu(event);
    }
    if (event.postback.payload == "interview_schedules") {
      getInterviewSchedules(event);
    }
  }
  else if (event.message) {
    receivedMessage(event);
    console.log("logging event object");
    console.log(event);
  }
}


 function getStartMenu(event){
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
    console.log("from getstart function");
    callSendAPI(messageData);
  }
function getInterviewSchedules(event){
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
              "id":event.sender.id
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
