var tableupdater
function startTable(){
    console.log("Table started")
    fillTable();
    update_table();

}

function update_table() {
  tableupdater = setInterval(fillTable, 3000);
}

function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return JSON.parse(xmlhttp.responseText)
}
else {
  // TODO Throw exception
  return null;
}
}

function roundTo(value, places){
    var power = Math.pow(10, places);
    return Math.round(value * power) / power;
}

function getFields(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}
var value0, value1, value2, value3, value4, value5
async function fillTable(){
    var dictionary = loadTextFileAjaxSync("/dictionary")
    var dictionary_keys = Object.keys(dictionary)
    var dictionary_values = Object.values(dictionary)
    
    for (var j = 0; j < dictionary_keys.length ; j++){
        var item = dictionary_keys[j]
        var element = dictionary_values[j]["name"]
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
            
            
            if(typeof single_object[dictionary_values[0]["name"]] !== "undefined"){
                value0 = roundTo(single_object[dictionary_values[0]["name"]], 2) } 
                else {
                    if(typeof value0 === "undefined") {
                  value0 = 'N/A' }
                }
            if(typeof single_object[dictionary_values[1]["name"]] !== "undefined"){
              value1 = roundTo(single_object[dictionary_values[1]["name"]], 2) } 
              else { 
                  if(typeof value1 === "undefined") {
                value1 = 'N/A' }
              }
            if(typeof single_object[dictionary_values[2]["name"]] !== "undefined"){
                value2 = roundTo(single_object[dictionary_values[2]["name"]], 2) } 
              else {
                  if(typeof value2 === "undefined") {
                value2 = 'N/A' }
                  }
            if(typeof single_object[dictionary_values[3]["name"]] !== "undefined"){
                value3 = roundTo(single_object[dictionary_values[3]["name"]], 2) } 
              else { 
                  if(typeof value3 === "undefined") {
                value3 = 'N/A' }
                  }
            if(typeof single_object[dictionary_values[4]["name"]] !== "undefined"){
                value4 = roundTo(single_object[dictionary_values[4]["name"]], 2) } 
                else {
                    if(typeof value4 === "undefined") {
                    value4 = 'N/A' }
                    }
            if(typeof single_object[dictionary_values[5]["name"]] !== "undefined"){
                value5 = roundTo(single_object[dictionary_values[5]["name"]], 2) } 
                else {
                    if(typeof value5 === "undefined") {
                    value5 = 'N/A' }
                    }
          }
        let html = '';
        html +=
        '<tr>'+
            '<td class="label">' + dictionary_keys[0] + ' </td>'+
            '<td class="data">'+ value0 + ' ' + dictionary_values[0]["unit"] + ' </td>'+
            '<td class="label">' + dictionary_keys[1] + ' </td>'+
            '<td class="data">'+ value1 + ' ' + dictionary_values[1]["unit"] + ' </td>'+
          '</tr>'+
          '<tr>'+
          '<td class="label">' + dictionary_keys[2] + ' </td>'+
          '<td class="data">'+ value2 + ' ' + dictionary_values[2]["unit"] + ' </td>'+
          '<td class="label">' + dictionary_keys[3] + ' </td>'+
          '<td class="data">'+ value3 + ' ' + dictionary_values[3]["unit"] + ' </td>'+
          '</tr>'+
          '<tr>'+
          '<td class="label">' + dictionary_keys[4] + ' </td>'+
          '<td class="data">'+ value4 + ' ' + dictionary_values[4]["unit"] + ' </td>'+
          '<td class="label">' + dictionary_keys[5] + ' </td>'+
          '<td class="data">'+ value5 + ' ' + dictionary_values[5]["unit"] + ' </td>'+
          '</tr>'
                $('#current_widget').html(html)
        
    }   
}

startTable()