const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const gdriveRoute = require('./api/routes/gdrive.js');
const userRoute = require('./api/routes/user.js');
const checkAuth = require('./api/middleware/check-auth.js');

app.use('/gdrive', checkAuth ,gdriveRoute);
app.use('/user', userRoute);

app.listen('8080', (err)=>{
  if(err) throw err;
  console.log("running on port 8080");
});
