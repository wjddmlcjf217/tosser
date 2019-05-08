import config from './scenes/config.js'
import GameScene from './scenes/game.js'
import TitleScene from './scenes/title.js'
import LeaderBoard from './scenes/leaderboard.js'


class Game extends Phaser.Game {
    constructor () {
        super(config);
        this.scene.add('Title', TitleScene);
        this.scene.add('LeaderBoard', LeaderBoard);
        this.scene.add('Game', GameScene);
        this.scene.start('Title');
    }
}

window.game = new Game();