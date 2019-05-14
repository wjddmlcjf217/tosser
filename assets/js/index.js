import config from './scenes/config.js'
import GameScene from './scenes/game.js'
import TitleScene from './scenes/title.js'
import LeaderBoard from './scenes/leaderboard.js'
import CreditsScene from './scenes/credits.js'
import TutorialScene from './scenes/tutorial.js'

class Game extends Phaser.Game {
    constructor () {
        super(config);
        this.scene.add('Title', TitleScene);
        this.scene.add('LeaderBoard', LeaderBoard);
        this.scene.add('Game', GameScene);
        this.scene.add('Credits', CreditsScene);
        this.scene.add('Tutorial', TutorialScene);
        this.scene.start('Title');
    }
}

WebFont.load({
    google: {
        families: ['Luckiest Guy', 'Kalam', 'Acme']
    },
    active: launchGame
});

function launchGame() {
    loadLeaderBoard().then(function () {
        window.game = new Game();
    });
}