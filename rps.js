  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDjmy6CFM42wvS9d_gnuwKDRQ0lgKK7m0o",
    authDomain: "rps-assignment-project.firebaseapp.com",
    databaseURL: "https://rps-assignment-project.firebaseio.com",
    projectId: "rps-assignment-project",
    storageBucket: "",
    messagingSenderId: "419929729787",
    appId: "1:419929729787:web:b52fca84c0b9dcde"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database.
var database = firebase.database();
var dcFlag = database.ref("/dcflag");
var connectionsRef = database.ref("/connections");
var gameState;
// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
var chat = database.ref("/chat");
var game = database.ref("/game");
var player1 = database.ref("/game/player1");
var player2 = database.ref("/game/player2");
var localPlayer = null;
var choice;
var numberW = 0;
var numberL = 0;
var playerNum = 0;

var connections;
// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    connections = con;
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});


database.ref('game').on('value', function(snapshot){
    gameState = snapshot;
    console.log('step 11111');
    if (!snapshot.child('player1').exists() || !snapshot.child('player2').exists()) {
        console.log('step 11112222');
        if (localPlayer === null){
            $("#gameJoiner").attr("disabled", false).text("Join Game");
        }
    }
    else if (snapshot.child('player1').exists() && snapshot.child('player2').exists() && localPlayer === null) {
        $("#gameJoiner").attr("disabled", true).text('Sorry, the game is full right now!');
    }
    
    if (snapshot.child('player1').val().selection !== 0 && snapshot.child('player2').val().selection !== 0) {
        console.log('player 1 and 2 have made a choice');
        var choice1 = snapshot.child('player1').val().selection;
        var choice2 = snapshot.child('player2').val().selection;
        drawChoices(choice1, choice2);
        evaluateRound(snapshot.child('player1').val().selection, snapshot.child('player2').val().selection);
    } 
    setTimeout(function() {scoreWriter()}, 2500);
});


drawChoices = (choice1, choice2) => {
    if (choice1 === 'paper'){
        $("#p1Img").attr("src", "paper.jpg");
    } else if (choice1 === 'scissors') {
        $("#p1Img").attr("src", "scissors.jpg");
    } else if (choice1 === "rock") {
        $("#p1Img").attr("src", "therock.png");
    } else if (choice1 === "lizard") {
        console.log('it is lizard time');
        $("#p1Img").attr("src", "lizard.jpg");
    } else if (choice1 === "spock") {
        $("#p1Img").attr("src", "spock.jpg");
    }

    if (choice2 === 'paper'){
        $("#p2Img").attr("src", "paper.jpg")
    } else if (choice2 === 'scissors') {
        $("#p2Img").attr("src", "scissors.jpg");
    } else if (choice2 === "rock") {
        $("#p2Img").attr("src", "therock.png");
    } else if (choice2 === "lizard") {
        $("#p2Img").attr("src", "lizard.jpg");
    } else if (choice2 === "spock") {
        $("#p2Img").attr("src", "spock.jpg");
    }

};


dcFlag.on('value', function(){
    console.log('wowowoowoo');
    scoreWriter();
});

evaluateRound = (p1, p2) => {
    if (p1 === p2) {
        console.log('it is a tie');
        $("#theWinner").text("This round is a tie!");
    }
    if (p1 === 'rock' && p2 === 'scissors' || p1 === 'rock' && p2 === 'lizard' || p1 === 'paper' && p2 === 'rock' || p1 === 'paper' && p2 === 'spock' || p1 === 'scissors' && p2 === 'paper' || p1 === 'scissors' && p2 === 'lizard' || p1 === 'lizard' && p2 === 'paper' || p1 === 'lizard' && p2 === 'spock' || p1 === 'spock' && p2 === 'scissors' || p1 === 'spock' && p2 === 'rock') {
        //p1 wins here
        numberW = gameState.child('player1').val().wins;
        numberW++;
        // $("#p1Wins").text(numberW);
        player1.update({
            wins: numberW,
            selection: 0
        });
        numberL = gameState.child('player2').val().losses;
        numberL++;
        // $("#p2Losses").text(numberL);
        player2.update({
            losses: numberL,
            selection: 0
        });
        $("#theWinner").text("Player 1");
    } else if (p2 === 'rock' && p1 === 'scissors' || p2 === 'rock' && p1 === 'lizard' || p2 === 'paper' && p1 === 'rock' || p2 === 'paper' && p1 === 'spock' || p2 === 'scissors' && p1 === 'paper' || p2 === 'scissors' && p1 === 'lizard' || p2 === 'lizard' && p1 === 'paper' || p2 === 'lizard' && p1 === 'spock' || p2 === 'spock' && p1 === 'scissors' || p2 === 'spock' && p1 === 'rock') {
        //p1 losses here
        numberW = gameState.child('player2').val().wins;
        numberW++;
        // $("#p2Wins").text(numberW);
        player2.update({
            wins: numberW,
            selection: 0
        });
        numberL = gameState.child('player1').val().losses;
        numberL++;
        // $("#p1Losses").text(numberL);
        player1.update({
            losses: numberL,
            selection: 0
        });
        $("#theWinner").text("Player 2");
    }
    
    // scoreWriter();
 };

function scoreWriter(){
    if (gameState.child('player1').exists() && gameState.child('player2').exists()){
    $("#p1Wins").text(gameState.child('player1').val().wins);
    $("#p1Losses").text(gameState.child('player1').val().losses);
    $("#p2Wins").text(gameState.child('player2').val().wins);
    $("#p2Losses").text(gameState.child('player2').val().losses);
    console.log("$$$$$");
}
    if (!gameState.child('player1').exists()){
    $("#p1Wins").text('0');
    $("#p1Losses").text('0');
    console.log("#########");
}
    if (!gameState.child('player2').exists()){
    $("#p2Wins").text('0');
    $("#p2Losses").text('0');
    console.log("@@@@@@@@@@");
}
setTimeout(function(){
    $("#p1Img").attr("src", "...");
    $("#p2Img").attr("src", "...");
    $(".playerChoice").attr("disabled", false);
    }, 3000);
}



$("#gameJoiner").on("click", function(){
    if (!gameState.child('player1').exists()){
        createPlayer(player1, 'Player 1');
        $("#gameJoiner").attr("disabled", true).text('You Are In The Game!');
        playerNum = 1;
    }
    else if (!gameState.child('player2').exists()){
        createPlayer(player2, 'Player 2');
        $("#gameJoiner").attr("disabled", true).text('You Are In The Game!');
        playerNum = 2;
    }
});

createPlayer = (player, name) => {
    player.set({
      name: name,
      wins: 0,
      losses: 0,
      selection: 0
    });
    localPlayer = player;
    if (localPlayer !== null) {
      $(".playerSelector").attr("disabled", true);
      $(".playerChoice").attr('disabled', false);
    }
    localPlayer.onDisconnect().remove();
  };

$(document).on("click", ".playerChoice", function(){
    choice = $(this).attr("data");
    console.log(choice);
    $(".playerChoice").attr("disabled", true);
    localPlayer.update({
        selection: choice
    });
    // localPlayer.once('value').then(function(snapshot) {
    //     var answer = snapshot.val().name;
    //     console.log(answer);
    //     if (answer === 'Player 1'){
    //         $("#p1Img").attr("src", "https://cbsnews2.cbsistatic.com/hub/i/r/2015/02/27/c0c0913b-6699-4bf4-bf4e-c317cbba6736/resize/620x465/4830b6b688cd4d32bfffafa40265472f/leonard-nimoy-star-trek-tv-13.jpg");
    //     } else if (answer === 'Player 2'){
    //         $("#p2Img").attr("src", "https://cbsnews2.cbsistatic.com/hub/i/r/2015/02/27/c0c0913b-6699-4bf4-bf4e-c317cbba6736/resize/620x465/4830b6b688cd4d32bfffafa40265472f/leonard-nimoy-star-trek-tv-13.jpg");
    //     }
    // });
});


$("#chatBar").keypress(function (e) {
    
    if (e.which == 13) {
        console.log('chat time');
        var message= $("#chatBar").val();
        chat.update({
            message: "Player " + playerNum + ": " + message
        });
        $("#chatBar").val('');
      return false;    //<---- Add this line
    }
  });


chat.on("value", function(snapshot){
  var newMessage = $("<p></p>").text(snapshot.val().message);
  newMessage.append("<br>");
  $("#chatArea").append(newMessage);
});