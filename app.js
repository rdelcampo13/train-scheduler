$(document).ready( function (){

// Initialize Firebase
var config = {
	apiKey: "AIzaSyCdLrAYMFd0Awqr4p1OIJjh2wiZ94KjfVU",
	authDomain: "train-scheduler-9f2ed.firebaseapp.com",
	databaseURL: "https://train-scheduler-9f2ed.firebaseio.com",
	projectId: "train-scheduler-9f2ed",
	storageBucket: "train-scheduler-9f2ed.appspot.com",
	messagingSenderId: "769220847678"
};
firebase.initializeApp(config);

var database = firebase.database();

$('#submit').on("click", function(event){
		event.preventDefault();
		var name = $('#train-name').val().trim();
		var destination = $('#destination').val().trim();
		var startTime = $('#start').val().trim();
		var frequency = $('#frequency').val().trim();

	  database.ref().push({
	  	name,
	  	destination,
	  	startTime,
	  	frequency
     });
});


database.ref().on("child_added", function(snapshot) {

	var tableRow = $('<tr>');

	var nameData = $('<td>');
	var destinationData = $('<td>');
	var frequencyData = $('<td>');
	var arrivalData = $('<td>');
	var minutesData = $('<td>');

	// Assumptions
	var tFrequency = snapshot.val().frequency;

	// Time is 3:30 AM
	var firstTime = snapshot.val().startTime;

	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

	// Current Time
	var currentTime = moment();

	// Difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

	// Time apart (remainder)
	var tRemainder = diffTime % tFrequency;

	// Minute Until Train
	var tMinutesTillTrain = tFrequency - tRemainder;

	// Next Train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");

	nameData.text(snapshot.val().name);
	destinationData.text(snapshot.val().destination);
	frequencyData.text(snapshot.val().frequency);
	arrivalData.text(moment(nextTrain).format("hh:mm a"));
	minutesData.text(tMinutesTillTrain);


	tableRow.append(nameData);
	tableRow.append(destinationData);
	tableRow.append(frequencyData);
	tableRow.append(arrivalData);
	tableRow.append(minutesData);

	$("#trainList").append(tableRow);

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

});

