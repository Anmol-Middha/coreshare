const mongoose = require('mongoose');
const Schema = mongoose.Schema;

gdriveschema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    token: {type: String, required: true}
})

module.exports = mongoose.model("gdrive", gdriveschema);