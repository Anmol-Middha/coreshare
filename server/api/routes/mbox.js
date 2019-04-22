const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');
const isomorphicfetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const dropboxV2Api = require('dropbox-v2-api');

router.post('/', (req, res, next)=>{
    const dbx = new Dropbox({ accessToken: "jKuLkh-knBAAAAAAAAAADJDRC9nnNGfeagiXTj0T9DfeQXdwI84tGfI_NjaRZ4-z" });
    dbx.usersGetCurrentAccount()
    .then(function(response) {
        console.log(response);
    })
    .catch(function(error) {
        console.error(error);
    });
    dbx.filesListFolder({path: ''})
    .then(function(response) {
        res.send(response.entries);
    })
    .catch(function(error) {
        console.log(error);
    });
})

router.post('/upload', (req, res)=>{
    const pathdb = "/" + req.body.filename;
    const dropbox = dropboxV2Api.authenticate({
        token: 'jKuLkh-knBAAAAAAAAAADJDRC9nnNGfeagiXTj0T9DfeQXdwI84tGfI_NjaRZ4-z'
    });

    const uploadStream = dropbox({
        resource: 'files/upload',
        parameters: {
            path: pathdb
        }
    }, (err, result) => {
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(200).json(result);
        }
    });
    fs.createReadStream(req.body.destpath).pipe(uploadStream);
});

module.exports = router;