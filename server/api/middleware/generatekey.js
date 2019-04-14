const {PythonShell} = require('python-shell');

module.exports = function (req, res, next){
try{
    let myPythonScriptPath = '/home/anmolmiddha/Projects/coreshare/server/api/python/generatekey.py';
    const pyshell = new PythonShell(myPythonScriptPath);
    pyshell.on("message", function(data){
        // console.log(data);
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