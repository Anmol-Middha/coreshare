const {PythonShell} = require('python-shell');
const multer = require('multer');
const upload = multer({dest: './server/uploads/gdrive/'});


module.exports = (upload.single('filename'), (req, res, next)=>{
    let myPythonScriptPath = '/home/anmolmiddha/Projects/coreshare/server/api/python/sample.py';
    console.log("from encrypt");
    console.log(req.file);
    const pyshell = new PythonShell(myPythonScriptPath);
    const filepath = req.file.path;

    pyshell.send(filepath);
    
    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if (err){
            throw err;
        };

        console.log('finished');

    });
    next();
});