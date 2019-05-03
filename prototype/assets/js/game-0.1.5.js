// version 0.1.5


let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
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
    this.load.image('bin_top', 'assets/img/bin_top.png');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
}

function create() {
    this.gamecolliders = [];

    background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerWidth;

    // curve = new Phaser.Curves.Line([200, 750, 375, 750]);
    // this.physics.world.enable(curve);
    // curve.body.setCollideWorldBounds(true);
    // curve.body.setImmovable(true);
    // curve.body.checkCollision.down = true;


    paper = this.physics.add.image(530, 1400, 'paper');
    paper.setInteractive();
    paper.displayHeight = 150;
    paper.displayWidth = 150;
    paper.body.onWorldBounds = true;
    paper.body.setCollideWorldBounds(true);
    paper.setBounce(0.4);

    bin_top = this.physics.add.image(290, 750, 'bin_top');
    bin_top_2 = this.physics.add.image(650, 750, 'bin_top');
    floor = this.physics.add.image(window.innerWidth / 2, 975, 'bin_top');
    floor.displayWidth = window.innerWidth;
    floor.setImmovable(true);

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
    gfx = this.add.graphics().setDefaultStyles({lineStyle: {width: 10, color: 0xffdd00, alpha: 0.5}});

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

                paper.enableBody(true, paper.x, paper.y, true, true).body.setVelocity(velocity.x * 0.2, velocity.y * 1.45);
                paper.setAngularVelocity(500);
                paper.body.setAccelerationY((velocity.y * -1) * 0.75);
                gfx.clear().strokeLineShape(line);
                // todo: find the non-deprecated way to remove event listener
                this.input.removeListener('pointerup');

                v2 = pointerdown.position;


            }, this);
        }


    }, this);

    this.physics.add.overlap(paper, bin_top, hitTarget, null, this);
    this.physics.add.overlap(paper, bin_top_2, hitTarget, null, this);
    this.gamecolliders.push(this.physics.add.collider(paper, floor, missedTarget, null, this));
    this.gamecolliders[0].active = false

}

function update() {
    if (item_status && paper.displayHeight > 50 && paper.displayWidth > 50) {
        paper.displayHeight -= 0.7;
        paper.displayWidth -= 0.7;
    }
    if (paper.body.velocity.y > 0 && this.gamecolliders[0].active == false) {
        this.gamecolliders[0].active = true
    }
    // curve.draw(gfx)
}

function hitTarget() {
    if (paper.body.velocity.y > 0) {
        paper.disableBody(true, true);
        paper.enableBody(true, 530, 1400, true, true);
        paper.visible = true;
        item_status = false;
        paper.displayHeight = 150;
        paper.displayWidth = 150;
    }
    this.gamecolliders[0].active = false;
}

function missedTarget () {
    paper.body.setAllowDrag(true);
    paper.body.setDrag(20, 0);
    paper.body.setAngularDrag(180);
    this.gamecolliders[0].active = false;
    if (paper.body.angularVelocity == 0) {
        paper.disableBody(true, true);
        paper.enableBody(true, 530, 1400, true, true);
        paper.visible = true;
        item_status = false;
        paper.displayHeight = 150;
        paper.displayWidth = 150;
        paper.body.setAllowDrag(false);
    }
    }
