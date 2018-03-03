var express = require('express');
var config = require('./config');
var lessonConfig = require('./lesson');
var login = require('./routes/login');
var user = require('./routes/user');

var app = express();
var port = config.port;

app.get('/', function (req, res) {
    res.send("<h1>Hello World! This Class is called '" + lessonConfig.lesson + "'. Teacher is " + lessonConfig.teacher + ".</h1>");
});

app.use('/login', login);

app.use('/user', user);

app.listen(port, function(error) {
    if(error) {
        console.log('error!');
    }
    else {
        console.log("Server start! Listening on localhost:" + port);
    }
});