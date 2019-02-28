const {PythonShell} = require('python-shell');

module.exports = function (req, res, next){
try{
    let myPythonScriptPath = '/home/anmolmiddha/Projects/coreshare/server/api/python/encrypt.py';
    const pyshell = new PythonShell(myPythonScriptPath);
    let path = req.file.path;  
    pyshell.send(path);
    req.filepath = path;
    
    pyshell.on("message", function(data){
        req.filepath = data;
        
    })
    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if(err){
            res.status(500).json(err);
        }
    });

    next();
}
catch(error) {
    return res.status(401).json({
        message: "Invalid token Auth failed"
    })
}
}