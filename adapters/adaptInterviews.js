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

module.exports.adaptAllSchedules = function(suburl,callback){
  request({
    url:"https://prixie-api.herokuapp.com/get_walkins_All/"+suburl,
    method:"Get"
  },function(error,res){
    if(error) throw err;
    if (res.body == "") {
      return callback("No records found");
    }
    var responseData = JSON.parse(res.body);
    //console.log(responseData);
    console.log("from adapter");
    var dataFormat = "";
      function getSal(){
            if (responseData.Salary) {
              return responseData.Salary;
            }else {
              return "Not Mentioned";
            }
      }
      function getExp(){
        if (responseData.Experience.min&&responseData.Experience.max) {
          return responseData.Experience.min+"-"+responseData.Experience.max+" Years";
        }else {
          return responseData.Experience.min+" Years";
        }
      }
      function getWalkin(){
        if (responseData.Walk_In_date.From&&responseData.Walk_In_date.To) {
          return responseData.Walk_In_date.From+" to "+responseData.Walk_In_date.To;
        }else if (responseData.Walk_In_date == "") {
          return "ASAP";
        }else {
          return responseData.Walk_In_date;
        }
      }
      function getTime(){
        if (responseData.Walk_In_Time == "") {
          return "9:00AM to 5:00PM"
        }
        else {
          return responseData.Walk_In_Time;
        }
      }
      dataFormat = ("Company     : "+responseData.company+"\nWebsite       : "+responseData.Website+"\nJob Role       : "+responseData.Job_Role+"\nEligibility      : "+responseData.Eligibility+"\nExperience   : "+getExp()+"\nSalary           : "+getSal()+"\nJob Location: "+responseData.Job_location+"\nWalkin Date : "+getWalkin()+"\nWalkin Time : "+getTime());
    return callback(dataFormat);
  });
}

module.exports.adaptFilterSchedules = function(suburl,callback){
  //console.log(suburl);
  request({
    url:"https://prixie-api.herokuapp.com/"+suburl,
    method:"Get"
  },function(error,res){
    if(error) throw err;
    if (res.body == "") {
      return callback("No records found");
    }
    var responseData = JSON.parse(res.body);
    console.log(res.body);
    var dataFormat = "";
      function getSal(){
            if (responseData.Salary) {
              return responseData.Salary;
            }else {
              return "Not Mentioned";
            }
      }
      function getExp(){
        console.log(responseData.Experience);
        if (responseData.Experience.min&&responseData.Experience.max) {
          return responseData.Experience.min+"-"+responseData.Experience.max+" Years";
        }else {
          return responseData.Experience.min+" Years";
        }
      }
      function getWalkin(){
        if (responseData.Walk_In_date.From&&responseData.Walk_In_date.To) {
          return responseData.Walk_In_date.From+" to "+responseData.Walk_In_date.To;
        }else if (responseData.Walk_In_date == "") {
          return "ASAP";
        }else {
          return responseData.Walk_In_date;
        }
      }
      function getTime(){
        if (responseData.Walk_In_Time == "") {
          return "9:00AM to 5:00PM"
        }
        else {
          return responseData.Walk_In_Time;
        }
      }
      dataFormat = ("Company     : "+responseData.company+"\nWebsite       : "+responseData.Website+"\nJob Role       : "+responseData.Job_Role+"\nEligibility      : "+responseData.Eligibility+"\nExperience   : "+getExp()+"\nSalary           : "+getSal()+"\nJob Location: "+responseData.Job_location+"\nWalkin Date : "+getWalkin()+"\nWalkin Time : "+getTime());
    return callback(dataFormat);
    //console.log(dataFormat);
  });
}
