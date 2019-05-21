import GameScene from './game.js'

export default class ChallengeMode extends GameScene {
    constructor() {
        super("ChallengeMode");
    }

    create() {
        super.create();

        // this.optionButton.visible = false;


        // Create timer
        this.t = 30;
        this.timeText = this.add.text(window.innerWidth / 3, window.innerHeight / 6, null, {
            fontFamily: 'Kalam',
            fontSize: 70,
            color: '#000000',
        });

        this.updateTimer(this);

        // this.mainMenu.on('pointerdown', function() {
        //     clearInterval(this.timerInterval);
        //     this.scene.start('Title');
        // }, this);

    }

    updateTimer() {
        this.timeText.setText('Timer: ' + this.t);
        this.t--;
        let thisScene = this;
        thisScene.timerInterval = setInterval(function () {
            // line 37 thisScene.t becomes null on game end
            thisScene.timeText.setText('Timer: ' + thisScene.t);
            // console.log(this);
            thisScene.t--;
            if (thisScene.t === -1) {
                clearInterval(thisScene.timerInterval);
                thisScene.staticScoreText.setVisible(false);
                thisScene.scoreText.setVisible(false);
                thisScene.gameOverText.setVisible(true);
                thisScene.writeChallengeLeaderBoard();
                setTimeout(function () {
                    thisScene.scene.start('ChallengeLeaderBoard')
                }, 2000, thisScene)
            }
        }, 1000, thisScene);
    }

    createOptions() {
        this.optionContainer = this.add.container(0,0);
        let bg = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5, 'options_background').setOrigin(0.5);
        bg.displayWidth = window.innerWidth * 0.90;
        bg.displayHeight = window.innerHeight * 0.60;
        this.optionContainer.add(bg);
        this.resumeGame = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.4, 'Resume', TITLE_FONT).setOrigin(0.5);
        this.resumeGame.setFontSize(150);
        this.resumeGame.setInteractive();
        this.resumeGame.on('pointerdown', () => {
            this.optionContainer.destroy();
            this.journalButton.visible = true;
            this.hero.visible = true;
            this.optionButton.visible = true;
        }, this);
        this.optionContainer.add(this.resumeGame);
        this.mainMenu = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.55, 'Main Menu', TITLE_FONT).setOrigin(0.5);
        this.mainMenu.setFontSize(150);
        this.mainMenu.setInteractive();
        this.mainMenu.on('pointerdown', function() {
            this.sound.stopAll('disco');
            this.discoBall.removeInteractive();
            clearInterval(this.timerInterval);
            clearInterval(this.discoInterval);
            this.scene.start('Title');
        }, this);
        this.optionContainer.add(this.mainMenu);
    }

    /**
     * Reduce player lives
     */
    lifeHandler() {
        let life = this.lives.getFirstAlive();
        if (life) {
            this.lives.killAndHide(life);
        }

        if (this.lives.countActive() < 1) {
            clearInterval(this.timerInterval);
            this.hero.active = false;
            this.staticScoreText.setVisible(false);
            this.scoreText.setVisible(false);
            this.gameOverText.setVisible(true);

            // remove disco effect
            this.sound.stopAll('disco');
            this.discoBall.removeInteractive();
            clearInterval(this.discoInterval);

            // Write score to leaderboard
            this.writeChallengeLeaderBoard();
            let thisScene = this;
            setTimeout(function () {
                thisScene.scene.start('ChallengeLeaderBoard')
            }, 2000, thisScene)
        }
    }

    /**
     * write to firebase with score ONLY if it's a higher score
     */
    // Write score for challenge mode
    writeChallengeLeaderBoard() {
        this.displayName = firebase.auth().currentUser.displayName;
        let first_name = this.displayName.split(' ')[0];
        if (this.scoreValue > leaderBoard[first_name] || leaderBoard[first_name] === undefined) {
            firebase.database().ref("challengeUsers/").update({
                [first_name]: this.scoreValue
            });
        }
    }
}

