const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

console.log(__dirname);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const indexRoute = require('./api/routes/index.js');
const gdriveRoute = require('./api/routes/gdrive.js');
const userRoute = require('./api/routes/user.js');
const checkAuth = require('./api/middleware/check-auth.js');
const dashboardRoute = require('./api/routes/dashboard.js');

app.use('/', indexRoute);
app.use('/dahboard/gdrive', checkAuth ,gdriveRoute);
app.use('/user', userRoute);
app.use('/dashboard', dashboardRoute);

module.exports = app;