/**
 * ChallengeMode shows the user the top 8 scores from normal mode
 */
export default class ChallengeLeaderBoard extends Phaser.Scene {
    constructor() {
        super('ChallengeLeaderBoard');
    }

    create() {
        // flag for when to draw leaderboard
        this.leaderboardCreated = false;
        // create background
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

    update() {
        // if the leaderboard has loaded
        if (this.leaderboardCreated === false) {
            // prints the top 8 player scores to the leaderboard
            this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.1, "Challenge Mode\nLeaderboard", LEADERBOARD_FONT).setOrigin(0.5).setFontSize(100).setAlign('center');
            let y = window.innerHeight * 0.15;
            let counter = 0;
            for (let i = 0; i < challengePlayerList.length; i++) {
                counter++;
                y += 100;
                this.add.text(window.innerWidth * 0.20, y, challengePlayerList[i][0], LEADERBOARD_FONT);
                this.add.text(window.innerWidth * 0.70, y, challengePlayerList[i][1], LEADERBOARD_FONT);
                if (counter === 8) {
                    break
                }
            }
            this.leaderboardCreated = true;
        }
    }

    /**
     * Creates Background
     */
    createBackground() {
        let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }
}