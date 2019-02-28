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
    const document = req.filepath;
    const drive = google.drive({version: 'v3', auth});
    let fileMetadata = {name: (req.file.originalname).split(".")[0]};
    let media = {
        body: fs.createReadStream(document)
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
    const receiver = req.body.recemail;
    const auth = req.auth;
    const fileId = req.params.fileid;
    const dest = fs.createWriteStream('./server/tempshare/gdrive/input.txt');
    const drive = google.drive({version: 'v3', auth});
    drive.files.get({
        fileId: fileId,
        alt: 'media'
    }, {responseType: 'stream'}, function(err, rslt){
        console.log(rslt);
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