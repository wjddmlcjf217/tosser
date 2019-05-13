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
        this.brydenBio = this.add.text(0, 0, "'Fueled by Nat\'s Pizzeria'", LEADERBOARD_FONT);
        this.dillonText = this.add.text(0, 0, 'Dillon Yeh', LEADERBOARD_FONT);
        this.dillonBio = this.add.text(0, 0, "'I have access to kids'", LEADERBOARD_FONT);
        this.kevinText = this.add.text(0, 0, 'Kevin Jeong', LEADERBOARD_FONT);
        this.kevinBio = this.add.text(0, 0, "'DEEZ NUTS'", LEADERBOARD_FONT);
        this.jackyText = this.add.text(0, 0, 'Jacky Zheng', LEADERBOARD_FONT);
        this.jackyBio = this.add.text(0, 0, "'All is fixed with var'", LEADERBOARD_FONT);
        this.jaredText = this.add.text(0, 0, 'Jared Hall', LEADERBOARD_FONT);
        this.jaredBio = this.add.text(0, 0, "'We should add rimming'", LEADERBOARD_FONT);
        this.thankYou = this.add.text(0, 0, 'Thanks for playing!', LEADERBOARD_FONT);
        this.zone = this.add.zone(config.width/2, config.height/2, config.width, config.height);
        this.tweenArray = [this.creditsText, this.madeByText, this.brydenText, this.brydenBio, this.dillonText,
            this.dillonBio, this.kevinText, this.kevinBio, this.jackyText, this.jackyBio, this.jaredText, this.jaredBio,
            this.thankYou];
        const offset = -3500;

        for (let i = 0; i < this.tweenArray.length; i++) {
            this.center(this.tweenArray[i])
        }

        this.madeByText.setY(1800);
        this.brydenText.setY(2000);
        this.brydenBio.setY(2100);
        this.dillonText.setY(2300);
        this.dillonBio.setY(2400);
        this.kevinText.setY(2600);
        this.kevinBio.setY(2700);
        this.jackyText.setY(2900);
        this.jackyBio.setY(3000);
        this.jaredText.setY(3200);
        this.jaredBio.setY(3300);
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