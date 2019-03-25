const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userschema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    emailId: {type: String, required: true, match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/], unique: true},
    password: {type: String, required: true, match:/([^\s])/},
    privatekey: {type: String, required: true},
    publickey: {type: String, required: true},
    signingkey: {type: String, required: true},
    verificationkey: {type: String, required: true},
});

module.exports = mongoose.model("users", userschema);

