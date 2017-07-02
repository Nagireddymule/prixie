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
    var responseData = JSON.parse(res.body);
    console.log(responseData);
    var dataFormat = "";
    for (var i = 0; i < responseData.length; i++) {
      console.log(responseData[i]);
      function getSal(){
            if (responseData[i].Salary) {
              console.log("Salary given");
              return responseData[i].Salary;
            }else {
              console.log("Salary not given");
              return "Not Mentioned";
            }
      }
      function getExp(){
        if (responseData[i].Experience.min&&responseData[i].Experience.max) {
          return responseData[i].Experience.min+"-"+responseData[i].Experience.max+" Years";
        }else {
          return responseData[i].Experience.min+" Years";
        }
      }
      function getWalkin(){
        if (responseData[i].Walk_In_date.From&&responseData[i].Walk_In_date.To) {
          return responseData[i].Walk_In_date.From+" to "+responseData[i].Walk_In_date.To;
        }else if (responseData[i].Walk_In_date == "") {
          return "ASAP";
        }else {
          return responseData[i].Walk_In_date;
        }
      }
      function getTime(){
        if (responseData[i].Walk_In_Time == "") {
          return "9:00AM to 5:00PM"
        }
        else {
          return responseData[i].Walk_In_Time;
        }
      }
      dataFormat = ("Company     : "+responseData[i].company+"\nWebsite       : "+responseData[i].Website+"\nJob Role       : "+responseData[i].Job_Role+"\nEligibility      : "+responseData[i].Eligibility+"\nExperience   : "+getExp()+"\nSalary           : "+getSal()+"\nJob Location: "+responseData[i].Job_location+"\nWalkin Date : "+getWalkin()+"\nWalkin Time : "+getTime());
    }
    return callback(dataFormat);
  });
}

module.exports.adaptFilterSchedule = function(suburl,callback){
  console.log(suburl);
  request({
    url:"https://prixie-api.herokuapp.com/"+suburl,
    method:"Get"
  },function(error,res){
    if(error) throw err;
    var responseData = JSON.parse(res.body);
    console.log(responseData);
    var dataFormat = "";
    for (var i = 0; i < responseData.length; i++) {
      console.log(responseData[i]);
      function getSal(){
            if (responseData[i].Salary) {
              console.log("Salary given");
              return responseData[i].Salary;
            }else {
              console.log("Salary not given");
              return "Not Mentioned";
            }
      }
      function getExp(){
        if (responseData[i].Experience.min&&responseData[i].Experience.max) {
          return responseData[i].Experience.min+"-"+responseData[i].Experience.max+" Years";
        }else {
          return responseData[i].Experience.min+" Years";
        }
      }
      function getWalkin(){
        if (responseData[i].Walk_In_date.From&&responseData[i].Walk_In_date.To) {
          return responseData[i].Walk_In_date.From+" to "+responseData[i].Walk_In_date.To;
        }else if (responseData[i].Walk_In_date == "") {
          return "ASAP";
        }else {
          return responseData[i].Walk_In_date;
        }
      }
      function getTime(){
        if (responseData[i].Walk_In_Time == "") {
          return "9:00AM to 5:00PM"
        }
        else {
          return responseData[i].Walk_In_Time;
        }
      }
      dataFormat = ("Company     : "+responseData[i].company+"\nWebsite       : "+responseData[i].Website+"\nJob Role       : "+responseData[i].Job_Role+"\nEligibility      : "+responseData[i].Eligibility+"\nExperience   : "+getExp()+"\nSalary           : "+getSal()+"\nJob Location: "+responseData[i].Job_location+"\nWalkin Date : "+getWalkin()+"\nWalkin Time : "+getTime());
    }
    return callback(dataFormat);
    //console.log(dataFormat);
  });
}
