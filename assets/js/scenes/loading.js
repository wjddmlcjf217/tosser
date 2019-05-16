import {fadeOut} from './transistions.js'

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Loading',
            pack: {
                files: [
                    {type: 'image', key: 'loading', url: 'assets/img/loading.png'},
                ]
            }
        });
    }

    preload() {
        // loading screen assets
        let background = this.add.rectangle(
            window.innerWidth * 0.5, window.innerHeight * 0.5, window.innerWidth, window.innerHeight, 0xffffff);
        let loadingText = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.38, 'Loading...', LOADING_FONT);
        loadingText.setOrigin(0.5);
        loadingText.setShadowBlur(3);
        let loadingImage = this.physics.add.image(window.innerWidth * 0.5, window.innerHeight * 0.54, 'loading');
        loadingImage.setAngularVelocity(150);

        // image assets
        this.load.image('apple', 'assets/img/apple.png');
        this.load.image('background', 'assets/img/study_area.png');
        this.load.image('background_blur', 'assets/img/study_area_blur.png');
        this.load.image('banana', 'assets/img/banana.png');
        this.load.image('discoball', 'assets/img/disco-ball.png');
        this.load.image('paper', 'assets/img/paper_ball.png');
        this.load.image('life', 'assets/img/life.gif');
        this.load.image('light_off', 'assets/img/light_off.png');
        this.load.image('light_on', 'assets/img/light_on.png');
        this.load.image('logo', 'assets/img/tosser_logo.png');
        this.load.image('scoreboard', 'assets/img/scoreboard.png');
        this.load.image('plus1', 'assets/img/plus1.jpg');
        this.load.image('waterbottle', 'assets/img/water_bottle.png');
        this.load.image('wind_arrow', 'assets/img/arrow.png');
        this.load.image('good', 'assets/img/good.png');
        this.load.image('bad', 'assets/img/bad.png');
        this.load.image('journal', 'assets/img/journal.jpg');
        this.load.image('book', 'assets/img/book.png');
        this.load.image('option', 'assets/img/options.png');
        this.load.image('options_background', 'assets/img/options_backgroung.png');

        // profile pictures
        this.load.image('bryden', 'assets/img/paper_ball.png');
        this.load.image('dillon', 'assets/img/paper_ball.png');
        this.load.image('kevin', 'assets/img/paper_ball.png');
        this.load.image('jacky', 'assets/img/paper_ball.png');
        this.load.image('jared', 'assets/img/paper_ball.png');

        // audio assets
        this.load.audio('hit-target', [
            'assets/audio/bin-sound.m4a',
            'assets/audio/bin-sound.mp3',
        ]);
        this.load.audio('disco', 'assets/audio/ymca.mp3')
    }

    create() {
        fadeOut(this, 0xFFFFFF, 500);
        this.time.delayedCall(500, function () {
            this.scene.start('Title');
        }, null, this);
    }
}