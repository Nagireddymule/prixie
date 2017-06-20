var request = require("request");
module.exports.adaptSchedule = function(suburl,callback){
  request({
    url:"https://prixie-api.herokuapp.com/interview_schedules/"+suburl,
    method:"Get"
  },function(error,res){
    if(error) throw err;
    var responseData = JSON.parse(res.body);
    var dataFormat = "";
    for (var i = 0; i < responseData.length; i++) {
      dataFormat = dataFormat+(responseData[i].company+":\n http://todaywalkins.com/"+responseData[i].website+"\n\n");
    }
    return callback(dataFormat);
  });
}
