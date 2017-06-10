var express =require("express");
var app = express();

app.set('port',process.env.PORT||3000)

app.get('',function(req,res){
  res.send('working');
})
app.get('/:id',function(req, res){
  res.send("your id is :"+req.params.id);

})

app.listen(app.get('port'),function(){
  console.log("prixie is running on port"+app.get('port'));
});
