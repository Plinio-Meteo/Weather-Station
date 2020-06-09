/** 
 * MODIFIED
 *
 * Database requests main handler
 * @author PlinioMeteo
 * @version 0.8
 * 
*/

// Imported modules and configuration file 
const c = JSON.stringify(require('../configuration.json'))
const configuration = JSON.parse(c)

const sql           = require('sqlite3').verbose()
const express       = require('express')

const Message       = require('../log_msg').Message
const dictionary = require('../dictionary').dictionary

    /** Configuration constants **/
const file_db = configuration.database
const req_list = configuration.request_modules  // Modules from the configuration file

const router = express.Router()
const db = new sql.Database(file_db, err => {
    if (err) 
        Message.ERR_CRITICAL("Error occurred while connecting to the database")
    else
        console.log("( INFO ) Database started correctly")
})

dictionary.refresh()  // start refreshing the values


/**
 * Sanitize the input from any dangerous character
 * Strict list of characters
 * 
 * @param {String or Array} argument 
 */
function sanitize(argument){
    // If the argument is an array, gets the first element
    let clean_argument = Array.isArray(argument) ? argument[0] : argument;

    // If the argument is a String containing a list of values separed by ',' , reassemble into Array 
    if (Array.isArray(argument) && argument.length > 1){
        for (let i = 1; i < argument.length; ++i){
            clean_argument += ',' + argument[i]
        }
    }
    // Replace dangerous characters and return sanitized Array or String depending on the original argument
    return clean_argument.replace(/[#£`~^§°<>|()\[\]@\+$&=\-\:;%\/\\"'?]/g,'')
}/** End Sanitize */


/**
 * Parse
 * 
 * @param {Object} req_query 
 * @param {String} sqlquery 
 */
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
 * Parse and stores the request's parameters, for undefined parameters set a default value equal to the current date
 * 
 * @param {Object} req_query 
 * @param {String} sqlquery 
 * @param {Array} parameters 
 */
function parameter_parser(req_query, sqlquery, parameters){

	let when_param;
    let precision = req_query.precision


    if ( req_query.when ) {

        when_param = sanitize(req_query.when == '' ? 'now' : req_query.when);
        sqlquery += dictionary[ when_param ]
        
        switch ( when_param ) { 
            case "real_time":
                precision = 'minutes'
                break
            case "now":
                precision = 'minutes'
                break
            case "today":
                precision = 'hour'
                break
            case "this_month":
                precision = 'day'
                break
            case "this_year":
                precision = 'month'
                break
            default:
                break
            
        }
        return [ sqlquery, precision, parameters ]
    }

    if( req_query.start) {
        [ sqlquery, parameters ] = build_query(req_query, sqlquery)
        return [ sqlquery, precision, parameters ]
    }

}/** End time_parameter_parser */


/**
 * Refine the database's output by obtaining the average of data that share the same time value
 * and returning an Array
 * 
 * @param {Object} data_object 
 * @param {Object} req 
 * @param {String} required_data 
 * 
 * @returns {Array}
 */
function remove_duplicates(data_object, precision, req_module){
    const data_array = Object.values(data_object)
    if (data_array.length < 1) return [];

    let duplicate_list = [];
    const time_data = precision == 'minutes' || precision == 'hour' || precision == 'day' || precision == 'month' ? precision : 'hour' ;


    required_data = req_module.column

    function getTime (index) {
        let ret = data_array && data_array[index] && data_array[index][time_data]   // Ricorda di spiegare l'errore
        return ret
    }

    for (let i = 0; ;++i){
        if (!data_array[i]) break;

        if (getTime(i) == getTime(i+1)){
            duplicate_list.unshift([]);
            let k = i;

            while (getTime(i) == getTime(k)){
                duplicate_list[0].push(k)
                ++k
            }
            i = k-1
        }
    }
    /**
     * Gets the list of duplicates and take the average from them, starting from the bottom of the data list,
     * then, deletes the duplicates
     */
    duplicate_list.forEach(macro => {

        let media = 0;
        macro.forEach(element => {
            media += data_array[element][required_data]
        })
        media /= macro.length
        data_array[macro[0]][required_data] = media
        data_array.splice(macro[1], macro.length-1)
    })
    
    return data_array
}/** END remove_duplicates */


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
        let query = `SELECT * FROM ${req_module.table} WHERE  `;
        let parameters = [];
        let precision;

		try {
     		[ query, precision, parameters ] = parameter_parser(req.query, query, parameters)
     		
     	} catch(e) {
            Message.ERR_SEVERE(`Error while parsing parameters: ${req.url}`, 500)
            res.status(500)
            res.send("An internal error has occurred")
            return null;
     	}
        
        raw_query = db.prepare(query, function(err1){
            if (err1) {
                Message.ERR_SEVERE(` Error while preparing the query: ${query} ${err1.message}`)
                res.status(500)
                res.send("An internal error has occurred")
            }
        })

        raw_query.all(parameters, (err, row) => {    // If OKAY, start formatting output
            if (err){
                Message.ERR_NOT_FOUND(req, 500)
                res.status(500)
                res.send("An internal error has occurred")
                return null
            }
            response = remove_duplicates(row, precision, req_module)
            res.status(200)
            res.json(JSON.stringify(response));
        })
    })
}/** End send_database_data */


/**
 * GET method requests handler
 * URL sintax :  `/data/temperature [?hour=***&day=***&month=***&year=***when=[now/today/this_month/this_year]]`
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


