var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var db;
var mongoClient = require('mongodb').MongoClient;

url = 'mongodb://localhost:27017'

mongoClient.connect(url, function(err, client){
    if(err)
    throw err;
    db = client.db('Project');
})
router.use(express.static('public'));

router.get("/", function(req, res){
    db.collection("p_admin").find().toArray(function(err, result){
        if(result.length > 0) {
            res.render('admin.hbs', {
                admin: result,
                script: 'button.js'
            })
        }
        else
            throw err;
    });
});

router.delete("/deleteblog/:id", function(req, res){
    
    db.collection("p_admin").deleteOne({_id:ObjectID(req.params.id)},function(err, result){
        if(err)
          throw err;
    })

})

router.put("/approveblog/:id", function(req, res){
    db.collection("p_admin").updateOne({_id:ObjectID(req.params.id)},{$set:{ status: 1 }},function(err, result){
        if(err)
          throw err;
        res.json(result);
    })
    
})

router.use('/changerequest/:id',bodyParser.urlencoded({extended:true}));

router.post("/changerequest/:id", function(req,res){
    db.collection("p_admin").updateOne({_id:ObjectID(req.params.id)},{$set:req.body},function(err, result){
        if(err)
          throw err;
        res.json(result);
    })
})

module.exports = router;


