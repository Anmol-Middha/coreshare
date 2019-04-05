const mongoose = require('mongoose');
const Schema = mongoose.Schema;

capsuleschema = new Schema({
    _id: String,
    name: String,
    capsule: String
});

module.exports = mongoose.model("capsule", capsuleschema);

