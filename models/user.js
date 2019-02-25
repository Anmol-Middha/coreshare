const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userschema= new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    emailId: {type: String, required: true, match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/], unique: true},
    password: {type: String, required: true},
    secretkey: {type: String},
    gdriveid: {type: String},
    dropboxid: {type: String}
});

module.exports = mongoose.model("users", userschema);
