

class log_msg_err {

    get current_datetime (){
        const now = new Date()
        const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        return ' ' + date + ' ' + time + ' '
    }

    constructor (){
        this.fs = require('fs')
        
        this.hello = 3,
        this.log_file = "./server.log",
        this.s_critical = "<[ CRITICAL  ]>".red + this.current_datetime,
        this.s_severe   = " [  SEVERE   ] " + this.current_datetime,
        this.s_not_found= " ( NOT FOUND ) " + this.current_datetime,
        this.s_request  = "  ( REQUEST )  " + this.current_datetime


        try{
            this.writeStream = this.fs.createWriteStream(this.log_file, {flags: 'a'})
        }catch(e){
            console.error(`${this.s_critical} Error occurred while opening the file ${this.log_file}`)
            process.exit();
        }
    }

    LOG ( text , callback) {
        text += '\n'
        this.writeStream.write(text, err => {
            if (err) {
                console.error(`${this.s_critical} Failed to write in ${this.log_file}`)
                throw err;
            }
            if (callback)
                callback()
        });
    }

    FATAL (text) {
        console.error(text)
        console.log("Exiting...")

        this.writeStream.close()
        process.exit()
    }

    ERR_CRITICAL (text){
        this.LOG(this.s_critical + text, () => {
            this.FATAL(this.s_critical + text)
        })
    }

    ERR_SEVERE (text) {
        this.LOG(this.s_severe + text)
    }

    ERR_NOT_FOUND (req, statuscode) {
        const ip = req.ip;
        const method = req.method;
        const url = req.originalUrl;
        this.LOG(this.s_not_found + ip + ' ' + method + ' ' + url + ' RETURN ' + statuscode)
    }

    LOG_REQUEST (req) {
        const ip = req.ip;
        const method = req.method;
        const url = req.originalUrl;
        this.LOG(this.s_request + "from " + ip + ' ' + method + ' ' + url)
    }
}
const message = new log_msg_err()
//message.LOG()
module.exports.Message = message
