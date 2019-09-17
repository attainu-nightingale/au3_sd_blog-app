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

var url = 'mongodb://127.0.0.1:27017';
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
        res.render('home.hbs' , {data : data , layout : false , style : '/userdashboard.css'});      
      }
  })
});


app.use('/admin', admin);
app.use('/user', user);

app.listen(3000);