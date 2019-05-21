export default class ChallengeLeaderBoardScene extends Phaser.Scene {
    constructor() {
        super('ChallengeLeaderBoard');
    }

    create() {
        this.leaderboardCreated = false;
        this.createBackground();

        // Main Menu
        this.titleButton = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.8, 'Main Menu', LEADERBOARD_FONT);
        this.titleButton.setFontSize(100);
        this.titleButton.setOrigin(0.5);
        this.titleButton.setInteractive();
        this.titleButton.on('pointerdown', () => {
            this.scene.start('Title')
        });
    }

    createBackground() {
        let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }
}