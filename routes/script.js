var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');



var mongoClient = require("mongodb").MongoClient;
var db;

mongoClient.connect("mongodb://localhost:27017", function(err,client){
    if(err) throw err;
    //console.log('connected');
    db = client.db("Blog");
 //console.log(db)
});
var app = express();
app.use(bodyParser.urlencoded());

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : "Express session secret"
})
);
app.use(express.urlencoded({ extended : false}));


app.post("/Login",function(req,res){
    db.collection("admin").find().toArray(function(err,result){
        if (err) throw err;
        for(var i=0;i<result.length;i++){
            if(req.body.email == result[i].email && req.body.password == result[i].password){
                req.session.loggedin = true;
            }
        }
        console.log("logged in");
        //res.redirect("file to be connected")
    })
   
});


app.get("/user",function(req,res){
    if(req.session.loggedin == true){
    //    res.send( "Welcome!!" + req.session.username +  `<ahref="/Logout">Logout </a>`
    res.sendFile("landing page after logging in");    
}else {
    console.log("Incorrect data");
       // res.redirect("/");

    }
});


app.listen(1000 , function(){
    console.log("Listening on 1000");
})
