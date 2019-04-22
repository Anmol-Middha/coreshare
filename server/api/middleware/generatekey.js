const {PythonShell} = require('python-shell');
const Path = require('path');

module.exports = function (req, res, next){
try{
    let myPythonScriptPath = Path.join(__dirname, '../python/generatekey.py');
    const pyshell = new PythonShell(myPythonScriptPath);
    pyshell.on("message", function(data){
        req.keys = data
    });

    pyshell.end(function (err, rslt) {
        if(err){
            throw err;
        }
        else{
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