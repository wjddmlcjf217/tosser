import config from '../scenes/config.js';

export default class CreditsScene extends Phaser.Scene {
    constructor () {
        super('Credits');
    }

    create () {
        this.creditsText = this.add.text(0, 0, 'Credits', { fontSize: 64, fill: '#fff' });
        this.madeByText = this.add.text(0, 0, 'Created By: ', { fontSize: 52, fill: '#fff' });
        this.brydenText = this.add.text(0, 0, 'Bryden Mitchell', { fontSize: 52, fill: '#fff' });
        this.dillonText = this.add.text(0, 0, 'Dillon Yeh', { fontSize: 52, fill: '#fff' });
        this.kevinText = this.add.text(0, 0, 'Kevin Jeong', { fontSize: 52, fill: '#fff' });
        this.jackyText = this.add.text(0, 0, 'Jacky Zheng', { fontSize: 52, fill: '#fff' });
        this.jaredText = this.add.text(0, 0, 'Jared Hall', { fontSize: 52, fill: '#fff' });
        this.thankYou = this.add.text(0, 0, 'Thank You!', { fontSize: 52, fill: '#fff'});
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
};