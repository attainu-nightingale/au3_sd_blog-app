var express = require('express');
var app = express();
var hbs = require('hbs');
var ObjectID = require('mongodb').ObjectID;
var db;
var mongoClient = require('mongodb').MongoClient;

url = 'mongodb://localhost:27017'

mongoClient.connect(url, function(err, client){
    if(err)
    throw err;
    db = client.db('Project');
})

app.set('view engine', 'hbs');
hbs.registerHelper('is', function(parameter, string){
    if(parameter == string)
    return "Yes";
    else
    return "No";
})
app.use(express.static('public'));

app.get("/statusApprove", function(req, res){
    db.collection("p_admin").find({status: 1}).toArray(function(err, result){
        if(result.length > 0) {
            res.render('approval.hbs', {
                admin: result
            })
        }
        else
            throw err;
    });
});

app.get("/statusReject", function(req, res){
    db.collection("p_admin").find({status: -2}).toArray(function(err, result){
        if(result.length > 0) {
            res.render('rejection.hbs', {
                admin: result
            })
        }
        else
            throw err;
    });
});

app.get("/statusUpdate", function(req, res){
    db.collection("p_admin").find({status: -1}).toArray(function(err, result){
        if(result.length > 0) {
            res.render('updation.hbs', {
                admin: result
            })
        }
        else
            throw err;
    });
});

app.get("/statusUnderReview", function(req, res){
    db.collection("p_admin").find({status: 0}).toArray(function(err, result){
        if(result.length > 0) {
            res.render('underReview.hbs', {
                admin: result
            })
        }
        else
            throw err;
    });
});



app.listen(2000);