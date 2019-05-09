export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('LeaderBoard');
    }


    preload() {
        this.load.image('background', 'assets/img/study_area.png');
    }

    create() {
        this.leaderboardCreated = false;
        this.createBackground(this)
        this.titlebutton = this.add.text(window.innerWidth * 0.25, window.innerHeight * 0.65, 'Main Menu', {
            fontStyle: 'Bolder',
            fontSize: 100,
            color: 'black'
        });
        this.titlebutton.setInteractive();
        this.titlebutton.on('pointerdown', () => {this.scene.start('Title')})
    }

    update() {
        if (this.leaderboardCreated === false) {
            this.add.text(window.innerWidth * 0.30, window.innerHeight * 0.05, "Leaderboard", {
                fontFamily: 'Arial',
                fontSize: 64,
                color: 'black'
            });
            if (playerList.length > 0) {
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

    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }
}

