var receivedMessage = require("./receivedMessage");
module.exports = function(event){
  console.log(event);
  if (event.postback.payload == "Get_Started_Payload") {
    console.log("getstart");
  }
  else if (event.message) {
    receivedMessage(event);
    console.log("logging event object");
    console.log(event);
  }
}
