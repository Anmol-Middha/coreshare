const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
gridfs.mongo = mongoose.mongo;

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
                            {message: `${curr_notif.metadata.receiver} shared a file(${curr_notif.filename}) with you`, sharedFileId: curr_notif._id})
                        )
                        res.status(200).json(notif_array);
                    });
                }
            });
        }
   }) 
});

router.post('/ignore', function(req, res){
    const sharedFileId = req.body.sfid;
    const conn = mongoose.connection;
    let gfs = gridfs(conn.db);
    gfs.remove({_id:sharedFileId}, function(err, rslt){
        if(err){
            res.status(500).json(err);
        }
        else{
            res.send("success");
        }
    });
})

module.exports = router;