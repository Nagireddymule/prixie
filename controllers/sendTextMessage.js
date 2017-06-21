var request =  require("request");
var apiai = require("apiai");

var api = apiai("7433fe3c52d24fe18ab37483aadb517a");
var callSendAPI = require("./callSendApi");
var msgControllermodule = require("./msgController")
var adaptTutorials = require("../adapters/adaptTutorials");

module.exports = function(recipientId, messageText) {
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
            adaptTutorials.adaptTutorial(url,function(callback){
              var messageData ={
  "recipient":{
    "id":recipientId
  },
  "message":{
    "attachment":{
      "type":"video",
      "payload":{
        "url":"https://youtu.be/Cfd9DOnuF9w"
      }
    }
  }
};



            /*  var messageData = {
                recipient: {
                  id: recipientId
                },
                message: {
                    text: callback
                  }
              };*/
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
