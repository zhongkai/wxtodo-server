const express = require('express');
const app = express();
const port = 3000;
const lessonConfig = require('./lesson');

app.get('/', function (req, res) {
    res.send("<h1>Hello World! This Class is called '" + lessonConfig.lesson + "'. Teacher is " + lessonConfig.teacher + ".</h1>");
});

app.listen(port, function(error) {
    if(error) {
        console.log('error!');
    }
    else {
        console.log(`Server start! Listening on localhost:${ port }`);
    }
})