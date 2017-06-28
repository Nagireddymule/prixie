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
            console.log("parameters object log");
            console.log(response.result.parameters);
    if (response.result.parameters.tutorials||response.result.parameters.subject) {
                  console.log("got parameter");
        if (response.result.parameters.subject) {
            var url =response.result.parameters.subject;
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

        } else if(response.result.parameters.tutorials)
          {
          msgControllermodule.getTutorialList(recipientId);
          }

      }
      if(response.result.parameters.schedule) {
        msgControllermodule.getInterviewSchedules(recipientId);
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
