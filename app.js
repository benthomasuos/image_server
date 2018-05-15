
 "use strict";
//================================================================
// Require modules
//================================================================
var ffmpeg = require('fluent-ffmpeg');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const fileUpload = require('express-fileupload');
const router = require('express').Router();
const config = require(__dirname + '/config.js')


var fileServer = config.fileServer

//================================================================
const app = express();
const port = process.env.PORT || 8080






//================================================================
//  Express server setup code
//================================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(fileServer));
app.use(express.static("static"));
app.use(favicon( __dirname + '/static/images/star_icon.png'));
app.set('view engine', 'ejs');



app.use(fileUpload({
  limits: { fileSize: 50000 * 1024 * 1024 },
}));

//  Link routes to main app

app.use( '/', require('./routes') )


app.use(helmet())




app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'Options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
});


//================================================================
// Error routing area
//================================================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(req, res, next) {
  next(createError(401));
});


// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(401);
  res.render('401');
});

app.use(function(err, req, res, next) {
  // render the error page
  res.status(404);
  res.render('404');
});





//================================================================
//  Start the Express web server
//================================================================
app.listen(port, function(){
    console.log("Server started and listening on port " + port )
})
