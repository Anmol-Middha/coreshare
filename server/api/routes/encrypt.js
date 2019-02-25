const express = require('express');
const router = express.Router();
const encrypt = require('../middleware/encrypt.js');

router.get('/encrypt', encrypt, (req,res) => {
    console.log("done");
})

module.exports = router;