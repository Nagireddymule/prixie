var request = require("request");
module.exports.adaptTutorialsList = function(suburl,callback){
      request({
        url:"https://prixie-api.herokuapp.com/"+suburl,
        method:"Get"
      },function(error,response){
        if(error) throw error;
        var tutList = JSON.parse(response.body);
        var tutListArray = [];
        for (var i = 0; i < 10; i++) {
          tutListArray.push({"content_type":"text","title":tutList[i].title,"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"})
        }
        var tutListArrayData = JSON.stringify(tutListArray);
        return callback(tutListArrayData);
      });
}

module.exports.adaptTutorial = function(suburl,callback){
  request({
    url:"https://prixie-api.herokuapp.com/tutorial_urls/"+suburl,
    method:"Get"
  },function(error,response){
    if(error) throw error;
    var data = JSON.parse(response.body);
    var textmsg = data.urls[0];
    return callback(textmsg);
  });
}
