var request =  require("request");
var apiai = require("apiai");

var api = apiai("7433fe3c52d24fe18ab37483aadb517a");
var callSendAPI = require("./callSendApi");
var msgControllermodule = require("./msgController")

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
        request({
          url:"https://prixie-api.herokuapp.com/tutorial_urls/"+url,
          method:'Get',
        },function(error,res){

        var data = JSON.parse(res.body);
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
      }else if(response.result.parameters.tutorials)
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
