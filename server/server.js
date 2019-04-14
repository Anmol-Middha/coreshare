const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const gridfs = require('gridfs-stream');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const app = express();
gridfs.mongo = mongoose.mongo;
let conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));



const gdriveRoute = require('./api/routes/gdrive.js');
const mboxRoute = require('./api/routes/mbox.js');
const userRoute = require('./api/routes/user.js');
const checkAuth = require('./api/middleware/check-auth.js');
const notificationRoute = require('./api/routes/notifications.js');

app.get('/*', function(req, res){
    res.render('index');
})

app.use('/gdrive', checkAuth, gdriveRoute);
app.use('/mbox', mboxRoute);
app.use('/user', userRoute);
app.use('/notifications', checkAuth, notificationRoute);

module.exports = app;