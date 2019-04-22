const {PythonShell} = require('python-shell');
const mongoose = require('mongoose');
const http = require('http');
const axios = require('axios');
const Path = require('path');

module.exports = ((req, res) => {
    let myPythonScriptPath = Path.join(__dirname, '../python/reencrypt.py');
    const pyshell = new PythonShell(myPythonScriptPath);
    const reencryptkeys = JSON.stringify({'signingkey': req.senderkey[0].signingkey, 'privatekey': req.senderkey[0].privatekey, 'verificationkey': req.senderkey[0].verificationkey, 'senderpublickey': req.senderkey[0].publickey, 'publickey': req.receiverkey[0].publickey, 'receiverprivatekey': req.receiverkey[0].privatekey, 'capsule': req.filecapsule, 'ciphertext': req.ciphertext, 'sharefilename': req.sharefilename});
    pyshell.send(reencryptkeys);

    pyshell.on('message', data =>{
        req.destpath = data;
    });

    pyshell.end(()=>{
        axios.post('http://localhost:8080/mbox/upload', {destpath: req.destpath, filename: req.sharefilename})
        .then(() => {
            res.status(200).send("decryption completed");
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
});