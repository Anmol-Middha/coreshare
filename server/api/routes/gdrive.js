const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({dest: './server/uploads/gdrive/'});
const {google} = require('googleapis');
const mongoose = require('mongoose');

const User = require('../../../models/user.js');
const Authorise = require('../middleware/gauthorise.js');
const Encrypt = require('../middleware/encrypt.js');

router.post('/', Authorise, (req, res) => {
    const auth = req.auth;
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        q: "trashed=false",
        pageSize: 10,
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

router.post('/share/:fileid', Authorise, (req, res) =>{
    User.find({emailId: req.body.toemail},{email: 0, password: 0})
    .exec()
    .then(user =>{
        console.log(user);
        const auth = req.auth;
        const fileId = req.params.fileid;
        const dest = fs.createWriteStream('./server/tempshare/gdrive/input.txt');
        const drive = google.drive({version: 'v3', auth});
        drive.files.get({
            fileId: fileId,
            alt: 'media'
        }, {responseType: 'stream'}, function(err, rslt){
            rslt.data.on('end', ()=>{
                res.sendFile(path.join(__dirname, './../../tempshare/gdrive/input.txt'),
                {headers:{
                    receiverid:user[0]._id,
                }
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