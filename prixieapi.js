var express =require("express");
var mysql=require("mysql");
var MongoClient = require("mongodb").MongoClient;
var app = express();
var mongourl = "mongodb://localhost:27017/walkins";
app.set('port',process.env.PORT||3000)

app.get('/',function(req,res){
  res.send('working');
});

app.get('/interview_schedules',function(req, res){

    MongoClient.connect(mongourl,function(err,db){
          var collection = db.collection("today_walkins");
          collection.find({}).toArray(function(err,data){
              if(err) throw err;
              console.log(data);
              db.close();
              res.send(data);
          });
    });
});
app.get('/consultancy',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
connection.connect();
connection.query('select * from consultancy', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("consultancies List"+result);
});
});

app.get('/written_test',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='WRITTEN TEST'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/technical_test',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='TECHNICAL'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
  });
});

app.get('/group_discussion',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='GD'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});
app.get('/vercent_round',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='VERCENT ROUND'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});


app.get('/jam',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='JAM'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/system_programming',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='SYSTEM PROGRAMMING'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/typing_test',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='TYPING TEST'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/hr',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='HR(OPERATION)'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/telephonic',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select round_discription from rounds where round_name='TELEPHONIC ROUND'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});







app.get('/it_selection_process',function(req, res){
  res.send("selection procedure for IT recruitment");
});

app.get('/non_it_selection_process',function(req, res){
  res.send("selection procedure for Non-IT recruitment");
});
app.get('/eligibility',function(req, res){
  res.send("Eligibility");
});
app.get('/required_documents',function(req, res){
  res.send("Documents required for interview");

});

app.get('/salary',function(req, res){
  res.send("here we provides salary details...");
});





app.get('/payroll_consultencies',function(req, res){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'prixie'
  });
  connection.connect();
  connection.query("select payroll from consultancy where consultancy_type='Payroll'", function (error, results, fields) {
  if (error) throw error;

  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("payroll List"+result);
});
});




app.get('/tutorials',function(req, res){
  res.send("Tutorials for IT and Non-IT subjects");
});

app.get('/previous_question_papers',function(req, res){
  res.send("past 10 years question papers");
});

app.get('/resume_tips',function(req, res){
  res.send("here we provides resume tips");
});



app.listen(app.get('port'),function(){
  console.log("prixie is running on port "+app.get('port'));
});
