const app = require('./../server/server.js')

app.listen('8080', (err)=>{
    if(err) throw err;
    console.log("running on port 8080");
});