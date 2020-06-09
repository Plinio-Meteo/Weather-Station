/** 
 *
 * Manager of the Chart-relative inputs and Database-interrogation processes
 * 
 * @author PlinioMeteo
 * @version 0.4
 * 
 */

let time_set = {
    axis: new Array(),
    unit: 'hour',
    formats: {
        minute: 'HH:mm',
        hour: 'HH',
        day: 'DD-MM-YYYY',
        month: 'MM-YYYY',
        year: 'YYYY'
    }
};


// Define new method for Date class to get the number of days in a given or current month
/**
 * @param {Integer} month Selected month
 * 
 * @returns {Integer}
 */
Date.monthDays = function (month) {
    const d = new Date((new Date).getFullYear(),(month ? month : (new Date).getMonth()) + 1, 0)
    return d.getDate();
}


/**
 * Time lapse shown on the chart
 * 
 * @param {String} lapse Time of time lapse to parse
 * @param {Integer} month Month of the year
 * 
 * @returns void
 */
function setTimeUnity (lapse) {
    switch (lapse){
        case 'now':
            time_set.axis = [moment().startOf('hour').toDate(), moment().endOf('hour').toDate()]
            time_set.unit = 'minutes'
            break
        case 'today':
            time_set.axis = [moment().startOf('day').toDate(), moment().endOf('day').toDate()]
            time_set.unit = 'hour'
            break
        case 'this_month':
            time_set.axis = [moment().startOf('month').toDate(), moment().endOf('month').toDate()]
            time_set.unit = 'day'
            break
        case 'this_year':
            time_set.axis = [moment().startOf('year').toDate(), moment().endOf('year').toDate()]
            time_set.unit = 'month'
    }
}


////////////////////
////////////////////
////AVVIO PAGINA
////////////////////
////////////////////

window.onload = function () {
    dictionary = loadTextFileAjaxSync("/dictionary")
    const ctx = document.getElementById('canvas').getContext('2d');
    myChart = new Chart(ctx, config);
    create_button()

}



function loadTextFileAjaxSync(filePath, mimeType)
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);
    if (mimeType != null) 
        if (xmlhttp.overrideMimeType) 
            xmlhttp.overrideMimeType(mimeType);
    

    xmlhttp.send();
    if (xmlhttp.status==200)
        return JSON.parse(xmlhttp.responseText)
    
    else    // TODO Throw exception
        return null;

}


/**
 * 
 * Events-related functions
 * 
*/

function DisablePreset_AbleDayMonthYear() {

    document.getElementById("pre_set").value = null;

}

function DisableDayMonthYear_AblePreset() {

    document.getElementById("day1").value    = null;
    document.getElementById("day2").value    = null;
    document.getElementById("month1").value  = null;
    document.getElementById("month2").value  = null;
    document.getElementById("year1").value   = null;
    document.getElementById("year2").value   = null;

}



function cbClick (e) {
    e = e || event;
    let cb = e.srcElement || e.target;

    if (cb.type !== 'checkbox')
        return true;

    let cbxs = document.getElementById('sensor_button').getElementsByTagName('input');
    let i = cbxs.length;

    while ( i-- )
        if (cbxs[i].type && cbxs[i].type == 'checkbox' && cbxs[i].id !== cb.id )
            cbxs[i].checked = false;
    
}


function create_button(){
    const dictionary_keys = Object.keys(dictionary)
    const dictionary_values = Object.values(dictionary)

    let array = []
    for (let j = 0; j < dictionary_keys.length ; j++){
        let item = dictionary_keys[j]
        array.push(
            `<input id="${item}" class="sensors" value="${item}" type="checkbox" onclick="cbClick(event)">`+
            `<label for="${item}" >${item} ${dictionary_values[j]['unit']}</label>`
        );

    }
    let html = array.join('');
    $('#sensor_button').html(html)
}




////////////////////
////////////////////
////AVVIO GRAFICO
////////////////////
////////////////////
async function view_data () {

    const when = document.getElementById("pre_set").value;

    let day1 = document.getElementById("day1").value
    let day2 = document.getElementById("day2").value
    let month1 = document.getElementById("month1").value
    let month2 = document.getElementById("month2").value
    let year1 = document.getElementById("year1").value
    let year2 = document.getElementById("year2").value

    // In case of blank inputs, time-values are set to the current datetime
    if (!day1)
        day1 = moment().format('DD')
    if (!day2)
        day2 = moment().format('DD')

    if (!month1)
        month1 = moment().format('MM')
    if (!month2)
        month2 = moment().format('MM')  

    if (!year1)
        year1 = moment().format('YY')
    if (!year2)
        year2 = moment().format('YY')


    const start_date = `${year1}-${month1}-${day1}T00:00:00`
    const end_date = `${year2}-${month2}-${day2}T23:59:59`

    let query_param = ''


    myChart.data.datasets = []   // Clears dataset

    if (when) {
        setTimeUnity(when)
        query_param = `when=${when}`
    }else{
        const Tdiff =  moment(end_date) - moment(start_date)

        time_set.axis = [ moment(start_date).toDate(), moment(end_date).toDate() ]
        query_param = `start=${start_date}&end=${end_date}`

        if ( Tdiff <= 14400000 )  // 4 hours
            time_set.unit = 'minutes'
        else if ( Tdiff <= 259200000  ) // 3 days
            time_set.unit = 'hour'
        else if ( Tdiff <= 7889400000 ) // 3 months
            time_set.unit = 'day'
        else
            time_set.unit = 'month'
    }

    query_param += `&precision=${time_set.unit}&nocache=${(new Date()).getTime()}`;


    const dictionary_keys = Object.keys(dictionary)
    let item; 
    let sensors = []
    for (let j = 0; j < dictionary_keys.length ; j++){
        item = dictionary_keys[j]

        if (document.getElementById(item).checked){
            sensors.push(item)
        }
    }

    for (let i = 0; i < sensors.length ; i++){
        let element = sensors[i]
        let data_list = new Array()

        data = await as_requestJson(`/data/${element}?${query_param}`)

        data.forEach(single => {
            data_list.push({
                x: single.datetime,
                y: single[dictionary[element].name]
            })
        })

        myChart.options.scales.xAxes[0].time.unit = time_set.unit;
        myChart.options.scales.xAxes[0].time.displayFormats = time_set.formats;

        myChart.options.scales.yAxes = [{
            display: true,
            ticks: {
                suggestedMin: dictionary[element]['min'],
                suggestedMax: dictionary[element]['max']
            },
            gridLines: {
                display: true,
                lineWidth: 1,
                zeroLineColor: 'grey',
                color: 'grey'
            }
        }]

        replaceData(myChart, time_set.axis, "#fff", data_list, 0, `${element}`, '#fff','#fff','#fff');
    }
}