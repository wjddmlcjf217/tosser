export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super("Tutorial")
    }

    preload() {
        this.load.image('background', 'assets/img/study_area.png');

    }

    create() {

    }

    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }
}