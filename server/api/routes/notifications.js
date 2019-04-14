const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
const fs = require('fs');
gridfs.mongo = mongoose.mongo;

const Capsule = require('../../../models/capsule.js');
const User = require('../../../models/user.js');
const Reencrypt = require('../middleware/reencrypt');

router.post('/count', (req, res)=>{
    const uid = req.body.uid;
    const conn = mongoose.connection;
    conn.db.collection('fs.files', function(err, collection){
        if(err){
            res.status(500).json({message: "No such collection found"});
        }
        else{
            collection.countDocuments({'metadata.receiver': uid}, function(err, rslt){
                if(err){
                    res.status(500).json(err);
                }
                else{
                    res.status(200).json(rslt);
                }
            });
        }
    });
});
router.post('/getall', (req, res)=>{
   const uid = req.body.uid;
   const conn = mongoose.connection;
   conn.db.collection('fs.files', function(err, collection){
       if(err){
           res.status(500).json({message: "No such collection found"});
       }
       else{
            collection.find({'metadata.receiver': uid}, function(err, rslt){
                if(err){
                    res.status(500).json(err);
                }
                else{
                    rslt.toArray(function(err, notifications){
                        let notif_array = notifications.map((curr_notif)=>(
                            {message: `${curr_notif.metadata.receiver} shared a file(${curr_notif.filename}) with you`, notificationId: curr_notif._id})
                        )
                        res.status(200).json(notif_array);
                    });
                }
            });
        }
   }) 
});

router.post('/ignore', function(req, res){
    const notificationId = req.body.nfid;
    console.log(sharedFileId);
    const conn = mongoose.connection;
    let gfs = gridfs(conn.db);
    gfs.remove({_id:notificationId}, function(err, rslt){
        if(err){
            res.status(500).json(err);
        }
        else{
            res.send("success");
        }
    });
})

router.post('/accept', function(req, res, next){
    const notificationId = req.body.nfid;
    const conn = mongoose.connection;
    let gfs = gridfs(conn.db);
    let chunks = [];
    gfs.findOne({_id: notificationId}, function(err, file){
        if(err){
            res.status(500).json(err)
        }
        else{
            const data = file.metadata;
            // req.filecapsule = data.capsule;
            Capsule.find({_id: data.cloudfileid})
            .exec()
            .then(capsule => {
                req.filecapsule = JSON.parse(capsule[0].capsule);
                req.sharefilename = capsule[0].name;
            })
            .catch(err=>{
                res.status(500).json(err);
            })

            User.find({_id: data.receiver}, {publickey: 1, privatekey: 1})
            .exec()
            .then(key => {
                req.receiverkey = key;
            })
            .catch(err => {
                res.status(500).json(err);
            });

            User.find({_id: data.sender}, {signingkey: 1, privatekey: 1, publickey: 1, verificationkey: 1})
            .exec()
            .then(key => {
                req.senderkey = key;
                const readstream = gfs.createReadStream({
                    _id: notificationId
                });
                readstream.on('data', chunk => {
                   chunks += chunk;
                });
                readstream.on("end", function () {
                   req.ciphertext = chunks;
                   console.log(req.ciphertext);
                   console.log(typeof(req.ciphertext));
                   next();
                });
            })
            .catch(err => {
                res.status(500).json(err);
            });   
        }
    });
}, Reencrypt)
module.exports = router;