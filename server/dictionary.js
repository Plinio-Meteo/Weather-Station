
const c = JSON.stringify(require('./configuration.json'))
const configuration = JSON.parse(c)

class DataType {
    constructor(configuration){
        // Appends keys and values to the data_type object based on the configuration modules
        configuration.request_modules.forEach(element => {
            const dictionary_obj = {
                name: element.column,
                unit: element.unit ? element.unit : '',
                max: element.max ? element.max : 100,
                min: element.min ? element.min : 0
            }
            this[element.path.slice(1)] = dictionary_obj
        });
    }
}


class Dictionary extends DataType {

    timeGetter(timeFunction){
        let value;
        if (timeFunction > 9 )
            value = timeFunction.toString()
        else
            value = '0' + timeFunction
    
        return `"${value}"`;
    }

    sminute () {
        const timeFunction = (new Date()).getMinutes()
        return this.timeGetter(timeFunction)
    };
    
    shour () {
        const timeFunction = (new Date()).getHours()
        return this.timeGetter(timeFunction)
    };
    
    sday () {
        const timeFunction = (new Date()).getDate()
        return this.timeGetter(timeFunction)
    };
    
    smonth () {
        const timeFunction = (new Date()).getMonth() + 1;
        return this.timeGetter(timeFunction)
    };
    
    syear () {
        let value;
        value = (new Date()).getFullYear() 
        return `"${value}"`;
    };

    constructor(configuration){
        super(configuration)

        this.real_time = `minutes = ${this.sminute()} AND hour = ${this.shour()} AND day = ${this.sday()} AND month = ${this.smonth()} AND year = ${this.syear()}`
        this.now = `hour = ${this.shour()} AND day = ${this.sday()} AND month = ${this.smonth()} AND year = ${this.syear()}`
        this.today = `day = ${this.sday()} AND month = ${this.smonth()} AND year = ${this.syear()}`
        this.this_month = `month = ${this.smonth()} AND year = ${this.syear()}`
        this.this_year = `year = ${this.syear()}`
    }

    refresh() {
        setInterval( () => {
            this.real_time = `minutes = ${this.sminute()} AND hour = ${this.shour()} AND day = ${this.sday()} AND month = ${this.smonth()} AND year = ${this.syear()}`
            this.now = `hour = ${this.shour()} AND day = ${this.sday()} AND month = ${this.smonth()} AND year = ${this.syear()}`
            this.today = `day = ${this.sday()} AND month = ${this.smonth()} AND year = ${this.syear()}`
            this.this_month = `month = ${this.smonth()} AND year = ${this.syear()}`
            this.this_year = `year = ${this.syear()}`
        }, 6000)
    }
}

module.exports.data_type_conversion = new DataType(configuration);
module.exports.dictionary = new Dictionary(configuration);