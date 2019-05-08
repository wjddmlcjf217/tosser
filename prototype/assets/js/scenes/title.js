import config from '../scenes/config.js'
import Button from '../objects/button.js'

export default class TitleScene extends Phaser.Scene {
    constructor () {
        super('Title');
    }

    preload() {
        this.load.image('background', 'assets/img/study_area.png');
    }

    create () {
        this.createBackground(this);

        // Game
        this.gameButton = this.add.text(window.innerWidth * 0.38, window.innerHeight * 0.55, 'Play', {
            fontStyle: 'Bolder',
            fontSize: 100,
            color: 'black'
        });
        this.gameButton.setInteractive();
        this.gameButton.on('pointerdown', () => {this.scene.start('Game')});

        // Options
        this.optionsButton = this.add.text(window.innerWidth * 0.18, window.innerHeight * 0.65, 'LeaderBoard', {
            fontStyle: 'Bolder',
            fontSize: 100,
            color: 'black',
        });
        this.optionsButton.setInteractive();
        this.optionsButton.on('pointerdown', () => {this.scene.start('LeaderBoard')});

        // Credits
        this.creditsButton = this.add.text(window.innerWidth * 0.29, window.innerHeight * 0.75, 'Credits', {
            fontStyle: 'Bolder',
            fontSize: 100,
            color: 'black',
        });
        this.creditsButton.setInteractive();
        this.creditsButton.on('pointerdown', () => {this.scene.start('Credit')})

    }

    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }

    centerButton (gameObject, offset = 0) {
        Phaser.Display.Align.In.Center(
            gameObject,
            this.add.zone(config.width/2, config.height/2 - offset * 100, config.width, config.height)
        );
    }

    centerButtonText (gameText, gameButton) {
        Phaser.Display.Align.In.Center(
            gameText,
            gameButton
        );
    }
};