/* 
 * Open a web server
*/

// Custom modules

const configuration = JSON.parse( JSON.stringify( require('./configuration.json') ) );
const dic_data_type = require('./dictionary').data_type_conversion
const Message       = require('./log_msg').Message

// Nodejs modules
const express   = require('express');
const helmet 	= require('helmet');
const https     = require('https');
const path      = require('path');
const fs        = require('fs');


// Setup constants
const app           = express();
const port          = configuration.port;
const dirpath       = path.join(__dirname, '../public');
const dbroute       = require('./database_relatives/dbmedium');
const downloadroute = require('./database_relatives/download_manager');


// Security costants
const ssl_dir 	= "/ssl";
const ssl_ca 	= configuration.https_ca;
const ssl_key 	= configuration.https_key;
const ssl_cert 	= configuration.https_certificate;

let whitelist;
fs.readdir(dirpath, (err, file) => {
    if (err)
        Message.ERR_CRITICAL(`An error occurred while reading ${dirpath} directory! `)
    
    whitelist =  file

})
let https_credentials
if(configuration.https){
https_credentials = {
    ca: fs.readFileSync(__dirname + ssl_dir + '/' + ssl_ca, 'ascii'),
    key: fs.readFileSync(__dirname + ssl_dir + '/' + ssl_key, 'ascii'),
    cert: fs.readFileSync(__dirname + ssl_dir + '/' + ssl_cert, 'ascii')

}
}

// App setup
app.use(helmet());
app.use(express.static(dirpath));
app.use('/data', dbroute);
app.use('/download', downloadroute);

/**
 * Request handlers
*/


app.get('/dictionary', (req, res) => {
    res.status(200)
    res.json(dic_data_type)
})

app.get('*',(req, res) => {

    Message.LOG_REQUEST(req)

    let load_page = req.path
    if (load_page == '/'){
        load_page = '/index.html'
    }

    if (load_page.slice(1) in whitelist)
        whitelist.forEach(file => {     // Iterate through the whitelist to find the file
            if ( load_page == ('/' + file) ) {
                res.status(200).sendFile(path.join(dirpath, load_page))
            }
        })
    else{
        Message.ERR_NOT_FOUND(req, 404)
        res.status(404).send('No page found!')  
    }
})


// START SERVER

let server;

// check for the https flag
if ( configuration.https ) {
    server = https.createServer(https_credentials, app);

	
}else 
    server = app;


server.listen(port, err => {
    console.log(`( INFO ) Listening on port ${port}`)
})
  .on('error', e => {
	if (e)
	console.log(e)
        Message.ERR_CRITICAL(`Error occurred while opening port ${port}`)
    
})


