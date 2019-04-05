const {PythonShell} = require('python-shell');
const User = require('../../../models/user.js');

module.exports = function (req, res, next){

User.find({_id: req.body.uid}).exec()
.then(user=>{
    const pblc_key = user[0].publickey;
    let myPythonScriptPath = '/home/anmolmiddha/Projects/coreshare/server/api/python/encrypt.py';
    const pyshell = new PythonShell(myPythonScriptPath);
    let path = req.file.path;
    let pydata = path.toString() + ",.," + pblc_key;
    pyshell.send(pydata);
    pyshell.on('message', function(data){
        req.capsule = data;
        console.log(data);
    })      
    pyshell.end(function (err, rslt) {
        if(err){
            res.status(500).json(err);
        }
        else{
            req.filepath = JSON.stringify(path).split('"')[1];
            next(rslt);
        }
    });
})    
.catch(err=> {
    return res.status(401).json({
        message: "Invalid token Auth failed"
    })
});
}