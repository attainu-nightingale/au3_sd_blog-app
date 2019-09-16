var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require("express-session");
var ObjectId = require('mongodb').ObjectId;
var datetime = require('date-and-time');
var multer = require('multer');
var flash = require('connect-flash');
var upload = multer({ dest: 'uploads/' });
const now = new Date();

var userId ,username;


router.use(bodyParser.urlencoded({ extended: true  }));
router.use(express.static('public'));
router.use(express.static('uploads'));
router.use(flash());

router.use(session({
    secret : 'Shallow Dive Project',
}))

router.use(function(req , res , next){
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.userId = req.session.userId;
    next();
})

router.use(function(req , res , next){
    res.locals.success = req.flash('success');
    res.locals.error  = req.flash('error');
    next();
})




router.get('/posts', function(req, res) {
    //This link will fetch posts from database
    var db = req.app.locals.db;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        db.collection('Blog').find({$or:[{$and:[{heading : regex} , {status : 1}]},{$and:[{category : regex} , {status : 1}]},{$and:[{username : regex} , {status : 1}]}]}).toArray(function(err , data){
            if(err){
                throw err;
            }
            else{
            res.render('home.hbs' , {data : data , view : false , layout : false , style : '/userdashboard.css'}); 

            }
        }) 
    }
    else{
        db.collection('Blog').find({status : 1}).sort({date : -1}).limit(3).toArray(function(err , recent){ 
        db.collection('Blog').find({status : 1}).sort({views : -1}).limit(3).toArray(function(err , mostviewd){
            // res.render('showBlog.hbs' , {data : data});
            res.render('home.hbs' , {recent : recent ,mostviewd : mostviewd , view : true, layout : false , style : '/userdashboard.css' , loggedIn : req.session.loggedIn});     
        }) 
    })
    }
});

//---------------- This routes show particluar Blog info ----->

router.get("/posts/:id" , function(req , res){
    var db = req.app.locals.db;
    
    db.collection('Blog').find({_id : ObjectId(req.params.id)} ).toArray(function(err , data) {
        if(err)
            throw err;
        else {
            db.collection('Blog').updateOne({$and : [{_id :ObjectId(req.params.id)} , {userid :{$ne : req.session.userId}}]} , {$set : {views : data[0].views + 1}}, function(err , result) {
                if(err)
                  throw err;
             else{     
            if(data[0].userid == req.session.userId && req.session.loggedIn) {
                db.collection('user').find({_id : req.session.userId}).toArray(function(err , userdata) {
                    if (err)
                        throw err;
                    else {
                        db.collection('comment').find({blogid : {$eq : req.params.id}}).toArray(function(err , commentdata) {
                            if (err)
                                throw err;
                            else {
                                res.render('showparticularblog.hbs' , {
                                    data : data,
                                    blogid : req.params.id,
                                    comment : commentdata,
                                    user : userdata,
                                    date :  datetime.format(now, 'DD, MMM')});
                                }
                            })
                        }
                    })
                }
            else {
                db.collection('user').find({_id : userId}).toArray(function(err , userdata) {
                    if (err)
                        throw err;
                    else {
                        db.collection('comment').find({blogid : {$eq : req.params.id}}).toArray(function(err , commentdata) {
                            if (err)
                                throw err;
                            else {
                                res.render('showparticularblog2.hbs' , {
                                    data : data,
                                    blogid : req.params.id,
                                    comment : commentdata,
                                    user : userdata,
                                    date :  datetime.format(now, 'DD, MMM')
                                });
                            }
                        })
                    }
                })
            }}
        })}
    })
})


// --------------------- Inserting Comment ----------------------->>>

router.post('/posts/:id' , function(req , res) {
    if(req.session.loggedIn) {
        var db = req.app.locals.db;
        var data = req.body;
          data.username = req.session.username;
          data.userid = req.session.userId;
        db.collection('comment').insertOne(data , function(err , data) {
            if(err)
                throw err;
            else {
                req.flash('success','Comment Added Sucessfully !!');
                res.redirect('/user/posts/' + req.params.id);
            }
        })
    }
    else {
        res.redirect("/user/signup.html");
    }
})


//----------------------------- Create Blog ------------------------

router.get("/showEditor", function(req, res) {
    res.render('postBlog.hbs', {
        title: "Post Blog",
        style: '/postBlog.css',
        script: '/postBlog.js',
        layout: false
    });
});

router.post('/postBlog', upload.array('ImgGal', 4), function (req, res, next) {
    var db = req.app.locals.db;
    
    var images = [];

    for(var i=1; i<(req.files).length; i++) {
        images.push((req.files)[i].filename);
    }

    var posts = {
        "username": req.session.username,
        "userid": req.session.userId,
        "heading": req.body.heading,
        "headImg": (req.files)[0].filename,
        "body": req.body.about,
        "images": images,
        "category": req.body.category,
        "date": datetime.format(now, 'DD, MMMM'),
        "status": 0,
        "views" : 0,
        "recentUpdate" : 1
    }

    db.collection('Blog').insertOne(posts, function(error, result) {
        if(error)
            throw error
    });
       res.redirect('/user/posts');
    // res.json("Blog posted");
});


//--------------------------- This two Routes Update Posts ---------------

router.get("/posts/:id/edit" , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({_id : ObjectId(req.params.id)}).toArray(function(err , data) {
        if(err)
            throw err;
        else {
            res.render('editBlog.hbs' , {
                title: "Edit Blog",
                data : data,
                script: '/editBlog.js',
                style: '/editBlog.css',
                layout: false
            });
        }
    })
})

router.get("/posts/blog/:id" , function(req , res) {
    var db = req.app.locals.db;
    db.collection('Blog').find({_id : ObjectId(req.params.id)}).toArray(function(err , result) {
        if(err)
            throw err;
        else
            res.json(result);
    });
});

router.put("/posts/:id" , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').updateOne({$and : [{_id :ObjectId(req.params.id)} , {userid : req.session.userId}]} , {$set : {heading : req.body.heading , body : req.body.about , recentUpdate : 1}}, function(err , result) {
        if(err)
            throw err;
        else {
            res.json("Blog is Updated :)");
            // res.send('vkjhdkvdkf');
            // res.redirect("/"); 
            req.flash('success'  , 'Blog Updated Successfully');
        }
    });
});

//----------------------------- Delete Blog ---------------------->>

router.delete('/posts/:id', function(req, res) {
    var db = req.app.locals.db;
    db.collection('Blog').deleteOne({_id : ObjectId(req.params.id)} , function(err , data) {
        if(err)
            throw err;
        else {
            req.flash('error'  , 'Blog is deleted Successfully');
            res.redirect("/user/posts");
        }
    })
});

//--------------------------------- Authentication routes ----------------------->>

router.get("/" , function(req , res) {
    res.redirect('signup.html');
})

router.post('/signup' , function(req,res) {
    var db = req.app.locals.db;
    db.collection('user').findOne({email : req.body.email} , function(err , result) {
        if(err)
            throw err;
        else {
            if(result == null) {
                db.collection('user').insertOne(req.body , function(err , data) {
                    if (err)
                        throw err;
                    else {
                        res.redirect('signup.html');
                    }
                })
            }
            else {
                res.redirect("/user/");
            }
        }
    })
})

router.get('/signout' , function(req , res) {
    req.session.destroy();
    res.redirect('/user/posts');
})

router.post('/signin' , function(req , res) {
    var db = req.app.locals.db;
    var flag = false;
    db.collection('user').find({}).toArray(function(err , data) {
        if(err)
            throw err;
        else {
            for(var i = 0 ; i< data.length ; i++) {
                if(data[i].email === req.body.email && data[i].password === req.body.password) {
                    flag = true;
                    req.session.userId = data[i]._id;
                    req.session.username = data[i].username;
                    // userId = req.session.userId;
                    // username = req.session.username;
                    req.session.userdata = {
                        email : req.body.email,
                        password : req.body.password
                    }
                    break;
                }
            }
        }
        if (flag) {
            req.flash('success'  , 'Logged In Successfully !!');
            req.session.loggedIn = true;
            res.redirect('/user/posts');
        }
        else {
            res.redirect('signup.html');
        }
    }) 
})




//------------------------------------- User Dashboard ---------------

router.get('/:id/dashboard' , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({$and : [{userid : req.session.userId}, {status : 1}]}).toArray(function(err , data){
        if(err)
          throw err;
        else{
            res.render('userdashboard.hbs' , {style : '/userdashboard.css' , layout : false , data : data});
        }  
    })
})

//--------------------------- Dashboard Show All Blog To user --------------

router.get('/:id/dashboard/showallblog' , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({userid : req.params.id}).toArray(function(err , data){
        if(err)
          throw err;
        else{
            res.render('dashboardAllBlogUser.hbs' , {style : '/userdashboard.css' , layout : false, data : data});
        }
    })
})

//------------------------- Dashboard Edit All Blog to user ---------------

router.get('/:id/dashboard/Editallblog' , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({userid : req.session.userId}).toArray(function(err , data){
        if(err)
          throw err;
        else{
            res.render('UserEditAllBlogDashboard.hbs' , {style : '/userdashboard.css' , layout : false, data : data});
        }
    })
})

//--------------------------- Dashboard Delete All Blog to User -----------

router.get('/:id/dashboard/Deleteallblog' , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({userid : req.session.userId}).toArray(function(err , data){
        if(err)
          throw err;
        else{
            res.render('UserDeleteAllBlogDashboard.hbs' , {style : '/userdashboard.css' , layout : false, data : data});
        }
    })
})

router.get('/posts/:id/delete' , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').deleteOne({_id : ObjectId(req.params.id)} , function(err , data) {
        if(err)
            throw err;
        else {
            req.flash('error'  , 'Blog is deleted Successfully');
            res.redirect("/user/" + req.session.userId + '/dashboard/Deleteallblog');
        }
    })
})

//-------------------- DashBoard Status Approve ---------------
router.get("/:id/dashboard/statusApprove", function(req, res){
    var db = req.app.locals.db;
    db.collection('Blog').find({userid : req.session.userId}).toArray(function(err , data){
     if(err)
       throw err;
       else{
           res.render('approvaldashboard.hbs' , {layout : false , data : data , style : '/userdashboard.css'})
       }
    })
})

//----------------- DashBoard  Status Reject  -------

router.get("/:id/dashboard/reject", function(req, res){
    var db = req.app.locals.db;
    db.collection('Blog').find({userid : req.session.userId}).toArray(function(err , data){
     if(err)
       throw err;
       else{
           res.render('rejectdashboard.hbs' , {layout : false , data : data , style : '/userdashboard.css'})
       }
    })
})

// ------------------------ Dashboard Status Request for Change -----------------

router.get('/:id/dashboard/requestForChanges' , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({userid : req.session.userId}).toArray(function(err , data){
        if(err)
          throw err;
          else{
              res.render('requestForChangesdashboard.hbs' , {layout : false , data : data , style : '/userdashboard.css'})
            }
        })
    })

// -------------------------- Dashboard Under Review ----------------------

router.get('/:id/dashboard/underReview' , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({userid : req.session.userId}).toArray(function(err , data){
        if(err)
          throw err;
          else{
              res.render('UnderReviewsdashboard.hbs' , {layout : false , data : data , style : '/userdashboard.css'})
            }
        })
    })

//---------------- navbar

router.get("/category/:category" , function(req , res){
    var db = req.app.locals.db;
    db.collection('Blog').find({$and : [{status : 1} , {category : req.params.category}]}).sort({views : -1}).toArray(function(err , data){
        if(err)
          throw err;
        else{
            if(data.length < 1)
                var item = true
            else
                var item = false;
            res.render('category_Industry.hbs' , {data : data , style : "/category.css", layout: false , item});
        }  
    })
})


//--------------- Search Function-------------------

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;