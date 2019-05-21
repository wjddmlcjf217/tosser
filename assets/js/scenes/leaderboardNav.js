export default class NavScene extends Phaser.Scene {
    constructor() {
        super("Nav");
    }

    create () {
        this.createBackground();

        // Header
        this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.1, 'Which Leader Board?', LEADERBOARD_FONT).setOrigin(0.5);


        // Normal
        this.normalButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.35, 'Normal', LEADERBOARD_FONT);
        this.normalButton.setOrigin(0.5);
        this.normalButton.setFontSize(150);
        this.normalButton.setInteractive();
        this.normalButton.on('pointerdown', () => {this.scene.start('LeaderBoard')});

        // Challenge
        this.challengeButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.55, 'Challenge', LEADERBOARD_FONT);
        this.challengeButton.setOrigin(0.5);
        this.challengeButton.setFontSize(150);
        this.challengeButton.setInteractive();

        // Main Menu
        this.titleButton = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.8, 'Main Menu', LEADERBOARD_FONT);
        this.titleButton.setFontSize(100);
        this.titleButton.setOrigin(0.5);
        this.titleButton.setInteractive();
        this.titleButton.on('pointerdown', () => {this.scene.start('Title')})
    }


    createBackground() {
        let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }
}