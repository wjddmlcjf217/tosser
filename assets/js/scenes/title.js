import {fadeIn} from './transistions.js'

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    preload() {
    }

    create() {
        // Fade In
        fadeIn(this, 0xFFFFFF, 500);

        // Background
        let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;

        // Logo
        this.logo = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.3, 'logo');
        this.logo.setOrigin(0.5);

        // Game
        this.gameButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.45, 'Play', TITLE_FONT);
        this.gameButton.setOrigin(0.5);
        this.gameButton.setInteractive();
        this.gameButton.on('pointerdown', () => {this.scene.start('Game')});

        // Challenge-Mode
        this.tutorialButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.55, 'Challenge-Mode', TITLE_FONT);
        this.tutorialButton.setOrigin(0.5);
        this.tutorialButton.setInteractive();
        this.tutorialButton.on('pointerdown', () => {this.scene.start('Subclass')});

        // LeaderBoard
        this.optionsButton = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.75, 'LeaderBoard', TITLE_FONT);
        this.optionsButton.setOrigin(0.5);
        this.optionsButton.setInteractive();
        this.optionsButton.on('pointerdown', () => {this.scene.start('Nav')});

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

        // Sign-out
        this.signOutButton = this.add.text(window.innerWidth * 0.98, window.innerHeight * 0.99, 'Sign Out', TITLE_FONT);
        this.signOutButton.setFontSize(70);
        this.signOutButton.setOrigin(1);
        this.signOutButton.setInteractive();
        this.signOutButton.on('pointerdown', () => {
            firebase.auth().signOut();
            window.location.href = 'index.html'
        });

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

    createJournal() {
        this.journalContainer = this.add.container(0, 0);
        let bg = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5, 'journal').setOrigin(0.5);
        bg.displayWidth = window.innerWidth * 0.90;
        bg.displayHeight = window.innerHeight * 0.90;
        this.journalContainer.add(bg);
        let heading = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.15, "About the Game", JOURNAL_FONT).setOrigin(0.5);
        this.journalContainer.add(heading);
        let about = ["It was a dark and stormy night... The goons",
            "were enjoying their long walk along the coast",
            "of Kitsilano beach. When suddenly, a single",
            "plastic bottle washed up on the shore. Kevin",
            "picked up the bottle, furious at its presence",
            "along the coastline of his beautiful city. Just",
            "as he was about to toss the bottle into the",
            "recycling bin, reinforcements arrived in waves.",
            "Plastics, pop cans, cardboards! The battlefield",
            "was now littered with their presence. Jacky was",
            "being overwhelmed by the enemy as Dillon",
            "rushed to his side to help. Even Bryden's large",
            "stature could not hold back all this human",
            "trash. As everyone falls around him, Jared,",
            "barely standing, screams into the night, only",
            "to be drowned out by the screams of his squad",
                "around him . And thus, we began our journey to",
            "change the world. One toss at a time."];
        let content = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.53, about, JOURNAL_FONT).setOrigin(0.5);
        content.setFontSize(40);
        this.journalContainer.add(content);
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
}