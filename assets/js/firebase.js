// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyBWU6qsDCjOOWDY7HGoXOwGHjK8H2IYHLI",
    authDomain: "tosser-ad3f6.firebaseapp.com",
    databaseURL: "https://tosser-ad3f6.firebaseio.com",
    projectId: "tosser-ad3f6",
    storageBucket: "tosser-ad3f6.appspot.com",
    messagingSenderId: "953012428752",
    appId: "1:953012428752:web:ca1b4f7003d40181"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// sorted players normal mode
var playerList = [];
// sorted players challenge mode
var challengePlayerList = [];
// contains normal mode player objects
var leaderBoard = null;
// contains challenge mode player objects
var challengeLeaderBoard = null;

/**
 * Waits for leaderboard to be populated before loading leaderboard scene
 * @returns populated leaderboards
 */
async function loadLeaderBoard() {
    await getLeaderBoard();
    await getChallengeLeaderBoard();
}

/**
 * Access firebase to obtain a sorted list of player scores for normal mode
 */
function getLeaderBoard() {
    let dbRef = firebase.database().ref("users/");
    dbRef.on("value", function (snapshot) {
        leaderBoard = snapshot.val();
        this.sortLeaderBoard(leaderBoard);
    });
}

/**
 * Access firebase to obtain a sorted list of player scores for challenge mode
 */
function getChallengeLeaderBoard() {
    let dbRef = firebase.database().ref("challengeUsers/");
    dbRef.on("value", function (snapshot) {
        challengeLeaderBoard = snapshot.val();
        this.sortChallengeLeaderBoard(challengeLeaderBoard);
    });
}

/**
 * Sorts the normal mode leaderboard by score
 * @param leaderBoard
 */
function sortLeaderBoard(leaderBoard) {
    playerList = [];
    for (name in leaderBoard) {
        playerList.push([name, leaderBoard[name]])
    }
    playerList.sort(function (key2, key1) {
        return key1[1] - key2[1];
    });
}

/**
 * Sorts the challenge mode leaderboard by score
 * @param leaderBoard
 */
function sortChallengeLeaderBoard(challengeLeaderBoard) {
    challengePlayerList = [];
    for (name in challengeLeaderBoard) {
        challengePlayerList.push([name, challengeLeaderBoard[name]])
    }
    challengePlayerList.sort(function (key2, key1) {
        return key1[1] - key2[1];
    });
}