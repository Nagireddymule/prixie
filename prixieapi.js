var express =require("express");
var app = express();

app.set('port',process.env.PORT||3000)

app.get('/',function(req,res){
  res.send('working');
})

app.get('/interview_schedule',function(req, res){
  res.send("interview Schedule");
});

app.get('/consultancy',function(req, res){
  res.send("consultancies List");
});
app.get('/eligibility',function(req, res){
  res.send("Eligibility");
});
app.get('/required_documents',function(req, res){
  res.send("Documents required for interview");
});

app.get('/it_selection_process',function(req, res){
  res.send("selection procedure for IT recruitment");
});
app.get('/non_it_selection_process',function(req, res){
  res.send("selection procedure for Non-IT recruitment");
});

app.get('/written_test',function(req, res){
  res.send("About written test");
});

app.get('/technical_test',function(req, res){
  res.send("About technical test");
});

app.get('/group_discussion_and_jam',function(req, res){
  res.send("About Group Discussion and JAM Rounds");
});

app.get('/varcent_round',function(req, res){
  res.send("About vercent round");
});

app.get('/payroll_consultencies',function(req, res){
  res.send("Payroll consultancies List");
});

app.get('/tutorial',function(req, res){
  res.send("Tutorials for IT and non it subjects");
});

app.get('/previous_question_papers',function(req, res){
  res.send("past 10 years question papers");
});





app.listen(app.get('port'),function(){
  console.log("prixie is running on port"+app.get('port'));
});
