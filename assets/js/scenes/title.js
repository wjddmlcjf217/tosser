export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Title',
            pack: {
                files: [
                    { type: 'image', key: 'loading', url: 'assets/img/loading.png' },
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
        let whiteFade = this.add.rectangle(
            window.innerWidth * 0.5, window.innerHeight * 0.5, window.innerWidth, window.innerHeight, 0xffffff, 1);
        whiteFade.setDepth(1000);
        whiteFade.setAlpha(0);
        this.tweens.add({
            targets: whiteFade,
            alpha: 1.0,
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            yoyo: true
        });

        this.time.delayedCall(500, function () {
            // Background
            let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
            background.displayHeight = window.innerHeight;
            background.displayWidth = window.innerWidth;

            // Logo
            this.logo = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.3, 'logo');
            this.logo.setOrigin(0.5);

            // Game
            this.gameButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.55, 'Play', TITLE_FONT);
            this.gameButton.setOrigin(0.5);
            this.gameButton.setInteractive();
            this.gameButton.on('pointerdown', () => {
                this.scene.start('Game')
            });

            // LeaderBoard
            this.optionsButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.75, 'LeaderBoard', TITLE_FONT);
            this.optionsButton.setOrigin(0.5);
            this.optionsButton.setInteractive();
            this.optionsButton.on('pointerdown', () => {
                this.scene.start('LeaderBoard')
            });

            // Credits
            this.creditsButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.85, 'Credits', TITLE_FONT);
            this.creditsButton.setOrigin(0.5);
            this.creditsButton.setInteractive();
            this.creditsButton.on('pointerdown', () => {
                this.scene.start('Credits')
            });

            // Tutorial
            this.tutorialButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.65, 'Tutorial', TITLE_FONT);
            this.tutorialButton.setOrigin(0.5);
            this.tutorialButton.setInteractive();
            this.tutorialButton.on('pointerdown', () => {
                this.scene.start('Tutorial')
            });

            // Sign-out
            this.signOutButton = this.add.text(window.innerWidth * 0.98, window.innerHeight * 0.99, 'Sign Out', TITLE_FONT);
            this.signOutButton.setFontSize(70);
            this.signOutButton.setOrigin(1);
            this.signOutButton.setInteractive();
            this.signOutButton.on('pointerdown', () => {
                firebase.auth().signOut();
                window.location.href = 'index.html'
            });
        }, null, this);
    }
}