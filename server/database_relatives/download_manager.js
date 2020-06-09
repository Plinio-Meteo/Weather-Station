/** 
 *
 * Download requests handler
 * @author PlinioMeteo
 * @version 0.1
 * 
**/

    /** Imported modules and configuration file **/
const c = JSON.stringify(require('../configuration.json'))
const configuration = JSON.parse(c)

const sql     = require('sqlite3').verbose()
const express = require('express')

const Message = require('../log_msg').Message

    /** Configuration constants **/
const file_db  = configuration.database
const req_list = configuration.request_modules  // Modules from the configuration file

const router = express.Router()
const db     = new sql.Database(file_db)


/**
 * Adds time predicates to the sql query based on the url parameters. These predicates are organized in a 
 * start point and an ending point
 * 
 * @param {Object} req_query 
 * @param {String} sqlquery
 * 
 * @returns {String} 
**/

function build_query(req_query, sqlquery){
    const start_date = req_query.start.replace(/[\\|!"£$%&\/()=?`^'\[\]*@#ç°§<>,;._]/g,'').replace('T', ' ')  // '-' and ':' are not replaced
    const end_date = req_query.end.replace(/[\\|!"£$%&\/()=?^'\[\]*@#ç°§<>,;._]/g,'').replace('T', ' ')
    
    const part1 = `datetime >= ?`;
    const part2 = `datetime <= ?`;

    const parameters = [ start_date, end_date ]

    sqlquery += part1 + " AND " +part2

    return [ sqlquery, parameters ];
}/** query builder */


/**
 * Gets the http parameters and pass them to the database, gets the database's response and sends it back to
 * the client in Json format. 
 * 
 * @param {Object} req      Http request from the clien
 * @param {Object} res      Http response for the client
 * @param {String} table    table requested
 */
function send_database_data (req, res, req_module) {
    db.serialize(() => {
        let query = `SELECT datetime, ${req_module.column} FROM ${req_module.table} WHERE `;
        let parameters = [];
		
		try {
        	[ query, parameters ] = build_query(req.query, query, parameters)
        	
        } catch(e) {
            Message.ERR_NOT_FOUND(req, 500)
            res.status(500)
            res.send("An internal error has occurred")
            return null;
     	}
        
        raw_query = db.prepare(query, function(err1){   // Non necessario, ma potrebbe servire in futuro
            if (err1) {
                Message.ERR_SEVERE(` Error while preparing the query: ${query} ${err1.message}`)
                res.status(500)
                res.send("An internal error has occurred")
                return null;
            }
        })
        raw_query.all(parameters, (err, row) => {    // If OKAY, start formatting output
            if (err){
                Message.ERR_NOT_FOUND(req, 500)
                res.status(500)
                res.send("An internal error has occurred")
                return null
            }

            switch (req.query.format){
                case 'txt':
                    let text = '';
                    row.forEach(element => {
                        text += element.datetime + '   ' + element[req_module.column] +'\n'
                    })
                    res.status(200)
                    res.type('txt')
                    res.send(text)
                    break

                case 'json':
                    res.status(200)
                    res.json(row)
                    break
            }
        })
    })
}/** End send_database_data */


/**
 * GET method requests handler
 * URL sintax :  `/data/download/temperature [?start=YYYYMMDDThh&end=YYYYMMDDThh&format=[json/txt]]`
 * 
 * For each class of data requests inside the `requests` property of the json
 * configuration file, creates a requests handler
 */

req_list.forEach(req_module => {

    router.get(req_module.path, (req, res) => {
        send_database_data(req, res, req_module)
    })
})

module.exports = router;


