import config from './scenes/config.js'
import GameScene from './scenes/game.js';
import TitleScene from './scenes/title.js';
import Leaderboard from './scenes/leaderboard.js';

class Game extends Phaser.Game {
    constructor () {
        super(config);
        this.scene.add('Title', TitleScene);
        this.scene.add('Leaderboard', Leaderboard);
        this.scene.add('Game', GameScene);
        this.scene.start('Title');
    }
}

loadLeaderBoard().then(function () {
    window.game = new Game();
});