var express = require('express');
var mongoClient = require("mongodb").MongoClient;
var hbs     = require('hbs');
var methodOverride = require('method-override')
var app = express();


hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});


app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('routes'));
app.use(methodOverride('_method'));

var url = 'mongodb+srv://zanul:sa123456789@cluster0-31wmw.mongodb.net/Blog?retryWrites=true&w=majority';
var db, localdb;
app.set("view engine" , hbs);
mongoClient.connect(url , { useNewUrlParser: true ,  useUnifiedTopology: true } ,function(err , client){
    if(err)
      throw err;
    app.locals.db = client.db('Blog');
     localdb = client.db('Blog');
})


var admin = require('./routes/admin');
var user = require('./routes/user');


app.get('/', function(req, res) {
  localdb.collection('Blog').find({}).toArray(function(err , data){
    if(err)
      throw err
      else{
        // console.log(req.session.userId);
        res.render('home.hbs' , {data : data , layout : false , style : '/userdashboard.css'});      
      }
  })

});


app.use('/admin', admin);
app.use('/user', user);

app.get('/*' , function(req , res){
  res.send('<img src="data:image/jpeg;base64,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">');
})

app.listen(3000);