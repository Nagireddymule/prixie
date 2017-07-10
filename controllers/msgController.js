var request = require("request");
var messageReceived = require("./receivedMessage");
var sendTextMessage = require("./sendTextMessage");
var callSendAPI = require("./callSendApi");
var adaptInterviews = require("../adapters/adaptInterviews");
var adaptTutorials = require("../adapters/adaptTutorials");


module.exports.msgController= function(event){
  var senderid = event.sender.id;
  //console.log("event log starts here");
  console.log(event);
  //console.log("event log ends here");
  if (event.postback) {
    //console.log(event.postback);
    if (event.postback.payload == "GET_STARTED_PAYLOAD") {
      var profile = "";
      request({
        url:"https://graph.facebook.com/v2.6/"+senderid+"?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=EAACHuWOOEu4BAIAEpfIELBhs63ExhJNZARLGrwCChkteb3arwFHTJ2i9ZBrDKc175HwEy3MrM1n55Y68QEQ3XjUyveljluZAVlxOyhnxayo4Bu445p2YTZA02rbnUUyoZAZAHNdSuNXNYb5mx2rZAeOBSKYfSoHfyGcqV7L4bdf6wZDZD",
        method:"Get"
      },function(error,res){
        if (error) console.log("from error log");
        var resbody = JSON.parse(res.body);
        //console.log(resbody);
        console.log(resbody.first_name);
        profile = "💥Hi "+resbody.first_name+" "+resbody.last_name+" welcome to Prixie 💥";
        var messageData = {
        "recipient": {
          "id": senderid
        },
        "message": {
            "text":profile
          }
      };
      callSendAPI(messageData);
      });
      this.getStartMenu(senderid);
    }
    if (event.postback.payload == "GET_STARTED") {
      this.getStartMenu(senderid);
    }
    if (event.postback.payload == "interview_schedules") {
      this.getAllInterviewSchedules(senderid);
    }
    if (event.postback.payload == "Tutorials") {
       this.getTutorialList(senderid);
    }
    if (event.postback.payload == "Company_Info") {
      console.log(event.postback.payload);
      this.getCompanyInfo(senderid);

    }
    if (!isNaN(event.postback.payload)) {
      console.log("payload came as number");
      this.getNextCompanySchedule(event);
    }
    if (event.postback.payload.includes("Role")) {
        console.log(event.postback.payload);
        this.getNextFilterInterviewSchedulesByRole(event);
    }
    if (event.postback.payload.includes("Date")) {
      console.log("Date payload");
    }
    if (event.postback.payload.includes("ExpF")) {
      console.log(event.postback.payload);
      this.getNextFilterInterviewSchedulesByExpFresher(event);
    }
    if (event.postback.payload.includes("Expm")) {
      console.log(event.postback.payload);
      this.getNextFilterInterviewSchedulesByExpm(event);
    }
    if (event.postback.payload.includes("Exp2mm")) {
      console.log(event.postback.payload);
      this.getNextFilterInterviewSchedulesByExpMinMax(event);
    }
    if (event.postback.payload.includes("subject_role")) {
        console.log(event.postback.payload);
        this.getNextFilterInterviewSchedulesByRole_Subject(event);
    }

  }
  else if (event.message){
    messageReceived.receivedMessage(event);
  //  console.log("logging event object");
  //  console.log(event);
  }
}
module.exports.getStartMenu = function(senderid){
    var messageData ={
      "recipient":{
        "id":senderid
      },
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
              {
                "title":"Welcome to Interview Schedules",
                "image_url":"https://preview.ibb.co/e8Mdk5/interview.jpg",
                "subtitle":"@Interviews",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Interviews",
                    "payload":"interview_schedules"
                  },
                ]
              },
              {
                "title":"Welcome to Tutorials",
                "image_url":"https://preview.ibb.co/dyONdQ/tutorial.jpg",
                "subtitle":"@Tutorials",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Tutorials",
                    "payload":"Tutorials"
                  },
                ]
              },
              {
                "title":"Companies Information",
                "image_url":"https://image.ibb.co/dJx23Q/companies.jpg",
                "subtitle":"@Details of Companies selection process",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Companies Information",
                    "payload":"Company_Info"
                  },
                ]
              }
            ]
          }
        }
      }
    }
    console.log("from getstart function");
    callSendAPI(messageData);
  }
module.exports.getTutorialList = function(senderid){
        adaptTutorials.adaptTutorialsList("tutorials_list",function(callback){
            var messageData = {
              "recipient":{
                "id":senderid
              },
              "message":{
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"generic",
                    "elements":callback
                  }
                }
              }
            }

          callSendAPI(messageData);
        });
  }
module.exports.getCompanyInfo = function(senderid){
            adaptInterviews.adaptCompanyInfo("0",function(callback){
              var messageData = {
                "recipient":{
                  "id":senderid
                },
                "message":{
                  "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":callback,
                      "buttons":[
                        {
                          "type":"postback",
                          "title":"Click here for Next",
                          "payload":"Company_Info-0"
                        },
                        {
                          "type":"web_url",
                          "url":"https://prixie-api.herokuapp.com/view_All_Interview_Schedules",
                          "title":"View all Jobs",
                        },
                        {
                          "type":"postback",
                          "title":"Home",
                          "payload":"GET_STARTED"
                        },
                      ]
                    }
                  }
                }
              };
              callSendAPI(messageData);
            });
}

module.exports.getAllInterviewSchedules = function(senderid){
        adaptInterviews.adaptAllSchedules("0",function(callback){
          var messageData = {
            "recipient":{
              "id":senderid
            },
            "message":{
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":callback,
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Click here for Next",
                      "payload":"0"
                    },
                    {
                      "type":"web_url",
                      "url":"https://prixie-api.herokuapp.com/view_All_Interview_Schedules",
                      "title":"View all Jobs",
                    },
                    {
                      "type":"postback",
                      "title":"Home",
                      "payload":"GET_STARTED"
                    },
                  ]
                }
              }
            }
          };
          callSendAPI(messageData);
        });

  }
module.exports.getNextCompanySchedule = function(event){
  var senderid = event.sender.id;
  var index = event.postback.payload;
  console.log(index);
  var indexNext = parseInt(index)+1;
  console.log(indexNext);
  var suburl = indexNext;
  adaptInterviews.adaptAllSchedules(suburl,function(callback){
    var messageData = {
      "recipient":{
        "id":senderid
      },
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":callback,
            "buttons":[
              {
                "type":"postback",
                "title":"Click here for Next",
                "payload":indexNext
              },
              {
                "type":"web_url",
                "url":"https://prixie-api.herokuapp.com/view_All_Interview_Schedules",
                "title":"View all Jobs",
              },
              {
                "type":"postback",
                "title":"Home",
                "payload":"GET_STARTED"
              },
            ]
          }
        }
      }
    };
    callSendAPI(messageData);
  });

}
module.exports.getFilterInterviewSchedulesByRole = function(suburl,role,senderid ){
        adaptInterviews.adaptFilterSchedules(suburl,function(callback){
          var messageData = {
            "recipient":{
              "id":senderid
            },
            "message":{
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":callback,
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Click here for more",
                      "payload":"Role-"+role+"-0"
                    },
                    {
                      "type":"web_url",
                      "url":"https://prixie-api.herokuapp.com/view_All_Interview_Schedules_By_Job_Role/"+role,
                      "title":"View all Jobs of "+role,
                    },
                    {
                      "type":"postback",
                      "title":"Home",
                      "payload":"GET_STARTED"
                    },
                  ]
                }
              }
            }
          };
          callSendAPI(messageData);
        });
}
module.exports.getNextFilterInterviewSchedulesByRole = function(event){
          var senderid = event.sender.id;
          var s = event.postback.payload;
          var r = /-(.+)-(\d{1,3})$/gi;
          var m = r.exec(s);
          var index = m[0];
          console.log(index);
          var role = m[1];
          console.log("role " +role);
          var index = parseInt(m[2])+1;
          console.log("index "+index);
          var suburl = "get_walkins_by_jobrole/"+role+"/"+index;
          console.log(suburl);
          adaptInterviews.adaptFilterSchedules(suburl,function(callback){
            var messageData = {
              "recipient":{
                "id":senderid
              },
              "message":{
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":callback,
                    "buttons":[
                    {
                    "type":"postback",
                    "title":"Click here for more",
                    "payload":"Role-"+role+"-"+index
                    },
                    {
                      "type":"web_url",
                      "url":"https://prixie-api.herokuapp.com/view_All_Interview_Schedules_By_Job_Role/"+role,
                      "title":"View all Jobs of "+role,
                    },
                    {
                    "type":"postback",
                    "title":"Home",
                    "payload":"GET_STARTED"
                    },
                ]
              }
            }
          }
        };
        callSendAPI(messageData);
      });
}
module.exports.getFilterInterviewSchedulesByDate = function(suburl,date,senderid){
  adaptInterviews.adaptFilterSchedules(suburl,function(callback){
    var messageData = {
      "recipient":{
        "id":senderid
      },
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":callback,
            "buttons":[
              {
                "type":"postback",
                "title":"Click here for more",
                "payload":"Date-"+date+"-0"
              },
              {
                "type":"web_url",
                "url":"https://prixie-api.herokuapp.com/view_All_Interview_Schedules_By_Job_Role/"+date,
                "title":"View all Jobs on "+date,
              },
              {
                "type":"postback",
                "title":"Home",
                "payload":"GET_STARTED"
              },
            ]
          }
        }
      }
    };
    callSendAPI(messageData);
  });
}

module.exports.getFilterInterviewSchedulesByExpFresher = function(suburl,senderid){
                    adaptInterviews.adaptFilterSchedules(suburl,function(callback){
                        var messageData = {
                          "recipient":{
                            "id":senderid
                          },
                          "message":{
                            "attachment":{
                              "type":"template",
                              "payload":{
                                "template_type":"button",
                                "text":callback,
                                "buttons":[
                                  {
                                    "type":"postback",
                                    "title":"Click here for more",
                                    "payload":"ExpF-0"
                                  },
                                  {
                                    "type":"web_url",
                                    "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                                    "title":"View all Jobs of Exp 0years",
                                  },
                                  {
                                    "type":"postback",
                                    "title":"Home",
                                    "payload":"GET_STARTED"
                                  },
                                ]
                              }
                            }
                          }
                        };
                        callSendAPI(messageData);
                      });
}
module.exports.getNextFilterInterviewSchedulesByExpFresher = function(event){
            var senderid = event.sender.id;
            var s =  event.postback.payload;
            var r = /-(\d{1,3})/g;
            var m = r.exec(s);
            var index = parseInt(m[1])+1;
            var suburl = "get_walkins_by_ExperienceIndex/0/"+index;
            adaptInterviews.adaptFilterSchedules(suburl,function(callback){
              var messageData = {
                "recipient":{
                  "id":senderid
                },
                "message":{
                  "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":callback,
                      "buttons":[
                        {
                          "type":"postback",
                          "title":"Click here for more",
                          "payload":"ExpF-"+index
                        },
                        {
                          "type":"web_url",
                          "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                          "title":"View all Jobs of Exp 0years",
                        },
                        {
                          "type":"postback",
                          "title":"Home",
                          "payload":"GET_STARTED"
                        },
                      ]
                    }
                  }
                }
              };
      callSendAPI(messageData);
    });

}
module.exports.getFilterInterviewSchedulesByExp = function(suburl,expmin,senderid){
            adaptInterviews.adaptFilterSchedules(suburl,function(callback){
              var messageData = {
                "recipient":{
                  "id":senderid
                },
                "message":{
                  "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":callback,
                      "buttons":[
                        {
                          "type":"postback",
                          "title":"Click here for more",
                          "payload":"Expm-"+expmin+"-0"
                        },
                        {
                          "type":"web_url",
                          "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                          "title":"View all Jobs of Exp 0years",
                        },
                        {
                          "type":"postback",
                          "title":"Home",
                          "payload":"GET_STARTED"
                        },
                      ]
                    }
                  }
                }
              };
              callSendAPI(messageData);
            });

}
module.exports.getNextFilterInterviewSchedulesByExpm = function(event){
            var senderid = event.sender.id;
            var s =  event.postback.payload;
            var r = /-(.+)-(\d{1,3})$/gi;
            var m = r.exec(s);
            var expm = parseInt(m[1]);
            var index = parseInt(m[2])+1;
            var suburl = "get_walkins_by_ExperienceIndex/"+expm+"/"+index;
            adaptInterviews.adaptFilterSchedules(suburl,function(callback){
              var messageData = {
                "recipient":{
                  "id":senderid
                },
                "message":{
                  "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":callback,
                      "buttons":[
                        {
                          "type":"postback",
                          "title":"Click here for more",
                          "payload":"Expm-"+expm+"-"+index
                        },
                        {
                          "type":"web_url",
                          "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                          "title":"View all Jobs of Exp 0years",
                        },
                        {
                          "type":"postback",
                          "title":"Home",
                          "payload":"GET_STARTED"
                        },
                      ]
                    }
                  }
                }
              };
      callSendAPI(messageData);
    });

}
module.exports.getFilterInterviewSchedulesByExpMinMax = function(suburl,expmin,expmax,senderid){
                  adaptInterviews.adaptFilterSchedules(suburl,function(callback){
                    var messageData = {
                      "recipient":{
                        "id":senderid
                      },
                      "message":{
                        "attachment":{
                          "type":"template",
                          "payload":{
                            "template_type":"button",
                            "text":callback,
                            "buttons":[
                              {
                                "type":"postback",
                                "title":"Click here for more",
                                "payload":"Exp2mm-"+expmin+"-"+expmax+"-0"
                              },
                              {
                                "type":"web_url",
                                "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                                "title":"View all Jobs of Exp 0years",
                              },
                              {
                                "type":"postback",
                                "title":"Home",
                                "payload":"GET_STARTED"
                              },
                            ]
                          }
                        }
                      }
                    };
                    callSendAPI(messageData);
                  });
}
module.exports.getNextFilterInterviewSchedulesByExpMinMax = function(event){
                  var senderid = event.sender.id;
                  var s = event.postback.payload;
                  var r = /-(.+)-(.+)-(\d{1,3})$/g;
                  var m = r.exec(s);
                  var expmin = m[1];
                  var expmax = m[2];
                  var index = parseInt(m[3])+1;
                  var suburl = "get_walkins_by_Experience/"+expmin+"/"+expmax+"/"+index;
                  console.log(suburl);
                  adaptInterviews.adaptFilterSchedules(suburl,function(callback){
                    var messageData = {
                      "recipient":{
                        "id":senderid
                      },
                      "message":{
                        "attachment":{
                          "type":"template",
                          "payload":{
                            "template_type":"button",
                            "text":callback,
                            "buttons":[
                              {
                                "type":"postback",
                                "title":"Click here for more",
                                "payload":"Exp2mm-"+expmin+"-"+expmax+"-"+index
                              },
                              {
                                "type":"web_url",
                                "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                                "title":"View all Jobs of Exp",
                              },
                              {
                                "type":"postback",
                                "title":"Home",
                                "payload":"GET_STARTED"
                              },
                            ]
                          }
                        }
                      }
                    };
            callSendAPI(messageData);
          });
}
module.exports.getFilterInterviewSchedulesByRole_Subject = function(suburl,role,subject,senderid){
                adaptInterviews.adaptFilterSchedules(suburl,function(callback){
                  var messageData = {
                    "recipient":{
                      "id":senderid
                    },
                    "message":{
                      "attachment":{
                        "type":"template",
                        "payload":{
                          "template_type":"button",
                          "text":callback,
                          "buttons":[
                            {
                              "type":"postback",
                              "title":"Click here for more",
                              "payload":"subject_role-"+role+"-"+subject+"-0"
                            },
                            {
                              "type":"web_url",
                              "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                              "title":"View all Jobs of Exp 0years",
                            },
                            {
                              "type":"postback",
                              "title":"Home",
                              "payload":"GET_STARTED"
                            },
                          ]
                        }
                      }
                    }
                  };
                  callSendAPI(messageData);
                });
}
module.exports.getNextFilterInterviewSchedulesByRole_Subject = function(event){
                var senderid = event.sender.id;
                var s = event.postback.payload;
                var r = /subject_role-(.+)-(.+)-(\d{1,3})/gi;
                var m = r.exec(s);
                var role = m[1];
                var subject = m[2];
                var index = parseInt(m[3])+1;
                var suburl = "get_walkins_by_jobrole_subject/"+role+"/"+subject+"/"+index;
                adaptInterviews.adaptFilterSchedules(suburl,function(callback){
                  var messageData = {
                    "recipient":{
                      "id":senderid
                    },
                    "message":{
                      "attachment":{
                        "type":"template",
                        "payload":{
                          "template_type":"button",
                          "text":callback,
                          "buttons":[
                            {
                              "type":"postback",
                              "title":"Click here for more",
                              "payload":"subject_role-"+role+"-"+subject+"-"+index
                            },
                            {
                              "type":"web_url",
                              "url":"https://prixie-api.herokuapp.com/get_walkins_by_Experience/0",
                              "title":"View all Jobs of Exp 0years",
                            },
                            {
                              "type":"postback",
                              "title":"Home",
                              "payload":"GET_STARTED"
                            },
                          ]
                        }
                      }
                    }
                  };
                  callSendAPI(messageData);
                });
}
