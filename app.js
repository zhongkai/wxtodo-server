var express = require('express');
var app = express();
var port = 3000;
var lessonConfig = require('./lesson');

app.get('/', function (req, res) {
    res.send("<h1>Hello World! This Class is called '" + lessonConfig.lesson + "'. Teacher is " + lessonConfig.teacher + ".</h1>");
});

app.listen(port, function(error) {
    if(error) {
        console.log("error!");
    }
    else {
        console.log("Server start! Listening on localhost:" + port);
    }
})