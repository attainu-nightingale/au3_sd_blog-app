var express = require('express');
var app = express();
var router = express.Router();
var db;
var mongoClient = require('mongodb').MongoClient;
url = 'mongodb://localhost:27017'

mongoClient.connect(url, function(err, client){
    if(err)
    throw err;
    db = client.db('assignment');
})
app.set('view engine', 'hbs');
module.exports = router;
router.use(express.static("views"));

router.get("/", function(req, res){
    db.collection("p_admin").find().toArray(function(err, result){
        if(err)
          throw err;
        res.render('admin.hbs',{
            admin: result
        });
    })
})


