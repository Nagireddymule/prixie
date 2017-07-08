var request =  require("request");
var apiai = require("apiai");


//var api = apiai("7433fe3c52d24fe18ab37483aadb517a");
var api = apiai("34959a387b7540929f81521d84577970");
//var api = apiai("0234db581fca4495b6b48d02cae74333");
var callSendAPI = require("./callSendApi");
var msgControllermodule = require("./msgController")
var adaptTutorials = require("../adapters/adaptTutorials");

module.exports = function(recipientId, messageText) {
  var msg = api.textRequest(messageText, {
      sessionId: 'recipientId'
  });

  msg.on('response', function(response) {
            console.log(response);
            if (response.result.action) {
              if (response.result.action == "Tutorials") {
                console.log("action catched in Tutorials");
                if (response.result.parameters.Subject) {
                  console.log("action catched in Tutorials as subject");
                  var url = response.result.parameters.Subject;
                  adaptTutorials.adaptTutorial(url,function(callback){
                    var messageData ={
                      "recipient":{
                        "id":recipientId
                      },
                      "message":{
                        "attachment":{
                          "type":"template",
                          "payload":{
                            "template_type":"open_graph",
                            "elements":[
                              {
                                "url":callback,

                              }
                            ]
                          }
                        }
                      }
                    }
                    callSendAPI(messageData);
                  });
                }else {
                  msgControllermodule.getTutorialList(recipientId);
                }
              }
              else if (response.result.action == "InterviewSchedule") {
                console.log("action catched in InterviewSchedule");
                var params = response.result.parameters;
                 var company = params.company;
                 var date = params.date;
                 var Job_Role = params.Job_Role;
                 var subject = params.Subject;
                 var experience = params.Experience;
                 if (!date&&!Job_Role&&!experience&&!company&&!subject) {
                   console.log("no params");
                   msgControllermodule.getAllInterviewSchedules(recipientId);
                 }
                 else{
                    console.log("from parameters block");
                    if (!date&&Job_Role&&!experience) {
                      console.log("only jobrole param");
                      var role = Job_Role;
                      var suburl = "get_walkins_by_jobrole/"+Job_Role+"/0";
                      msgControllermodule.getFilterInterviewSchedulesByRole(suburl,role,recipientId);
                    }





                    if (date&&!Job_Role&&!experience) {
                      console.log("only date param");
                      if (date.From&&date.To) {
                        var suburl = "get_walkins_by_date/"+date.From+"/"+date.To;
                    //    msgControllermodule.getFilterInterviewSchedulesByDate(suburl,recipientId);
                      }
                      else {
                        console.log(date);
                        var suburl = "get_walkins_by_Walk_In_date/"+date;
                        msgControllermodule.getFilterInterviewSchedulesByDate(suburl,date,recipientId);
                      }
                    }
                    if (!date&&!Job_Role&&experience) {
                      console.log("only experience param " +experience);
                      if (experience == "freshers") {
                        console.log("exp as fresher");
                        var suburl = "get_walkins_by_ExperienceIndex/0/1"
                        msgControllermodule.getFilterInterviewSchedulesByExpFresher(suburl,recipientId);
                      }else if (experience == !isNaN) {
                        console.log("exp as number");
                      //  msgControllermodule.getFilterInterviewSchedulesByDate(experience,recipientId);
                      }
                      else {
                        var expmin = params.Experience.min;
                        var expmax = params.Experience.max;
                        if (expmax) {
                          console.log("min and max");
                        //  msgControllermodule.getFilterInterviewSchedulesByDate(expmin,expmax,recipientId);
                        }else {
                          console.log("min only");
                        //  msgControllermodule.getFilterInterviewSchedulesByDate(expmin,recipientId);
                        }
                      }

                    }
                 }


              //  msgControllermodule.getInterviewSchedules(recipientId);

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

  }
  else {
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
}
