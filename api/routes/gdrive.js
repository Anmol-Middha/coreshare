const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const {google} = require('googleapis');

const Authorise = require('../middleware/authorise.js');

router.post('/upload', Authorise, upload.single('filename'), (req, res, next)=>{
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