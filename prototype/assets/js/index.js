import config from './scenes/config.js'
import GameScene from './scenes/game.js'
import TitleScene from './scenes/title.js'
import LeaderBoard from './scenes/leaderboard.js'
import CreditsScene from './scenes/credits.js'
import LoginScene from './scenes/login.js'


class Game extends Phaser.Game {
    constructor () {
        super(config);
        this.scene.add('Title', TitleScene);
        this.scene.add('LeaderBoard', LeaderBoard);
        this.scene.add('Game', GameScene);
        this.scene.add('Credits', CreditsScene);
        this.scene.add('Login', LoginScene);
        this.scene.start('Title');
    }
}

loadLeaderBoard().then(function () {
    window.game = new Game();
});