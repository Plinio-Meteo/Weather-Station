/** 
 *
 * Simple library used in chart_builder.js and index.html
 * @author PlinioMeteo
 * @version 0.1
 * 
 */

/**
 * Base class used for all the datas retrieved by the server, contains various configurations for the chart
 * 
 * 
 * @param {String [rgba color]} data_color      Color shown on the Chart
 * @param {Integer} min_value   minimum value for the data shown on th Chart
 * @param {Integer} max_value   maximum value for the data shown on the Chart
 * @param {String} tag          name referred to the data, this string is used in combination with the dictionary  
*/
class DataGenerals{
    constructor(data_color, min_value, max_value, tag){
        this.values = new Array(),
        this.color = data_color,
        this.min = min_value,
        this.max = max_value,
        this.name = tag
    }
}

//######################################################
//                  DOCUMENT INTERATIONS
//######################################################

function getObjectbyClass(class_name){
    let objects = [];

    let input = document.getElementsByClassName(class_name);
    for(let i=0 ; input[i]; ++i){
        let ob = {
            id: input[i].id,
            name: input[i].name,
            value: input[i].value
        }
        objects.push(ob)
    }
    return objects;
}


/**
 * Gets values of different input tags with the same class
 * It can be used on checkbox or radio inputs
 * 
 * @param {String} class_name 
 * 
 * @returns {Array}
 */
function getValuebyClass(class_name) {
    let checkedValue = [];
    let input = document.getElementsByClassName(class_name);
    for(let i=0 ; input[i]; ++i){
        if(input[i].checked){
            checkedValue.push(input[i].value);
        }
    }
    return checkedValue;
}


/**
 * Send a request to the given url and wait for a json object, then parses it into an array
 * 
 * @param {String} url_query 
 * 
 * @returns {Array}
 */
async function as_requestJson(url_query){
    const response = await fetch(url_query)

    if (response.ok) {
        const raw_data = await response.json() // Get the datas in Json format
        return JSON.parse(raw_data) ;

    } else 
        return [] ;
}

async function as_requestJson_noparse(url_query){
    const response = await fetch(url_query)

    if (response.ok) {
        const raw_data = await response.json() // Get the datas in Json format
        return raw_data ;

    } else 
        return [] ;
}
//######################################################
//                  CHART MANAGEMENT
//######################################################

Chart.defaults.global.defaultFontColor='white';
Chart.defaults.global.defaultFontFamily = 'Arial Black';
Chart.defaults.global.legend.display = false;

function replaceData(chart, label, color, data, element, name, border_color, point_color, point_border) {
    const new_data = {
        label: name,
        backgroundColor: color,
        data: data,
        borderColor: border_color,
        pointBackgroundColor: point_color,
        pointBorderColor: point_border,
    };
    chart.data.datasets.push(new_data)
    chart.data.labels = (label);
    chart.update();
};


function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

//=====================================
//     END LIBRARY
//=====================================

let config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [],
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        elements:{
            line:{
                fill: false
            }
        },
        animation: false,
        title: {
            text: ''
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    parser: 'YYYY-MM-DD HH:mm:ss'
                },
                scaleLabel: {
                    display: true,
                    labelString: ''
                },
                gridLines: {
                    display: true,
                    lineWidth: 1,
                    zeroLineColor: 'grey',
                    color: 'grey'
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: -20,
                    suggestedMax: 60
                },
                gridLines: {
                    display: true,
                    lineWidth: 1,
                    zeroLineColor: 'grey',
                    color: 'grey'
                }
            }]
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 50,
                bottom: 0
            }

        },

    }

}
