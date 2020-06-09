
const minimist = require('minimist')

const args = minimist(process.argv.slice(2), {
    string: ['daemon'],
    boolean: [ "quiet", "conf", "help"],
    '--': true
})

const required_modules = {
    appilcation_modules: [
        './configuration.json',
        './dictionary',
        './database_relatives/dbmedium',
        './database_relatives/download_manager',
        './log_msg'
    ],
    node_modules: [
        'express',
        'path',
        'fs',
        'sqlite3',
        'minimist',
        'https',
        'helmet'
    ]
}

/**
 * Used to stop unnecessary start messages from been logged if the --quiet
 * flag was set
 * 
 * @param {String} msg 
 */
function msg_display(msg){
    if (!args['quiet'])
        console.log(msg)
}

/**
 * 
 * @param {String} module 
 * 
 * @returns {Object / Boolean}
 */
function import_module(module, faulting_modules){
    try{
        require(module)
        msg_display("OK .......... " + module)
    }catch(e){
        faulting_modules.push(module)
        msg_display("MISSING ..... " + module)
    }
}

/**
 * This function checks that all modules where imported correctly
 */
function check_imported_modules(){

    let faulting_modules = new Array()

    for (let [group_name, group] of Object.entries(required_modules)){
        msg_display(`( INFO ) Checking ${group_name}`)
        group.forEach(module => {
            import_module(module, faulting_modules)
        })
        msg_display('')
    }
    
    if (faulting_modules.length != 0) {
        console.error(`[ CRITICAL ] Missing ${faulting_modules.length} modules!`)
        process.exit()
    }else
        msg_display("( INFO ) Modules OK!")
}


if (args.help){
    console.log(`
    Usage:
        nodejs start_server.js [OPTIONS]

    Options:
        --quiet             Doesn't checks for modules
        --conf              Prints out configuration options
        --help              Prints this message
    `)
    process.exit()
}


if( args["conf"] ) {
    const conf = JSON.parse( JSON.stringify( require('./configuration.json') ) )
    let sens = new Array()
    
    conf.sensors.forEach(element => {
        sens.push({sensor: element})
    })

    console.log(`
Port:       ${conf.port}
Https:      ${conf.https ? "ON" : "OFF"}
Database:   ${conf.database}
Data-modules :`)
    console.table(conf.request_modules)
    console.log("\nSensors:")
    console.table(sens)
    console.log('')
}


check_imported_modules()
require('./web_server')


