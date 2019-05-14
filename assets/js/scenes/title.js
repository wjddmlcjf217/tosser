import config from './config.js'
import Button from '../objects/button.js'

export default class TitleScene extends Phaser.Scene {
    constructor () {
        super('Title');
    }

    preload() {
        this.load.image('background_blur', 'assets/img/study_area_blur.png');
        this.load.image('logo', 'assets/img/tosser_logo.png');
    }

    create () {
        this.createBackground(this);

        //Logo
        this.logo = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.3, 'logo');
        this.logo.setOrigin(0.5);

        // Game
        this.gameButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.55, 'Play', TITLE_FONT);
        this.gameButton.setOrigin(0.5);
        this.gameButton.setInteractive();
        this.gameButton.on('pointerdown', () => {this.scene.start('Game')});

        // LeaderBoard
        this.optionsButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.75, 'LeaderBoard', TITLE_FONT);
        this.optionsButton.setOrigin(0.5);
        this.optionsButton.setInteractive();
        this.optionsButton.on('pointerdown', () => {this.scene.start('LeaderBoard')});

        // Credits
        this.creditsButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.85, 'Credits', TITLE_FONT);
        this.creditsButton.setOrigin(0.5);
        this.creditsButton.setInteractive();
        this.creditsButton.on('pointerdown', () => {this.scene.start('Credits')});

        // Tutorial
        this.tutorialButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.65, 'Tutorial', TITLE_FONT);
        this.tutorialButton.setOrigin(0.5);
        this.tutorialButton.setInteractive();
        this.tutorialButton.on('pointerdown', () => {this.scene.start('Tutorial')});

        //Sign-out
        this.signOutButton = this.add.text(window.innerWidth * 0.98, window.innerHeight * 0.99, 'Sign Out', TITLE_FONT);
        this.signOutButton.setFontSize(70);
        this.signOutButton.setOrigin(1);
        this.signOutButton.setInteractive();
        this.signOutButton.on('pointerdown', () => {
            firebase.auth().signOut();
            window.location.href = 'index.html'});
    }

    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
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