const {PythonShell} = require('python-shell');

module.exports = ((req, res) => {
    let myPythonScriptPath = '/home/anmolmiddha/Projects/coreshare/server/api/python/reencrypt.py';
    const pyshell = new PythonShell(myPythonScriptPath);
    const reencryptkeys = JSON.stringify({'signingkey': req.senderkey[0].signingkey, 'privatekey': req.senderkey[0].privatekey, 'verificationkey': req.senderkey[0].verificationkey, 'senderpublickey': req.senderkey[0].publickey, 'publickey': req.receiverkey[0].publickey, 'receiverprivatekey': req.receiverkey[0].privatekey, 'capsule': req.filecapsule, 'ciphertext': req.ciphertext});
    pyshell.send(reencryptkeys);

    pyshell.on('message', data =>{
        console.log(data);
    });

    pyshell.end(rslt=>{
        res.send(rslt);
    })
});