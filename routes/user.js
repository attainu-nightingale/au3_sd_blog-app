var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true  }));
router.use(express.static('public'));

router.get('/', function(req, res) {
    //Default route will show the homepage to the user
    res.render('homepage.hbs', {
        title: "Homepage",
        style: 'homepage.css',
        script: 'homepage.js'
    })
});

router.get('/signup', function(req, res) {
    //This link will log in the user
    res.render('user_signup.hbs', {
        title: "Sign Up",
        style: 'user_signup.css',
        script: 'user_signup.js'
    })
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