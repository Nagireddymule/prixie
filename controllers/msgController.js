var request = require("request");
var messageReceived = require("./receivedMessage");
var sendTextMessage = require("./sendTextMessage");
var callSendAPI = require("./callSendApi");
var adaptInterviews = require("../adapters/adaptInterviews");
var adaptTutorials = require("../adapters/adaptTutorials");


module.exports.msgController= function(event){
  var senderid = event.sender.id;
  //console.log("event log starts here");
  console.log(event);
  //console.log("event log ends here");
  if (event.postback) {
    console.log(event.postback);
    if (event.postback.payload == "GET_STARTED_PAYLOAD") {
      sendTextMessage(senderID, "hi");
        this.getStartMenu(senderid);
    }
    if (event.postback.payload == "interview_schedules") {
      this.getInterviewSchedules(senderid);
    }
    if (event.postback.payload == "Tutorials") {
       this.getTutorialList(senderid);
    }
    if (!isNaN(event.postback.payload)) {
      console.log("payload came as number");
      this.getNextCompany(event);
    }

  }
  else if (event.message){
    messageReceived.receivedMessage(event);
  //  console.log("logging event object");
  //  console.log(event);
  }
}
module.exports.getStartMenu = function(senderid){
    var messageData ={
      "recipient":{
        "id":senderid
      },
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
              {
                "title":"Welcome to Interview Schedules",
                "image_url":"https://preview.ibb.co/e8Mdk5/interview.jpg",
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
                "image_url":"https://preview.ibb.co/dyONdQ/tutorial.jpg",
                "subtitle":"@Tutorials",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Tutorials",
                    "payload":"Tutorials"
                  },
                ]
              },
              {
                "title":"Companies Information",
                "image_url":"https://image.ibb.co/dJx23Q/companies.jpg",
                "subtitle":"@Details of Companies selection process",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Companies Information",
                    "payload":"Company_Info"
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
module.exports.getInterviewSchedules = function(senderid){
      adaptInterviews.adaptSchedule("0/5",function(callback){
        var messageData = {
          "recipient":{
            "id":senderid
          },
          "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":callback,
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Click here for more",
                    "payload":"5"
                  },
                  {
                    "type":"postback",
                    "title":"Home",
                    "payload":"GET_STARTED_PAYLOAD"
                  },
                ]
              }
            }
          }
        };
        callSendAPI(messageData);
      });

}
module.exports.getTutorialList = function(senderid){
      adaptTutorials.adaptTutorialsList("tutorials_list",function(callback){
          var messageData = {
            "recipient":{
              "id":senderid
            },
            "message":{
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":callback
                }
              }
            }
          }

        callSendAPI(messageData);
      });
}
module.exports.getNextCompany = function(event){
  var senderid = event.sender.id;
  var indexstart = event.postback.payload;
  console.log(indexstart);
  var indexend = parseInt(indexstart)+5;
  console.log(indexend);
  var suburl = indexstart+"/"+indexend;
  adaptInterviews.adaptSchedule(suburl,function(callback){
    var messageData = {
      "recipient":{
        "id":senderid
      },
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":callback,
            "buttons":[
              {
                "type":"postback",
                "title":"Click here for more",
                "payload":indexend
              },
              {
                "type":"postback",
                "title":"Home",
                "payload":"GET_STARTED_PAYLOAD"
              },
            ]
          }
        }
      }
    };
    callSendAPI(messageData);
  });

}
module.exports.getFilterInterviewSchedules = function(myurl,senderid ){
        adaptInterviews.adaptFilterSchedule(myurl,function(callback){
          var messageData = {
            "recipient":{
              "id":senderid
            },
            "message":{
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":callback,
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Click here for more",
                      "payload":"5"
                    },
                    {
                      "type":"postback",
                      "title":"Home",
                      "payload":"GET_STARTED_PAYLOAD"
                    },
                  ]
                }
              }
            }
          };
          callSendAPI(messageData);
        });
}
