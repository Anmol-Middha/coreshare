const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: './server/uploads/gdrive/'});
const {google} = require('googleapis');

const Authorise = require('../middleware/gauthorise.js');
const Encrypt = require('../middleware/encrypt.js');

router.post('/upload', Authorise, upload.single('filename'), Encrypt, (req, res)=>{
    const auth = req.auth;
    const document = req.file;
    const drive = google.drive({version: 'v3', auth});
    let fileMetadata = {'name': document.originalname};
    let media = {
        mimeType : document.mimetype,
        body: fs.createReadStream("/home/anmolmiddha/Projects/coreshare/server/uploads/gdrive/83aab2d66ae46bb282e6098dc453d91f")
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

router.get('/share/:fileid', Authorise, (req, res) =>{
    const auth = req.auth;
    console.log(auth);
    const fileId = req.params.fileid;
    const dest = fs.createWriteStream('./server/tempshare/gdrive/photo.png');
    const drive = google.drive({version: 'v3', auth});
    drive.files.get({
        fileId: fileId,
        alt: 'media'
    }, {responseType: 'stream'}, function(err, rslt){
        rslt.data.on('end', (rslt)=>{
            res.status(200).json(rslt);
        })
        .on('error', err=>{
            res.status(500).json(err);
        })
        .pipe(dest);
    });
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