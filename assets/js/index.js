import config from './scenes/config.js'
import GameScene from './scenes/game.js'
import TitleScene from './scenes/title.js'
import LeaderBoard from './scenes/leaderboard.js'
import CreditsScene from './scenes/credits.js'
import TutorialScene from './scenes/tutorial.js'
import LoadingScene from './scenes/loading.js'
import ChallengeMode from './scenes/challengeMode.js'
import NavScene from './scenes/leaderboardNav.js'
import ChallengeLeaderBoardScene from './scenes/challengeLeaderboard.js'


class Game extends Phaser.Game {
    constructor () {
        super(config);
        this.scene.add('Loading', LoadingScene);
        this.scene.add('Title', TitleScene);
        this.scene.add('Nav', NavScene);
        this.scene.add('LeaderBoard', LeaderBoard);
        this.scene.add('ChallengeLeaderBoard', ChallengeLeaderBoardScene);
        this.scene.add('Game', new GameScene('Game'));
        this.scene.add('Credits', CreditsScene);
        this.scene.add('Tutorial', TutorialScene);
        this.scene.add('ChallengeMode', ChallengeMode);
        this.scene.start('Loading');
    }
}

WebFont.load({
    google: {
        families: ['Luckiest Guy', 'Kalam', 'Acme', 'Indie Flower']
    },
    active: launchGame
});

function launchGame() {
    loadLeaderBoard().then(function () {
        window.game = new Game();
    });
}