$(document).ready(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBrhj8n7I5Phw4P4fqwCLLYmUdXHN5JuX8",
    authDomain: "anytime-train.firebaseapp.com",
    databaseURL: "https://anytime-train.firebaseio.com",
    projectId: "anytime-train",
    storageBucket: "anytime-train.appspot.com",
    messagingSenderId: "815976822947"
  };
  firebase.initializeApp(config);

	// Diclearning a variable for the firebase data
	var trainData = firebase.database();

	// Button for adding Trains
	$("#addTrainBtn").on("click", function(event){
		event.preventDefault();

		// Grabs user input and assign to variables
		var trainName = $("#trainNameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequencyInput").val().trim();


		// Creates local "temporary" object for holding train data
		// Will push this to firebase
		var newTrain = {
			name:  trainName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		}

		// pushing trainInfo to Firebase
		trainData.ref().push(newTrain);

		// clear text-boxes
		$("#trainNameInput").val("");
		$("#destinationInput").val("");
		$("#trainInput").val("");
		$("#frequencyInput").val("");

		// Prevents page from refreshing
		return false;
	});

	trainData.ref().on("child_added", function(childSnapshot, prevChildKey){

		// assign firebase variables to snapshots.
		var firebaseName = childSnapshot.val().name;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;
		
		// calculating minutes away
		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
		

		// Append train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
});