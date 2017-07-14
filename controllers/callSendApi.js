var request = require("request");
//var token="EAACHuWOOEu4BAIAEpfIELBhs63ExhJNZARLGrwCChkteb3arwFHTJ2i9ZBrDKc175HwEy3MrM1n55Y68QEQ3XjUyveljluZAVlxOyhnxayo4Bu445p2YTZA02rbnUUyoZAZAHNdSuNXNYb5mx2rZAeOBSKYfSoHfyGcqV7L4bdf6wZDZD";

var token = "EAAWm6bJnXK4BAK4DWyZCL6IXaroDjmCsYNTuZBzovVvE8si1qHb0VgjNoZASHb5ZCaWU5pe2yUUcOlMTbZBumneeOo1274KteTsL4rrPAVIskaaHQ2hyXrO3GC7AG4IxtbtnFOGygVUnbiKVUFe7XhOoeZBWq9hpgXrABkswKrZCrdlpMYAL1gs";
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
