const express = require('express');
const router = express.Router();
const checkAuth = require('./../middleware/check-auth.js');

router.get('/', checkAuth, (req,res)=>{
    console.log(req.headers);
    res.render('index');
})
module.exports = router;