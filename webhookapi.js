var express = require("express");
var request = require("request");
var bodyParser = require('body-parser');

var receivedMessage = require("./controllers/receivedMessage");
var callSendAPI = require("./controllers/callSendApi");
var msgControllermodule = require("./controllers/msgController");

var app = express();


//middlewares
app.set('port',(process.env.PORT||2000));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//


app.get('/',function(req,res){
    res.send("webhook is working .......");
})

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'prixieverificationtoken') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
  });

app.post('/webhook', function (req, res) {
  var data = req.body;
  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      entry.messaging.forEach(function(event) {
      msgControllermodule.msgController(event);
      });
    });
    res.sendStatus(200);
  }
});

app.listen(app.get('port'),function(){
console.log("webhook is running on port "+app.get('port'));
})
