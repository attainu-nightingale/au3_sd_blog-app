var express = require('express');
var app = express();
var admin = require('./routes/admin');
var user = require('./routes/user');

app.use(express.static('routes'));

app.get('/', function(req, res) {
    res.send(`<h2>Default route of index file</h2>
                <a href="/admin">Admin</a>&nbsp;
                <a href="/user">User</a>`);
});

app.use('/admin', admin);
app.use('/user', user);

app.listen(process.env.PORT || 3000);
