// phaser game configuration
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// initialize phaser game
let game = new Phaser.Game(config);
console.log(game);

// initialise queue
let queuePosition = 0;
let projectileQueue = [
    {
        name: 'paper',
        image: 'paper'
    },
    {
        name: 'banana',
        image: 'banana'
    }
];

// preload phaser game
function preload() {
    // load image assets
    this.load.image('background', 'assets/img/background.jpg');
    this.load.image('bin', 'assets/img/bin.jpg');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
}

// projectile vector math
let betweenPoints = Phaser.Math.Angle.BetweenPoints;

// create phaser game
function create() {
    // create background
    let background = this.add.image(400, 300, 'background');

    // crete bin
    let bin = this.add.image(400, 100, 'bin');
    bin.displayWidth = 150;
    bin.displayHeight = 150;
}

// update phaser game
function update() {
    let paper = createProjectileSprite(this)
}

// create create sprite from queue
function createProjectileSprite(game) {
    // create new projectile object
    let newProjectile = game.physics.add.sprite(400, 550, 'paper');
    newProjectile.displayWidth = 50;
    newProjectile.displayHeight = 50;
    newProjectile.setInteractive();

    // add sprite physics
    // add listener for pointer down on the object
    newProjectile.on('pointerdown', function (pointerDown) {
        // position of pointer down
        let downPointPosition = new Phaser.Geom.Point(pointerDown.x, pointerDown.y);
        if (newProjectile.getBounds().contains(pointerDown.downX, pointerDown.downY)) {
            // add listener for pointer up if the pointer down was on the object
            game.input.on('pointerup', function (pointerUp) {
                // position of pointer up
                let upPointerPosition = new Phaser.Geom.Point(pointerUp.x, pointerUp.y);
                let angle = Phaser.Math.Angle.BetweenPoints(downPointPosition, upPointerPosition);
                console.log("downPointPosition -> " + downPointPosition.x + ", " + downPointPosition.y);
                console.log("upPointPosition -> " + upPointerPosition.x + ", " + upPointerPosition.y);
                console.log("Angle -> " + angle);
                // todo: missing arguments for removeListener
                game.input.removeListener('pointerup');
            })
        }
    });
    return newProjectile;
}