import GameScene from './game.js'

export default class SubclassTest extends GameScene {
    constructor() {
        super("Subclass");
    }

    create() {
        super.create();

        // Create timer
        this.t = 3;
        this.timeText = this.add.text(400, 200, null, {
            fontFamily: 'Kalam',
            fontSize: 70,
            color: '#000000',
        });

        this.updateTimer(this);
    }

    updateTimer() {
        console.log(this);
        this.timeText.setText('Timer: ' + this.t);
        this.t--;
        let thisScene = this;
        let x = setInterval(function () {
            thisScene.timeText.setText('Timer: ' + thisScene.t);

            thisScene.t--;
            if (thisScene.t === -1) {

                clearInterval(x);
                thisScene.staticScoreText.setVisible(false);
                thisScene.scoreText.setVisible(false);
                thisScene.gameOverText.setVisible(true);
                // clearInterval(this.discoInterval);
                // Write score to leaderboard
                // this.writeLeaderBoard();
                setTimeout(function () {
                    thisScene.scene.start('LeaderBoard')
                }, 2000, thisScene)

            }
        }, 1000, thisScene);
    }
}

