import config from './config.js';

export default class CreditsScene extends Phaser.Scene {
    constructor () {
        super('Credits');
    }

    create () {
        this.createBackground(this);
        this.creditsText = this.add.text(0, 0, 'Credits', LEADERBOARD_FONT);
        this.madeByText = this.add.text(0, 0, 'Created By: ', LEADERBOARD_FONT);
        this.brydenText = this.add.text(0, 0, 'Bryden Mitchell', LEADERBOARD_FONT);
        this.dillonText = this.add.text(0, 0, 'Dillon Yeh', LEADERBOARD_FONT);
        this.kevinText = this.add.text(0, 0, 'Kevin Jeong', LEADERBOARD_FONT);
        this.jackyText = this.add.text(0, 0, 'Jacky Zheng', LEADERBOARD_FONT);
        this.jaredText = this.add.text(0, 0, 'Jared Hall', LEADERBOARD_FONT);
        this.thankYou = this.add.text(0, 0, 'Thank You!', LEADERBOARD_FONT);
        this.zone = this.add.zone(config.width/2, config.height/2, config.width, config.height);
        this.tweenArray = [this.creditsText, this.madeByText, this.brydenText, this.dillonText, this.kevinText, this.jackyText, this.jaredText, this.thankYou];
        const offset = -3500;

        for (let i = 0; i < this.tweenArray.length; i++) {
            this.center(this.tweenArray[i])
        }

        this.madeByText.setY(2000);
        this.brydenText.setY(2200);
        this.dillonText.setY(2400);
        this.kevinText.setY(2600);
        this.jackyText.setY(2800);
        this.jaredText.setY(3000);
        this.thankYou.setY(4300);

        this.creditsTween = this.tweens.add({
            targets: this.creditsText,
            y: -300,
            ease: 'Power1',
            duration: 3000,
            delay: 1000,
            onComplete: function () {
                this.destroy;
            }
        });

        for (let i = 1; i < this.tweenArray.length; i++) {
            this.madeByTween = this.tweens.add({
                targets: this.tweenArray[i],
                y: this.tweenArray[i].y + offset,
                ease: 'linear',
                duration: 9000,
                delay: 1000,
                onComplete: function () {
                    this.madeByTween.destroy;
                    this.scene.start('Title');
                }.bind(this)
            });
        }
    }

    center (text) {
        Phaser.Display.Align.In.Center(
            text,
            this.zone
        )
    }

    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }
};