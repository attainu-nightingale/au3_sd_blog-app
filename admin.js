var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('<h2>This is admin area</h2>');
});

router.get('/signin', function(req, res) {
    //This link will log in to admin dashboard
});

router.get('/signout', function(req, res) {
    //This link will log out the admin
});

module.exports = router;