var receivedMessage = require("./receivedMessage");
module.exports = function(event){
  console.log(event);
  if (event.postback) {
    console.log(event.postback);
  }
  else if (event.message) {
    receivedMessage(event);
    console.log("logging event object");
    console.log(event);
  }
}
