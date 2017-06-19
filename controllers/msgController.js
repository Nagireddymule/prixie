var receivedMessage = require("./receivedMessage");
module.exports = function(event){
  console.log(event);
  if (event.postback.payload) {
    console.log(event.postback.payload);
  }
  else if (event.message) {
    receivedMessage(event);
    console.log("logging event object");
    console.log(event);
  }
}
