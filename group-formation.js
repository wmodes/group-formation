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
var partData = [];
var groupSize = {
    "ideal" : 4,
    "min" : 3,
    "max" : 5
}
var weights = {
    "sched" : 5,
    "topic" : 3,
    "div" : 2,
    "size: 5
}

// collection variables
var locationDataList = [];
var placesDataObj = {};
var detailDataList = [];
var howManyReviews = 1;
var reviewWords = 25;

// DOM fields
domEl = {
    "partDataId" : "#participant-data",
    "groupIdealId" : "input#input-group-ideal",
    "groupMinId" : "input#input-group-min",
    "groupMaxId" : "input#input-group-max",
    "weightSchedId" : "input#weight-sched-max",
    "weightTopicId" : "input#weight-topic-max",
    "weightDivId" : "input#weight-div-max",
    "notification" : "#notification",
    "outputFormId" : ".outputform #output-field"
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

// map constants
// arbitrary coordinates (geographic center of contiguous us)
defaultLat = 39.828593;
defaultLng = -98.579469;
defaultRad = 2500; // or 2.5km
var placesAPI = {};

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
    $(domEl["outputFormId"]).append(headerLine+"\n");  
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
    $(domEl["outputFormId"]).append(recordLine+"\n");
    $(domEl["outputFormId"]).height( $(domEl["outputFormId"])[0].scrollHeight );
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
// input functions
//

// get inputs from fields (upon submit)
function getInputs() {
    partData = $(domEl["partDataId"]).val().split('\n');
    groupSize["ideal"] = parseInt($(domEl["groupIdealId"]).val());
    groupSize["min"] = parseInt($(domEl["groupMinId"]).val());
    groupSize["max"] = parseInt($(domEl["groupMaxId"]).val());
    weights["sched"] = parseInt($(domEl["weightSchedId"]).val());
    weights["topic"] = parseInt($(domEl["weightTopicId"]).val());
    weights["div"] = parseInt($(domEl["weightDivId"]).val());
}

// store inputs in local storage
function storeInputs() {
    localStorage.setItem("partData", JSON.stringify(partData));
    localStorage.setItem("groupSize", JSON.stringify(groupSize));
    localStorage.setItem("weights", JSON.stringify(weights));
}

// upon load, get locally stored values
$( document ).ready(function() {
    if (localStorage.getItem("partData") !== null) {
        $(domEl["partDataId"]).removeClass("placeholder");
        $(domEl["partDataId"]).html(JSON.parse(localStorage.getItem("partData")).join('\n'));
        $(domEl["groupIdealId"]).html(JSON.parse(localStorage.getItem("groupIdeal")));
        $(domEl["groupMinId"]).html(JSON.parse(localStorage.getItem("groupMin")));
        $(domEl["groupMaxId"]).html(JSON.parse(localStorage.getItem("groupMax")));
        $(domEl["weightSchedId"]).html(JSON.parse(localStorage.getItem("weightSched")));
        $(domEl["weightTopicId"]).html(JSON.parse(localStorage.getItem("weightTopic")));
        $(domEl["weightDivId"]).html(JSON.parse(localStorage.getItem("weightDiv")));
    }
    else {
        //TODO: Deal with placeholder text
	$(domEl["partDataId"]).html(participantPlaceholder);
	//TODO: create event that removes placeholder and removes placeholder class
	//  when focus is on textarea
    }
    $(domEl["partDataId"]).focusout(function(){
        if ($(domEl["partDataId"]).val() == '' &&
	   (typeof partData === 'undefined' || partData == '')) {
	    $(domEl["partDataId"]).val(participantPlaceholder);
	    $(domEl["partDataId"]).addClass("placeholder");
	}
    });
    $(domEl["partDataId"]).focus(function(){
	if ($(domEl["partDataId"]).hasClass("placeholder") &&
	    (typeof partData === 'undefined' || partData == '')) {
	    $(domEl["partDataId"]).val("");
	}
	$(domEl["partDataId"]).removeClass("placeholder");
    });
});

//
// Main Bidness
//

function submit() {
    // clear globals
    error_flag = false;
    partData = [];
    fieldList = [];
    locationDataList = [];
    placesDataObj = {};
    detailDataList = [];
    $(domEl["notification"]).html("");
    $(domEl["outputFormId"]).html("");
    var dfrd = $.Deferred();
    getInputs();
    storeInputs();
    outputHeader();
}

