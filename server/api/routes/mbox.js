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
        console.log(response);
    })
    .catch(function(error) {
        console.log(error);
    });
})

router.post('/upload', (req, res)=>{
//create session
    const dropbox = dropboxV2Api.authenticate({
        token: 'jKuLkh-knBAAAAAAAAAADJDRC9nnNGfeagiXTj0T9DfeQXdwI84tGfI_NjaRZ4-z'
    });

//create upload stream
    const uploadStream = dropbox({
        resource: 'files/upload',
        parameters: {
            path: '/' + req.body.filename
        }
    }, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        else{
            console.log(result);
            res.status(200).json(result);
        }
    });
    //use nodejs stream
    fs.createReadStream(req.body.destpath).pipe(uploadStream);
});

module.exports = router;