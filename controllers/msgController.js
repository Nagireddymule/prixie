var request = require("request");
var messageReceived = require("./receivedMessage");
var callSendAPI = require("./callSendApi");
var adaptInterviews = require("../adapters/adaptInterviews");


module.exports.msgController= function(event){
  var senderid = event.sender.id;
  console.log("event log starts here");
  console.log(event);
  console.log("event log ends here");
  if (event.postback) {
    console.log(event.postback);
    if (event.postback.payload == "GET_STARTED_PAYLOAD") {
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
  else if (event.message) {
    messageReceived.receivedMessage(event);
    console.log("logging event object");
    console.log(event);
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
            "id":senderid
          },
          "message":{
          "text":"Choose a tutorial:",
          "quick_replies":listarrdata
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
