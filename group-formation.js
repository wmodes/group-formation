// Author: Wes Modes
// Date: 13 Jan 2018
// Title: River Places Tools
// Description: This tool uses Google Places to take a list of cities and a 
//  list of keywords and return a list of related places in those cities.


APIKEY = "AIzaSyCBh9fv_G5BRRIZm0b3pUd-i7IgU4QGRg4";
APIURL = "https://maps.googleapis.com/maps/api/place";

// object in which to store all the ids returned and their priorities
var idObj = {};

// input variables
var dataStrings = [];
var groupSize = {
    "ideal" : 4,
    "min" : 3,
    "max" : 5
}
var weights = {
    "sched" : 5,
    "topic" : 3,
    "div" : 2,
    "size" : 5
}

// collection variables
var header1 = [];
var header2 = [];
var dataStrings = [];
var dataArray = [];
var partData = [];
var partList = [];
var valueList = [];

fieldTypes = ['S', 'T', 'D'];

// var locationDataList = [];
// var placesDataObj = {};
// var detailDataList = [];
// var howManyReviews = 1;
// var reviewWords = 25;

// reference

// DOM fields
domEl = {
    "part-data" : "#participant-data",
    "group-ideal" : "input#group-ideal",
    "group-min" : "input#group-min",
    "group-max" : "input#group-max",
    "weight-sched" : "input#weight-sched",
    "weight-topic" : "input#weight-topic",
    "weight-div" : "input#weight-div",
    "weight-size" : "input#weight-size",
    "submit" : "#submit",
    "notification" : "#notification",
    "outputForm" : ".outputform #output-field"
}

// Placeholders
participantPlaceholder = 
`Name\tMon\tTue\tWed\tTopic1\tTopic2\tTopic3\tH/W\tS/W\tLeadership
\tS\tS\tS\tT\tT\tT\tD\tD\tD
Name1\t1\t0\t0\t1\t2\t3\t5\t2\t4
Name2\t1\t0\t1\t2\t1\t3\t2\t2\t2
Name3\t0\t1\t1\t3\t2\t1\t5\t5\t3
Name4\t1\t0\t0\t1\t2\t3\t5\t2\t4
Name5\t1\t0\t1\t2\t1\t3\t2\t2\t2
Name6\t0\t1\t1\t3\t2\t1\t5\t5\t3
`;

// global flags
var error_flag = false;

function cleanString(str) {
    // remove punctuation
    str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    // covert to utf string
    str = unescape(encodeURIComponent(str));
    // remove extra spaces
    str = str.replace(/\s+/g, ' ');
    // cast to lower case
    str = str.toLowerCase();
    // remove dupe words
    str = str.split(' ').filter(function(item,i,allItems){
        return i==allItems.indexOf(item);
    }).join(' ');
    return str;
}

//
// Output Results
//

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function toCSV(cell) {
    if (String(cell).replace(/ /g, '').match(/[\s,"]/)) {
        return '"' + cell.replace(/"/g, '""') + '"';
    }
    return cell;
}

// output header
function outputHeader() {
    // create header row
    var headerLine = "";
        for (i=0; i < fieldList.length; i++) {
            if (i == 0) {
                headerLine = toTitleCase(fieldList[i]);
            } else {
                headerLine = headerLine + '\t' + toTitleCase(fieldList[i]);
        }
    }
    $(domEl["outputForm"]).append(headerLine+"\n");  
}

// output one result
function outputOneResult(detailObj) {
    var recordLine = "";
    for (i=0; i < fieldList.length; i++) {
        value = toCSV(detailObj[fieldList[i]]);
        if (i == 0) {
            recordLine = value;
        } else {
            recordLine = recordLine + '\t' + value;
        }
    }
    // push record line to display list
    $(domEl["outputForm"]).append(recordLine+"\n");
    $(domEl["outputForm"]).height( $(domEl["outputForm"])[0].scrollHeight );
}

// output results to webpage
function outputresults() {
    outputheader();
    // iterate through detail records
    for (j=0; j < detaildatalist.length; j++) {
        outputoneresult(detaildatalist[j]);
    }
}

//
// statistical functions
//

// calculate mean, min, 

//
// parse data
//

function createDataArray(dataStrings) {
	var dataArray = [];
	for (var i = 0; i < dataStrings.length; i++) {
		dataArray[i] = dataStrings[i].split('\t');
	}
	return dataArray;
}

// parse raw participant strings (rows)
function createPartObjs(partArray) {
	var partList = [];
	for (var i = 0; i < partArray.length; i++) {
	    var thisPart = partArray[i];
	    newPartObj = {
	    	'name' : thisPart[0],
	    	'num' : i,
	    	'data' : thisPart.slice(1)
	    }
	    partList.push(newPartObj);
	}
	return partList;
}

// parse raw values data (columns)
function createValueObjs(dataArray) {
	var valueList = [];
	// we iterate by column (using length of column 1 minus name column)
	for (var col = 1; col < dataArray[1].length; col++) {
		// we only process the column if it is marked with a fieldtype
		if (fieldTypes.includes(dataArray[1][col].toUpperCase())) {
			var rawdata = [];
			for (var row = 2; row < dataArray.length; row++) {
				rawdata.push(dataArray[row][col]);
			}
			var newValueObj = {
				'fieldType' : dataArray[1][col],
				'fieldLabel' : dataArray[0][col],
				'rawdata' : rawdata
			}
			valueList.push(newValueObj);
		}

	}
	return valueList;
}

function analyzeValues(valueList) {
	// we iterate by column (using length of column 1 minus )
	for (var col = 0; col < valueList.length; col++) {
		var min = null, max = null, total = 0.0;
		for (row = 0; row < valueList[col].rawdata.length; row++) {
			thisVal = parseFloat(valueList[col].rawdata[row]);
			if (isNaN(thisVal)) {
				thisVal = 0;	
			}
			// calculate total for mean
			total = total + thisVal;
			// calc min
			if (min === null ||
				thisVal < min) {
				min = thisVal;
			}
			// calc max
			if (max === null ||
				thisVal > max) {
				max = thisVal;
			}
		}
		valueList[col].min = min;
		valueList[col].max = max;
		valueList[col].total = total;
		valueList[col].mean = total / valueList[col].rawdata.length;
    }
	return valueList;
}

function normalizeValues(valueList) {
	// we iterate by column (using length of column 1 minus )
	for (var col = 0; col < valueList.length; col++) {
		var min = valueList[col].min;
		var max = valueList[col].max;
		var normList = [];
		for (row = 0; row < valueList[col].rawdata.length; row++) {
			thisVal = parseFloat(valueList[col].rawdata[row]);
			if (isNaN(thisVal)) {
				thisVal = 0;	
			}
			// calculate normalized value
			normalized = (thisVal - min) / (max - min)
			if (isNaN(normalized)) {
				normalized = 0;
			}
			normList.push(normalized);
		}
		valueList[col].normList = normList;
    }
	return valueList;
}

function parseRawData () {
	dataArray = createDataArray(dataStrings);
	partList = createPartObjs(dataArray.slice(2));
	valueList = createValueObjs(dataArray);
	valueList = analyzeValues(valueList);
	valueList = normalizeValues(valueList);
}

//
// input functions
//

// get inputs from fields (upon submit)
function getInputs() {
    dataStrings = $(domEl["part-data"]).val().split('\n');
    groupSize["ideal"] = parseInt($(domEl["group-ideal"]).val());
    groupSize["min"] = parseInt($(domEl["group-min"]).val());
    groupSize["max"] = parseInt($(domEl["group-max"]).val());
    weights["sched"] = parseInt($(domEl["weight-sched"]).val());
    weights["topic"] = parseInt($(domEl["weight-topic"]).val());
    weights["div"] = parseInt($(domEl["weight-div"]).val());
    weights["size"] = parseInt($(domEl["weight-size"]).val());
}

// store inputs in local storage
function storeInputs() {
    localStorage.setItem("dataStrings", JSON.stringify(dataStrings));
    localStorage.setItem("groupSize", JSON.stringify(groupSize));
    localStorage.setItem("weights", JSON.stringify(weights));
}

//
// main bidness
//

// upon load
$( document ).ready(function() {
    // if local storage
    if (localStorage.getItem("dataStrings") !== null) {
        // get locally stored values
        var mydataStrings = JSON.parse(localStorage.getItem("dataStrings")).join('\n');
        if (mydataStrings) {
	        // pre-load form with stored values
	        $(domEl["part-data"]).html(mydataStrings);
	        $(domEl["part-data"]).removeClass("placeholder");
	    } else {
	        // load placeholder text
			$(domEl["part-data"]).html(participantPlaceholder);
		    $(domEl["part-data"]).addClass("placeholder");
	    }
    } else {
        // load placeholder text
		$(domEl["part-data"]).html(participantPlaceholder);
	    $(domEl["part-data"]).addClass("placeholder");
    }
    // if local storage
    if (localStorage.getItem("groupSize") !== null) {
        // get locally stored values
        var myGroupSize = JSON.parse(localStorage.getItem("groupSize"));
        // pre-load form with stored values
        for (var key in groupSize) {
        	if (! myGroupSize[key]) {
        		value = groupSize[key];
        	} else {
        		value = myGroupSize[key];
        	}
	        $(domEl["group-" + key]).val(value);
	    }
    }
    // if local storage
    if (localStorage.getItem("weights") !== null) {
        // get locally stored values
        var myWeights = JSON.parse(localStorage.getItem("weights"));
        // pre-load form with stored values
        for (var key in weights) {
        	if (! myWeights[key]) {
        		value = weights[key];
        	} else {
        		value = myWeights[key];
        	}
	        $(domEl["weight-" + key]).val(value);
	    }
    }
	// create event that removes placeholder and removes placeholder class
	// 		when focus is on textarea
    // set event handlers to simulate placeholder text
    $(domEl["part-data"]).focusout(function(){
        if ($(domEl["part-data"]).val() == '' &&
	  		(typeof dataStrings === 'undefined' || dataStrings.length == 0)) {
		    $(domEl["part-data"]).val(participantPlaceholder);
		    $(domEl["part-data"]).addClass("placeholder");
		}
    }); /* focusout */
    $(domEl["part-data"]).focus(function(){
		if ($(domEl["part-data"]).hasClass("placeholder") &&
		    (typeof dataStrings === 'undefined' || dataStrings.length == 0)) {
			    $(domEl["part-data"]).val("");
		}
		$(domEl["part-data"]).removeClass("placeholder");
    }); /* focus */
    $(domEl["submit"]).click(function(){
    	submit();
    }); /* click */
}); /* onload */

//
// Main Bidness
//

function submit() {
    // clear globals
    error_flag = false;
    dataStrings = [];
    fieldList = [];
    locationDataList = [];
    placesDataObj = {};
    detailDataList = [];
    $(domEl["notification"]).html("");
    $(domEl["outputForm"]).html("");
    var dfrd = $.Deferred();
    getInputs();
    storeInputs();
    parseRawData();
    // outputHeader();
}

