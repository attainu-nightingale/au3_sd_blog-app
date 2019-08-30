var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true  }));
router.use(express.static('public'));

router.get('/', function(req, res) {
    res.send('<h2>This is admin area</h2>');
});

router.get('/signin', function(req, res) {
    //This link will log in to admin dashboard
    res.render('admin_signin.hbs', {
        title: "Sign In",
        style: 'admin_signin.css',
        script: 'admin_signin.js'
    })
});

router.get('/dashboard', function(req, res) {
    //This link will log in to admin dashboard
    res.render('dashboard.hbs', {
        title: "Admin Dashboard",
        style: 'dashboard.css',
        script: 'dashboard.js'
    })
});

router.get('/signout', function(req, res) {
    //This link will log out the admin to admin sign in page
});

module.exports = router;