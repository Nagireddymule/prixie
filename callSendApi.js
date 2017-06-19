var request = require("request")
module.exports = function(messageData) {
  console.log(messageData);
  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.log(body);
    }
  });
}
