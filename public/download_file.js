
function download_json(){
    var dictionary_keys = Object.keys(dictionary)
    var sensor
    let url_down = []
    var day1 = document.getElementById("day1").value
    var day2 = document.getElementById("day2").value
    var month1 = document.getElementById("month1").value
    var month2 = document.getElementById("month2").value
    var year1 = document.getElementById("year1").value
    var year2 = document.getElementById("year2").value
    var format = document.getElementById("format").value
    var preset = document.getElementById("pre_set").value
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear().toString();
    var hour = date.getHours()

        if(month.toString().length < 2){
            month= "0"+month;
        }

        if(day.toString().length < 2){
            day= "0"+day;
        }

        if(hour.toString().length < 2){
            hour= "0"+hour;
        }

   data_now = year + "-" + month + "-" + day

    first = "T" + hour + ":00:01&end="
    second = "T" + hour + ":59:59&format="

    for (var j = 0; j < dictionary_keys.length ; j++){
        sensor = dictionary_keys[j]
        url_down = []
        if($(`#${sensor}`).is(':checked')){

            if(preset){
    
                switch (preset) {
                    case 'now':
                        url_down.push("download/" + sensor + "?start="+ year + "-" + month + "-" + day + first + year + "-" + month + "-" + day + second + format)
                        break;
                    case 'today':
                        url_down.push("download/" + sensor + "?start="+ year + "-" + month + "-" + day + "T00:00:01&end=" + year + "-" + month + "-" + day + "T23:59:59&format=" + format)
                        break;
                    case 'this_month':
                        url_down.push("download/" + sensor + "?start="+ year + "-" + month + "-" + "01" + "T00:00:01&end=" + year + "-" + month + "-" + day + "T23:59:59&format=" + format)
                        break;
                    case 'this_year':
                    url_down.push("download/" + sensor + "?start="+ year + "-" + "01" + "-" + "01" + "T00:00:01&end=" + year + "-" + "12" + "-" + "31" + "T23:59:59&format=" + format)
                        break;
                }

            }
            else{
                console.log(sensor)
                url_down.push("download/" + sensor + "?start="+ year1 + "-" + month1 + "-" + day1 + "T00:00:01&end=" + year2 + "-" + month2 + "-" + day2 + "T23:59:59&format=" + format)
                    
            }
            console.log(url_down)
            document.getElementById("download_file").setAttribute('href', url_down[0])

                if(format === "txt"){
                    document.getElementById("download_file").setAttribute('download', "file.txt")
                }
                else if(format === "json"){
                    document.getElementById("download_file").setAttribute('download', "file.json")
                }
            document.getElementById('download_file').click()
        }
        
    }

}
