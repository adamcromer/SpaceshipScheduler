//n.toLocaleString()
$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDwYjQG2MkZ_sQVxXc4rkhBbyDO8DXUZes",
        authDomain: "spaceshipscheduler.firebaseapp.com",
        databaseURL: "https://spaceshipscheduler.firebaseio.com",
        projectId: "spaceshipscheduler",
        storageBucket: "spaceshipscheduler.appspot.com",
        messagingSenderId: "750832104755"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    submit = $("#submit");
    table = $("#tableBody");


    submit.click(function (event) {
        event.preventDefault();

        //Grabs the input variables values
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        // var firstTime = moment($("#firstTime").val().trim(), "MM/DD/YYYY").format("X");
        var firstTime = $("#firstTime").val().trim();

        var frequency = $("#frequency").val().trim();

        //Resets the values
        $("#name").val("");
        $("#destination").val("");
        $("#firstTime").val("");
        $("#frequency").val("");

        console.log(name);
        console.log(destination);
        console.log(firstTime);
        console.log(frequency);


        database.ref().push({

            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        });
    });

    database.ref().on("child_added", function (snapshot) {
        // console.log(snapshot);

        var newRow = $("<tr class='pFont black'>");
        var shipName = $("<td>").text(snapshot.val().name);
        var shipDest = $("<td>").text(snapshot.val().destination);
        var shipFreq = $("<td>").text("Every " + (snapshot.val().frequency) + " Minutes");
        frequency = snapshot.val().frequency;

        var firstTime = snapshot.val().firstTime;


        var currentTime = moment();
        console.log(firstTime);
        console.log(currentTime);

        firstTime = moment(firstTime, "H:mm A");

        var nextTrain = moment.duration(currentTime.diff(firstTime));
        nextTrain = Math.round(nextTrain.asMinutes());
        nextTrain = frequency - (nextTrain % frequency);
        var nextArrival = moment(currentTime + nextTrain);
        // nextArrival = moment(nextArrival, "H:mm A").format();
        console.log(nextArrival);
        console.log(moment(nextArrival, "H:mm A"));

        if (currentTime < firstTime) {
            var nextTrain = moment.duration(firstTime.diff(currentTime));
            nextTrain = Math.round(nextTrain.asMinutes());
            nextTrain = frequency - (nextTrain % frequency);
            var nextTime = $("<td>").text(firstTime);
            var minsAway = $("<td>").text((nextTrain) + " Minutes Away");

        }
        else {
            var nextTime = $("<td>").text(nextArrival);
            var minsAway = $("<td>").text((nextTrain) + " Minutes Away");
        }
        // var minsAway = $("<td>").text(moment(nextTrain).calendar());
        newRow.append(shipName);
        newRow.append(shipDest);
        newRow.append(shipFreq);
        newRow.append(nextTime);
        newRow.append(minsAway);
        table.append(newRow);







    });







});



