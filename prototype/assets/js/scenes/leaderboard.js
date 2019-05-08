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

let playerList = [];

// this.loadLeaderBoard().then(function () {
//
// });

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('Leaderboard');
    }


    preload() {
        this.load.image('background', 'assets/img/study_area.png');
    }

    create() {
        this.leaderboardCreated = false;
        this.createBackground(this)
    }

    update() {
        console.log(playerList);
        if (this.leaderboardCreated === false) {
            this.add.text(window.innerWidth * 0.30, window.innerHeight * 0.05, "Leaderboard", {
                fontFamily: 'Arial',
                fontSize: 64,
                color: 'black'
            });
            if (playerList.length > 0) {
                console.log("update");
                let y = 150;
                for (let i = 0; i < playerList.length; i++) {
                    y += 100;
                    this.add.text(window.innerWidth * 0.20, y, playerList[i][0], {
                        fontFamily: 'Arial',
                        fontSize: 64,
                        color: 'black'
                    });
                    this.add.text(window.innerWidth * 0.70, y, playerList[i][1], {
                        fontFamily: 'Arial',
                        fontSize: 64,
                        color: 'black'
                    });
                }
                this.leaderboardCreated = true;
            }
        }
    }


// function writeLeaderBoard(name, score) {
//     let dbRef = firebase.database().ref("users/");
//     dbRef.update({
//         [name]: score
//     })
// }

    async loadLeaderBoard() {
        await this.getLeaderBoard();
    }



    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }

    sortLeaderBoard(leaderBoard) {
        for (name in leaderBoard) {
            playerList.push([name, leaderBoard[name]])
        }
        playerList.sort(function (key2, key1) {
            return key1[1] - key2[1];
        });
    }

    getLeaderBoard() {
        let dbRef = firebase.database().ref("users/");
        dbRef.on("value", function (snapshot) {
            let leaderBoard = snapshot.val();
            this.sortLeaderBoard(leaderBoard);
            // this.add.text(0, 0, parseInt(leaderBoard[0]), { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });
        })
    }



}

