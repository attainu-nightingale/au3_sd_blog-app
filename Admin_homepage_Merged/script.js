var express = require("express");
var app = express();
var session = require("express-session");
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;

app.use(express.static("views"));
app.set('view engine', 'hbs');

var mongoClient = require("mongodb").MongoClient;
var db;

mongoClient.connect("mongodb://localhost:27017", function(err,client){
    if(err) throw err;
    //console.log('connected');
    db = client.db("Project");
 //console.log(db)
});

app.use(bodyParser.urlencoded());

app.use(express.static('public'));

// var path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : "Express session secret"
})
);
app.use(express.urlencoded({ extended : false}));


app.post("/Login",function(req,res){
   db.collection("adminAccount").find().toArray(function(err,result){
        
        if (err) throw err;
        for(var i=0;i<result.length;i++){
           if(req.body.email == result[i].email && req.body.password == result[i].password){
               req.session.loggedin = true;
            }
        }
       console.log("logged in",result);
        res.redirect("/adminHomepage")
    })
})


app.get("/adminHomepage", function(req, res){
    if(req.session.loggedin == true){
        // res.send("Session working!")
    db.collection("p_admin").find({recentUpdate: 1}).toArray(function(err, result){
        if(result.length > 0) {
            res.render('admin.hbs', {
                admin: result,
                script: 'button.js'
            })
        }
        else
            throw err;
    });
}
    else{
        res.send("Session not working!");
    }
});


app.put("/adminHomepage/deleteblog/:id", function(req, res){
    
    db.collection("p_admin").updateOne({_id:ObjectID(req.params.id)},{$set:{ status: -2,recentUpdate:0 }},function(err, result){
        if(err)
          throw err;
          res.json(result);
    })

})


app.put("/adminHomepage/approveblog/:id", function(req, res){
    db.collection("p_admin").updateOne({_id:ObjectID(req.params.id)},{$set:{ status: 1,recentUpdate:0 }},function(err, result){
        if(err)
          throw err;
        res.json(result);
    })
    
})

app.use('/adminHomepage/changerequest/:id',bodyParser.urlencoded({extended:true}));

app.post("/adminHomepage/changerequest/:id", function(req,res){
    db.collection("p_admin").updateOne({_id:ObjectID(req.params.id)},{$set:req.body},function(err, result){
        if(err)
          throw err;
        res.json(result);
    })
})

app.get("/adminHomepage/logout", function(req,res){
    req.session.destroy();
    res.redirect("/");
    location.reload(true);
});
   


    // admin Login

// app.post("/Login",function(req,res){
//     db.collection("admin").insertOne(req.body,function(err,result){
//         if (err) throw err;
//         console.log(req.body);
// //         //res.redirect("redirecting file");
//     });
// //      //console.log(req.body);
//  });




// app.post("/Signup",function(req,res){
//      db.collection("newUser").insertOne(req.body,function(err,result){
//          if (err) throw err;
//          console.log(req.body);
// //         //res.redirect("redirecting file");
//      });
// //      //console.log(req.body);
//   });


// app.get("/user",function(req,res){
//     if(req.session.loggedin == true){
//     //    res.send( "Welcome!!" + req.session.username +  `<ahref="/Logout">Logout </a>`
//     res.sendFile("landing page after logging in");    
// }else {
//     console.log("Incorrect data");
//        // res.redirect("/");

//     }
// });


// app.post("/Signin",function(req,res){
//     db.collection("newUser").insertOne(req.body,function(err,result){
//         if (err) throw err;
//         console.log(req.body);
// //         //res.redirect("redirecting file");
//     });
// //      //console.log(req.body);
//  });


app.listen(1000 , function(){
    console.log("Listening on 1000");
})




