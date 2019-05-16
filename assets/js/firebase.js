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

var playerList = [];
var leaderBoard = null;


async function loadLeaderBoard() {
    await getLeaderBoard();
}


function getLeaderBoard() {
    let dbRef = firebase.database().ref("users/");
    dbRef.on("value", function (snapshot) {
        leaderBoard = snapshot.val();
        this.sortLeaderBoard(leaderBoard);
        // this.add.text(0, 0, parseInt(leaderBoard[0]), { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });
    });
}

function sortLeaderBoard(leaderBoard) {
    playerList = [];
    for (name in leaderBoard) {
        playerList.push([name, leaderBoard[name]])
    }
    playerList.sort(function (key2, key1) {
        return key1[1] - key2[1];
    });
}
