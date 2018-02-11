const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.listen(port, error => {
    if(error) {
        console.log('error!');
    }
    else {
        console.log(`Server start! Listening on localhost:${ port }`);
    }
})