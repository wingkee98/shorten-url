var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongodb');
require('dotenv/config');

var apiRoute = require('./server/routes/api');
var redirectRoute = require('./server/routes/redirect');

var port = process.env.PORT || '9000';
var app = express();

//set static folder
app.use(express.static(path.join(__dirname, 'dist/shorten-url')));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// router path middleware
app.use('/api', apiRoute);
app.use('/', redirectRoute);
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/shorten-url/index.html'));
});

// // connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB');
    })
    .catch((err) => {
        console.log('connected to DB failed ' + err);
    });

// set server
app.set('port', port);;

var server = http.createServer(app);
server.listen(port, () => {
    console.log('Server is ready on port ' + port + ' path ' + __dirname);
});
