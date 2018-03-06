var express = require('express');
var app = express();
var port = 3000;

app.get('/', function(req, res) {
    res.send('<h1>Hello World!</h1>');
});

app.listen(port, function(error) {
    if(error) {
        console.log('error!');
    }
    else {
        console.log(`Server start! Listening on localhost:${ port }`);
    }
})