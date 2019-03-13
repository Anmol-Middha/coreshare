const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const gdriveRoute = require('./api/routes/gdrive.js');
const userRoute = require('./api/routes/user.js');
const checkAuth = require('./api/middleware/check-auth.js');

app.get('/*', function(req, res){
    res.render('index');
})

app.use('/gdrive', checkAuth, gdriveRoute);
app.use('/user', userRoute);

module.exports = app;