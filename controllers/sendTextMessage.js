var request =  require("request");
var apiai = require("apiai");

var api = apiai("34959a387b7540929f81521d84577970");
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
                if (response.result.parameters) {
                  console.log("parameters arrived");
                }else {
                  msgControllermodule.getInterviewSchedules(recipientId);
                }



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

});//closing of apiai msg.on(response) function
  msg.on('error', function(error) {
    console.log(error);
  });
  msg.end();
}
