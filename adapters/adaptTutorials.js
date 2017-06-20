var request = require("request");
module.exports.adaptTutorial = function(suburl,callback){
request({
  url:"https://prixie-api.herokuapp.com/"+suburl,
  method:"Get"
},function(error,response){
if(error) throw error;
var tutList = JSON.parse(res.body);
var tutListArray = [];
for (var i = 0; i < 10; i++) {
  listarr.push({"content_type":"text","title":tutListArray[i].title,"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"})
}
var tutListArrayData = JSON.stringify(tutListArray);
return callback(tutListArrayData);

});

}
