// version 0.1.5


let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

var item_status = false;

function preload() {
    this.load.image('background', 'assets/img/school_scene.png');
    this.load.image('bin', 'assets/img/bin.jpg');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
}

function create() {
    background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerWidth;

    paper = this.physics.add.image(530, 1400, 'paper');
    paper.setInteractive();
    paper.displayHeight = 150;
    paper.displayWidth = 150;
    paper.body.onWorldBounds = true;
    paper.body.setCollideWorldBounds(true);

    // bin = this.physics.add.image(400, 100, 'bin');
    // bin.displayHeight = 150;
    // bin.displayWidth = 150;

    // this.physics.add.collider(paper, bin);
    // this.physics.add.overlap(paper, bin, hitTarget, null, this);

    // function that does something when an object collides with the bounds
    this.physics.world.on('worldbounds', function () {
        // console.log('You hit the bounds!');
    });

    // function hitTarget() {
    let BetweenPoints = Phaser.Math.Angle.BetweenPoints;
    let SetToAngle = Phaser.Geom.Line.SetToAngle;
    let velocityFromRotation = this.physics.velocityFromRotation;
    // let velocity = new Phaser.Math.Vector2(-100.0, 100.0);
    let line = new Phaser.Geom.Line();
    let gfx = this.add.graphics().setDefaultStyles({lineStyle: {width: 10, color: 0xffdd00, alpha: 0.5}});

    // spawn paper and object physiscs
    paper.on('pointerdown', function (pointerdown) {
        if (paper.getBounds().contains(pointerdown.downX, pointerdown.downY)) {
            this.input.on('pointerup', function (pointerup) {
                let angle = BetweenPoints(paper, pointerup);
                let velocityX = pointerup.upX - pointerdown.downX;
                let velocityY = pointerup.upY - pointerdown.downY;
                item_status = true;
                let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
                velocity.scale(1000);

                paper.enableBody(true, paper.x, paper.y, true, true).body.setVelocity(velocity.x, velocity.y);
                paper.setAngularVelocity(500);
                paper.body.setAccelerationY((velocity.y * -1) * 0.5);
                gfx.clear().strokeLineShape(line);
                // todo: find the non-deprecated way to remove event listener
                this.input.removeListener('pointerup');

                v2 = pointerdown.position
            }, this);
        }

        // this.physics.add.overlap(paper, bin, hitTarget, null, this);
        // function hitTarget(paper, bin) {
        //     paper.disableBody(true, true);
        //     paper.enableBody(true, 400, 550, true, true);
        //     paper.visible = false;
        //     banana.visible = true;
        //     item_status = false;
        //     paper.displayHeight = 50;
        //     paper.displayWidth = 50;
        // }

    }, this);
}

function update() {
    if (item_status) {
        paper.displayHeight -= 0.6;
        paper.displayWidth -= 0.6;
    }
    }