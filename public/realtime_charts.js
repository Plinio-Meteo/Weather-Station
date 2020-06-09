
var value;

var ctx1 = document.getElementById('Chart1');
var ctx2 = document.getElementById('Chart2');
var ctx3 = document.getElementById('Chart3');
var ctx4 = document.getElementById('Chart4');
var ctx5 = document.getElementById('Chart5');
var ctx6 = document.getElementById('Chart6');

window.onload = function (){
    dictionary = loadTextFileAjaxSync("/dictionary")
    catch_data()
    view_data()

}

function getFields(input, field) {
    let output = [];
    for (let i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}
    
function loadTextFileAjaxSync(filePath, mimeType)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);
    if (mimeType != null) 
        if (xmlhttp.overrideMimeType) 
            xmlhttp.overrideMimeType(mimeType);
        

    xmlhttp.send();
    if (xmlhttp.status==200)
        return JSON.parse(xmlhttp.responseText)
    
    else 
        return null;
    
}

Chart.defaults.global.legend.display = false;

var pointBackground = [ //COME USARLO: ad ogni elemento elemento di questa lista corrisponde il colore visualizzato nei grafici
"#ff0000", "#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000",    
"#00e1ff", "#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff","#00e1ff",
"#fff", "#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff","#fff"
];


////////////////////////
////////////////////////
//INIZIO CREAZIONE CHART
////////////////////////
////////////////////////
dictionary = loadTextFileAjaxSync("/dictionary")
var dictionary_values = Object.values(dictionary)

var Chart1 = new Chart(ctx1, {
    backgroundColor: "#fff",
    type: 'line',
    data: {
        datasets: [],
        label: []
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
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: ''
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: dictionary_values[0]['min'],
                    suggestedMax: dictionary_values[0]['max']
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
});

var Chart2 = new Chart(ctx2, {
    backgroundColor: "#fff",
    type: 'line',
    data: {
        datasets: [],
        label: []
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
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: ''
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: dictionary_values[1]['min'],
                    suggestedMax: dictionary_values[1]['max']
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
});

var Chart3 = new Chart(ctx3, {
    backgroundColor: "#fff",
    type: 'line',
    data: {
        datasets: [],
        label: []
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
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: ''
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: dictionary_values[2]['min'],
                    suggestedMax: dictionary_values[2]['max']
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
});

var Chart4 = new Chart(ctx4, {
    backgroundColor: "#fff",
    type: 'line',
    data: {
        datasets: [],
        label: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        elements:{
            line:{
                fill: false
            }
        },
        animation: false,
        title: {
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: ''
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: dictionary_values[3]['min'],
                    suggestedMax: dictionary_values[3]['max']
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
});

var Chart5 = new Chart(ctx5, {
    backgroundColor: "#fff",
    type: 'line',
    data: {
        datasets: [],
        label: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        elements:{
            line:{
                fill: false
            }
        },
        animation: false,
        title: {
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: ''
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: dictionary_values[4]['min'],
                    suggestedMax: dictionary_values[4]['max']
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
});

var Chart6 = new Chart(ctx6, {
    backgroundColor: "#fff",
    type: 'line',
    data: {
        datasets: [],
        label: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        elements:{
            line:{
                fill: false
            }
        },
        animation: false,
        title: {
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: ''
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: dictionary_values[5]['min'],
                    suggestedMax: dictionary_values[5]['max']
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
});
////////////////////////
////////////////////////
////FINE CREAZIONE CHART
////////////////////////
////////////////////////


////////////////////////
////////////////////////
//DICHIARAZIONE FUNZIONI
////////////////////////
////////////////////////
Chart.defaults.global.defaultFontColor='white';
Chart.defaults.global.defaultFontFamily = 'Arial Black';

function replaceData(chart, label, color, data, element, name, border_color, point_color) {
    const new_dataset = {
        label: name,
        backgroundColor: point_color,
        data: data,
        borderColor: border_color,

    };
    chart.data.datasets.push(new_dataset)
    chart.data.labels = label;

    chart.update();
};


function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}


async function catch_data(){
    const dictionary = loadTextFileAjaxSync("/dictionary")
    const keys = Object.keys(dictionary)
    const chart_list = [Chart1, Chart2, Chart3, Chart4, Chart5, Chart6]
    
    for (let j = 0; j < keys.length ; j++){
        item = keys[j]

        const today_end = (new moment()).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const today_start = (new moment()).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const before_1_day = (new moment()).subtract(1, 'd').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const before_2_day = (new moment()).subtract(2, 'd').startOf('day').format('YYYY-MM-DDTHH:mm:ss');


        const data_today_end_start = await as_requestJson(`/data/${item}?start=${today_start}&end=${today_end}&precision=hour&nochache=${(new Date()).getTime()}`);
        const data_today_start_b1 = await as_requestJson(`/data/${item}?start=${before_1_day}&end=${today_start}&precision=hour&nochache=${(new Date()).getTime()}`);
        const data_b1_b2 = await as_requestJson(`/data/${item}?start=${before_2_day}&end=${before_1_day}&precision=hour&nochache=${(new Date()).getTime()}`);

        const raw_data_array = [ 
            {
                list: data_today_end_start,
                color: '#fff' // white
            },{
                list: data_today_start_b1,
                color: '#00e1ff' // 
            },{
                list: data_b1_b2,
                color: '#f00' // red
            } 
        ]

        const time_list = [ today_end, before_2_day ]

        
        chart_list[j].data.datasets = new Array()  // clears data list in charts

        chart_list[j].options.scales.xAxes[0] = {
            type: 'time',
            time: {
                parser: 'YYYY-MM-DD HH:mm:ss',
                displayFormats: {
                    minute: 'HH:mm',
                    hour: 'HH',
                    day: 'DD-MM-YYYY',
                    month: 'DD-MM-YYYY',
                    year: 'MM-YYYY'
                }
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

        }

        chart_list[j].options.scales.yAxes[0].gridLines = {
            display: true,
            lineWidth: 1,
            zeroLineColor: 'grey',
            color: 'grey'
        }


        raw_data_array.forEach( D_object => {

            let points_list = new Array()

            D_object.list.forEach( single => {
                points_list.push({
                    x: single.datetime,
                    y: single[dictionary[item].name]

                })

            })

            replaceData(chart_list[j], time_list, "#fff", points_list, 0, `${item}`, '#fff',D_object.color, D_object.color);

        })

        

    }

}

function roundTo(value, places){
    let power = Math.pow(10, places);
    return Math.round(value * power) / power;
}

var value0, value1, value2, value3, value4, value5
async function view_data(){
    const dictionary = loadTextFileAjaxSync("/dictionary")
    const dictionary_keys = Object.keys(dictionary)
    const dictionary_values = Object.values(dictionary)
    
    for (var j = 0; j < dictionary_keys.length ; j++){
        var item = dictionary_keys[j]

        var element = dictionary_values[j]['name']
        data = await as_requestJson(`/data/${item}?when=real_time&nocache=${(new Date()).getTime()}`)
        var single_object = data[0]

        if (typeof single_object === "undefined"){
          if(typeof value0 === "undefined") {
            value0 = 'N/A' }
          if(typeof value1 === "undefined") {
            value1 = 'N/A' }
          if(typeof value2 === "undefined") {
            value2 = 'N/A' }
          if(typeof value3 === "undefined") {
            value3 = 'N/A' }
          if(typeof value4 === "undefined") {
            value4 = 'N/A' }
          if(typeof value5 === "undefined") {
            value5 = 'N/A' }
        }
        else{            
            
            
            if(typeof single_object[dictionary_values[0]['name']] !== "undefined"){
                value0 = roundTo(single_object[dictionary_values[0]['name']], 2) } 
                else {
                    if(typeof value0 === "undefined") {
                  value0 = 'N/A' }
                }
            if(typeof single_object[dictionary_values[1]['name']] !== "undefined"){
              value1 = roundTo(single_object[dictionary_values[1]['name']], 2) } 
              else { 
                  if(typeof value1 === "undefined") {
                value1 = 'N/A' }
              }
            if(typeof single_object[dictionary_values[2]['name']] !== "undefined"){
                value2 = roundTo(single_object[dictionary_values[2]['name']], 2) } 
              else {
                  if(typeof value2 === "undefined") {
                value2 = 'N/A' }
                  }
            if(typeof single_object[dictionary_values[3]['name']] !== "undefined"){
                value3 = roundTo(single_object[dictionary_values[3]['name']], 2) } 
              else { 
                  if(typeof value3 === "undefined") {
                value3 = 'N/A' }
                  }
            if(typeof single_object[dictionary_values[4]['name']] !== "undefined"){
                value4 = roundTo(single_object[dictionary_values[4]['name']], 2) } 
                else {
                    if(typeof value4 === "undefined") {
                    value4 = 'N/A' }
                    }
            if(typeof single_object[dictionary_values[5]['name']] !== "undefined"){
                value5 = roundTo(single_object[dictionary_values[5]['name']], 2) } 
                else {
                    if(typeof value5 === "undefined") {
                    value5 = 'N/A' }
                    }
          }
        let html0 = '';
        html0 +=
        `<input id="${dictionary_keys[0]}" type="checkbox">`+
        `<label for="${dictionary_keys[0]}" >${dictionary_keys[0]} ${value0} ${dictionary_values[0]['unit']}</label>`
        
                $('#data0').html(html0)

        let html1 = '';
        html1 +=
        `<input id="${dictionary_keys[1]}" type="checkbox">`+
        `<label for="${dictionary_keys[1]}" >${dictionary_keys[1]} ${value1} ${dictionary_values[1]['unit']}</label>`
                $('#data1').html(html1)
        
        let html2 = '';
        html2 +=
        `<input id="${dictionary_keys[2]}" type="checkbox">`+
        `<label for="${dictionary_keys[2]}" >${dictionary_keys[2]} ${value2} ${dictionary_values[2]['unit']}</label>`
                $('#data2').html(html2)

        let html3 = '';
        html3 +=
        `<input id="${dictionary_keys[3]}" type="checkbox">`+
        `<label for="${dictionary_keys[3]}" >${dictionary_keys[3]} ${value3} ${dictionary_values[3]['unit']}</label>`
                $('#data3').html(html3)

        let html4 = '';
        html4 +=
        `<input id="${dictionary_keys[4]}" type="checkbox">`+
        `<label for="${dictionary_keys[4]}" >${dictionary_keys[4]} ${value4} ${dictionary_values[4]['unit']}</label>`
                $('#data4').html(html4)
        
        let html5 = '';
        html5 +=
        `<input id="${dictionary_keys[5]}" type="checkbox">`+
        `<label for="${dictionary_keys[5]}" >${dictionary_keys[5]} ${value5} ${dictionary_values[5]['unit']}</label>`
                $('#data5').html(html5)
    }   
}
   

let mainRepeat = setInterval(() => { //repeatBlocker[0].checked && 
        catch_data();
        view_data();
}, 60000);




function multiplesOf(numList, num) {
    return numList.filter(function(n) { return n % num === 0; })
}
  

