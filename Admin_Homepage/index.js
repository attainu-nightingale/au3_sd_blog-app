var express = require('express');
var app = express();
var admin = require('./routes/admin');

app.use(express.static('routes'));

app.get('/', function(req, res) {
    res.send(`<h2>Default route of index file</h2>
                <a href="/admin">Admin</a>&nbsp;`);
});

app.use('/admin', admin);

app.listen(3000);