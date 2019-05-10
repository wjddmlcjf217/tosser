import 'phaser';

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);
