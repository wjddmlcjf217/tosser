import JournalScene from './journal.js'

export default class TitleScene extends Phaser.Scene {
    constructor () {
        super('Title');
    }

    preload() {
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
        this.load.image('book', 'assets/img/book.png');
        this.load.image('journal', 'assets/img/journal.jpg');

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

    create () {
        this.createBackground();

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

        //Journal
        this.journalButton = this.add.image(window.innerWidth * 0.17, window.innerHeight * 0.99, 'book');
        this.journalButton.displayWidth = window.innerWidth * 0.15;
        this.journalButton.displayHeight = window.innerHeight * 0.075;
        this.journalButton.setInteractive();
        this.journalButton.setOrigin(1);
        this.journalButton.on('pointerdown', function() {
            this.createJournal();
            this.signOutButton.visible = false;
            this.journalButton.visible = false;
        }, this);
    }

    createBackground() {
        let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }

    createJournal() {
        this.journalContainer = this.add.container(0, 0);
        let bg = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5, 'journal').setOrigin(0.5);
        bg.displayWidth = window.innerWidth * 0.90;
        bg.displayHeight = window.innerHeight * 0.90;
        this.journalContainer.add(bg);
        let heading = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.15, "Did You Know?", JOURNAL_FONT).setOrigin(0.5);
        this.journalContainer.add(heading);
        this.createCloseButton();
        this.journalContainer.add(this.closeButton);
    }

    createCloseButton() {
        this.closeButton = this.add.text(window.innerWidth * 0.90, window.innerHeight * 0.09, 'X', JOURNAL_FONT).setOrigin(0.5);
        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.journalContainer.destroy();
            this.signOutButton.visible = true;
            this.journalButton.visible = true;
        })
    }
};