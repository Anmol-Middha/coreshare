const {PythonShell} = require('python-shell');

module.exports = function (req, res, next){
try{
    let myPythonScriptPath = '/home/anmolmiddha/Projects/coreshare/server/api/python/encrypt.py';
    const pyshell = new PythonShell(myPythonScriptPath);
    let path = req.file.path;
    pyshell.send(path);
    pyshell.on("message", function(data){
    });
        
    pyshell.end(function (err, rslt) {
        if(err){
            res.status(500).json(err);
        }
        else{
            req.filepath = JSON.stringify(path).split('"')[1];
            next(rslt);
        }
    });
}
catch(error) {
    return res.status(401).json({
        message: "Invalid token Auth failed"
    })
}
}