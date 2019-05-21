import GameScene from './game.js'

export default class SubclassTest extends GameScene {
    constructor() {
        super("ChallengeMode");
    }

    create() {
        super.create();

        // Create timer
        this.t = 30;
        this.timeText = this.add.text(window.innerWidth / 3, window.innerHeight / 6, null, {
            fontFamily: 'Kalam',
            fontSize: 70,
            color: '#000000',
        });

        this.updateTimer(this);

        //Option
        this.optionButton = this.add.image(window.innerWidth * 0.945, window.innerHeight * 0.035, 'option');
        this.optionButton.displayWidth = window.innerWidth * 0.10;
        this.optionButton.displayHeight = window.innerHeight * 0.056;
        this.optionButton.setInteractive();
        this.optionButton.on('pointerdown', function() {
            this.createOptions();
            this.optionButton.visible = false;
            this.hero.visible = false;
            this.journalButton.visible = false;
        }, this);
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

