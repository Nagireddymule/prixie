var request =  require("request");
var apiai = require("apiai");
var msgControllermodule = require("./msgController")

var api = apiai("7433fe3c52d24fe18ab37483aadb517a");
var callSendAPI = require("./callSendApi");


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
        //console.log(data);
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
        }else
        {
          msgControllermodule.getTutorialList(recipientId);
          /*request({
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
                "id":recipientId
              },
                "message":{
                  "text":"Choose a tutorial:",
                  "quick_replies":listarrdata
                }
              }
              callSendAPI(messageData);
          });*/

        }

      }
      if(response.result.parameters.schedule) {
        console.log("parameter came as schedule");
        msgControllermodule.getInterviewSchedules(recipientId);
        /*request({
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
                    "id":recipientId
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
        });*/

      }

    else {
      console.log("no parameters");
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
