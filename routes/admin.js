var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require("express-session");
var ObjectID = require('mongodb').ObjectId;
var datetime = require('date-and-time');
var multer = require('multer');
var flash = require('connect-flash');
var upload = multer({ dest: 'uploads/' });
const now = new Date();

router.use(bodyParser.urlencoded({ extended: true  }));
router.use(express.static('public'));
// router.use(function(req , res , next){
//     res.locals.loggedin = req.session.loggedin;
//     next();
// })

router.get('/login', function(req, res) {
    res.render('admin_signin.hbs', {
        title: "Admin SignIn",
        style: "/admin_signin.css",
        layout: false
    });
});

router.use(session({
    secret : 'Shallow Dive Project',
}))



router.get('/', function(req, res) {
      //This link will log in to admin dashboard
      var db = req.app.locals.db;
     if(req.session.loggedin == true){
        db.collection("Blog").aggregate([{$count : 'count'}]).toArray(function(err, blog){
        db.collection('Blog').distinct( "userid" , (function(err , authors){
        db.collection('Blog').aggregate([{ $group: { _id: null, views: { $sum: "$views" } } } ]).toArray(function(err , views){
         db.collection("user").aggregate([{$count : 'count'}]).toArray(function(err, user){
     db.collection("Blog").find({recentUpdate: 1}).toArray(function(err, result){
         if(result.length > 0)
         var show = true
         else
         var show = false
        //  console.log(views[0].views , user[0].count , authors.length , blog[0].count);

        res.render('admindashboard.hbs', {
            title: "Admin Dashboard",
            style: '/admindashboard.css',
            script: '/admindashboard.js',
            admin : result,
            show,
            user : user[0].count,
            author : authors.length,
            blog : blog[0].count,
            views : views[0].views,
            layout : false,
            loggedIn : true,
        })
     });
    });
})
}))
     })
 }
     else{
        res.redirect("/admin/login");
     }
});



router.post("/auth",function(req,res){
    var db = req.app.locals.db;
    db.collection("adminAccount").find({$and: [{email : req.body.email} , {password : req.body.password}]}).toArray(function(err,result){
         
         if (err) throw err;
        if(result.length > 0){
            req.session.loggedin = true;
        }
        else{
            console.log('fail');
        }
         res.redirect("/admin")
     })
 })
 
//  router.get("/logout", function(req, res){
//      req.session.destroy();
//  })
 router.get("/adminHomepage", function(req, res){
    var db = req.app.locals.db;
     if(req.session.loggedin == true){
     db.collection("Blog").find({recentUpdate: 1}).toArray(function(err, result){
         
             res.render('admin.hbs', {
                 admin: result
             })
     });
 }
     else{
         res.send("Session not working!");
     }
 });
 
 
 router.put("/adminHomepage/deleteblog/:id", function(req, res){
    var db = req.app.locals.db;
     db.collection("Blog").updateOne({_id:ObjectID(req.params.id)},{$set:{ status: -2,recentUpdate:0 }},function(err, result){
         if(err)
           throw err;
           res.json(result);
     })
 
 })
 
 
 router.put("/adminHomepage/approveblog/:id", function(req, res){
    var db = req.app.locals.db;
     db.collection("Blog").updateOne({_id:ObjectID(req.params.id)},{$set:{ status: 1,recentUpdate:0 }},function(err, result){
         if(err)
           throw err;
         res.json(result);
     })
     
 })
 
 router.use('/adminHomepage/changerequest/:id',bodyParser.urlencoded({extended:true}));
 
 router.post("/changerequest/:id", function(req,res){
    var db = req.app.locals.db;
     db.collection("Blog").updateOne({_id:ObjectID(req.params.id)},{$set:req.body},function(err, result){
         if(err)
           throw err;
         res.redirect('/admin/adminHomepage')
     })
 })
 
 router.get("/adminHomepage/logout", function(req,res){
     req.session.destroy();
     res.redirect("/admin");
    //  location.reload(true);
 });
    
 router.get("/blog" , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find().toArray(function(err , data){
        if(err)
          throw err;
        else{
            res.render('admin_blog.hbs' , {style: '/admindashboard.css', data : data , loggedIn:true});
        }
    })
 })
 
router.get("/delete" , function(req , res){
   var db = req.app.locals.db;
   db.collection('Blog').find({}).toArray(function(err , data){
       if(err)
         throw err;
       else{
           res.render('admin_delete.hbs' , {style: '/admindashboard.css', data : data , loggedIn : true})
       }
   })
})

router.get("/:id/delete" , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').deleteOne({_id : ObjectID(req.params.id)} , function(err , data){
        if(err)
          throw err;
        else{
            res.redirect("/admin/delete");
        }  
    })
})


module.exports = router;