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
    error = $("#error");

    submit.click(function (event) {
        event.preventDefault();

        //Grabs the input variables values
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTime = $("#firstTime").val().trim();
        var frequency = $("#frequency").val().trim();

        if (name === "" || destination === "" || firstTime === "" || frequency === "") {
            error.show();
        }
        else {
            error.hide();

            //Resets the values
            $("#name").val("");
            $("#destination").val("");
            $("#firstTime").val("");
            $("#frequency").val("");

            //Adds the inputs to Firebase
            database.ref().push({
                name: name,
                destination: destination,
                firstTime: firstTime,
                frequency: frequency
            });
        }
    });

    //Pulls info from Firebase.
    database.ref().on("child_added", function (snapshot) {

        var newRow = $("<tr class='pFont black'>");
        var shipName = $("<td>").text(snapshot.val().name);
        var shipDest = $("<td>").text(snapshot.val().destination);
        var shipFreq = $("<td>").text("Every " + (snapshot.val().frequency) + " Minutes");

        var frequency = parseInt(snapshot.val().frequency);
        var firstTime = parseInt(snapshot.val().firstTime);
        var currentTime = moment();

        var minutesAway = currentTime.diff(moment.unix(firstTime), "minutes");
        minutesAway = minutesAway % frequency;
        minutesAway = frequency - minutesAway;
        nextArrival = currentTime.add(minutesAway, "m").format("h:mm A");
        var nextTime = $("<td>").text(nextArrival);
        var minsAway = $("<td>").text((minutesAway) + " Minutes Away");

        newRow.append(shipName);
        newRow.append(shipDest);
        newRow.append(shipFreq);
        newRow.append(nextTime);
        newRow.append(minsAway);
        table.append(newRow);

    });

});
