const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../../models/user.js');
router.post('/signup', (req, res, next) =>{
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
            return res.status(500).json({
                message: err.message,
                err
            });
        }
        else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                emailId: req.body.email,
                password: hash
            })
            .save()
            .then(rslt => {
                res.status(201).json({
                    message: "User created"
                });
            })
            .catch(err => {
                res.status(500).json({
                    err,
                    message: err.message
                });  
            });
        } 
    });    
}); 

router.post('/login', (req, res, next)=> {
    User.find({emailId: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                message: "No such Entry found"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, rslt)=> {
            if(err){
                return res.status(404).json({
                    message: 'Auth failed',
                    err
                })
            }
            if(rslt){
                const token = jwt.sign({
                    email: user[0].emailId,
                    _id: user[0]._id
                },
                process.env.TOKEN_KEY, 
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: "Auth successfull",
                    token
                })
            }
            res.status(401).json({
                message: "password didn't match"
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            err
        });
    })
});

router.delete('/:userid', (req, res, next) => {
    const id = req.params.userid;
    User.remove({_id: id})
    .exec()
    .then((rslt) => {
        res.status(200).json({
            message: `User with id ${id} successfully deleted`,
        })
    })
    .catch((err) => {
        res.status(500).json({
            err,
            message: err.message
        })
    })
});

module.exports = router;
