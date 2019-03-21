const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
const {google} = require('googleapis');
const upload = multer({dest: './server/uploads/gdrive/'});

const User = require('../../../models/user.js');
const Authorise = require('../middleware/gauthorise.js');
const Encrypt = require('../middleware/encrypt.js');

router.post('/', Authorise, (req, res) => {
    const auth = req.auth;
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        q: "trashed=false",
        fields: 'nextPageToken, files(id, name)',
        trashed: false
    }, (err, rslt) => {
        if(err){
            res.status(500).json(err);
        }
        else{
            const files = rslt.data.files;
            res.status(200).json(files);
        }
    });
});

router.post('/upload', Authorise, upload.single('filename'), Encrypt, (req, res)=>{
    const auth = req.auth;
    const drive = google.drive({version: 'v3', auth});
    let fileMetadata = {name: req.file.originalname.split(".")[0]};
    let media = {
        body: fs.createReadStream(path.join(__dirname, '../../../', req.filepath))
    };
    drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, name'       
    }, function(err, file){
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(200).json({filename: file.data.name, fileid: file.data.id});
        }
    })
});

router.post('/share/:fileId', Authorise, (req, res) =>{
    const sid = req.body.senderId;
    const filename = req.body.filename;
    User.find({emailId: req.body.receiverEmail},{email: 0, password: 0})
    .exec()
    .then(user =>{
        const auth = req.auth;
        const fileId = req.params.fileId;
        const dest = fs.createWriteStream('./server/tempshare/gdrive/input.txt');
        const drive = google.drive({version: 'v3', auth});
        drive.files.get({
            fileId: fileId,
            alt: 'media',
            fields: '*'
        }, {responseType: 'stream'}, function(err, rslt){
            rslt.data.on('end', ()=>{
                gridfs.mongo = mongoose.mongo;
                let conn = mongoose.connection;
                    let gfs = gridfs(conn.db);
                    let writestream = gfs.createWriteStream({filename, metadata: {receiver: (user[0]._id).toString(), sender: sid}});
                    fs.createReadStream('/home/anmolmiddha/Projects/coreshare/server/tempshare/gdrive/input.txt').pipe(writestream);
                    writestream.on('close', function(file){
                        res.send('file created:' + file.filename);
                    });
            })
            .on('error', err=>{
                res.status(500).json(err);
            })
            .pipe(dest);
        });
    })
    .catch(err =>{
        res.status(500).json(err);
    }) 
});

router.post('/accept', Authorise, upload.single('sharedfile'), (req, res)=>{
    const auth = req.auth;
    const document = req.file;
    const drive = google.drive({version: 'v3', auth});
    let fileMetadata = {'name': document.originalname};
    let media = {
        mimeType : document.mimetype,
        body: fs.createReadStream(document.path)
    };
    drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id'       
    }, function(err, file){
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(200).json(`file with id ${file.data.id} successfully uploaded on google drive`);
        }
    })
});

module.exports = router;