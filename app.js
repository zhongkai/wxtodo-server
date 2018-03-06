var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var lessonConfig = require('./lesson');
var login = require('./routes/login');
var user = require('./routes/user');
var todos = require('./routes/todos');

var app = express();
var port = config.port;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("<h1>Hello World! This Class is called '" + lessonConfig.lesson + "'. Teacher is " + lessonConfig.teacher + ".</h1>");
});

app.use('/login', login);

app.use('/user', user);

app.use('/todos', todos);

app.use(function(req, res, next) {

    res.status(404).json({
        error: '资源未找到'
    });

});

app.use(function(error, req, res, next) {

    console.log(error);
    res.status(500).json({
        error: '服务器内部错误'
    });

});

app.listen(port, function(error) {
    if(error) {
        console.log('error!');
    }
    else {
        console.log("Server start! Listening on localhost:" + port);
    }
});