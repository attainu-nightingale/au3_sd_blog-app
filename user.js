var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('<h2>This is user area</h2>');
});

router.get('/signin', function(req, res) {
    //This link will log in the user
});

router.get('/posts', function(req, res) {
    //This link will fetch posts from database
});

router.put('/postsUpdate', function(req, res) {
    //This link will update posts to database
});

router.delete('/postsDelete', function(req, res) {
    //This link will delete posts from database
});

router.get('/signout', function(req, res) {
    //This link will log out the user
});

module.exports = router;