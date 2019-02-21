const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

const uploadRoute = require('./api/routes/gdrive.js');
app.use('/gdrive', uploadRoute);

app.listen('8080', (err)=>{
  if(err) throw err;
  console.log("running on port 8080");
});
