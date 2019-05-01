// version 0.1.5

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload() {
    this.load.image('background', 'assets/img/background.jpg');
    this.load.image('bin', 'assets/img/bin.jpg');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana.png');

    console.log("pre-load");
}

function create() {
    this.add.image(400, 300, 'background');
    paper = this.physics.add.sprite(400, 550, 'paper');
    paper.setInteractive();
    paper.displayHeight = 50;
    paper.displayWidth = 50;

    bin = this.physics.add.sprite(400, 100, 'bin');
    bin.displayHeight = 150;
    bin.displayWidth = 150;

    // this.physics.add.collider(paper, bin);
    // this.physics.add.overlap(paper, bin, hitTarget, null, this);




    // function hitTarget() {


    console.log("create");


}

function update() {
    let BetweenPoints = Phaser.Math.Angle.BetweenPoints;
    let SetToAngle = Phaser.Geom.Line.SetToAngle;
    let velocityFromRotation = this.physics.velocityFromRotation;
    // let velocity = new Phaser.Math.Vector2(-100.0, 100.0);
    let line = new Phaser.Geom.Line();
    let gfx = this.add.graphics().setDefaultStyles({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } });


    paper.on('pointerdown', function (pointerdown) {
        if (paper.getBounds().contains(pointerdown.downX, pointerdown.downY)) {
            this.input.on('pointerup', function (pointerup) {
                let angle = BetweenPoints(paper, pointerup);
                let velocityX = pointerup.upX - pointerdown.downX;
                let velocityY = pointerup.upY - pointerdown.downY;

                let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
                velocity.scale(500);

                // console.log(velocityX);
                // console.log(velocityY);
                // console.log(velocity);

                paper.enableBody(true, paper.x, paper.y, true, true).body.setVelocity(velocity.x, velocity.y);
                gfx.clear().strokeLineShape(line);
                // todo: find the non-deprecated way to remove event listener
                this.input.removeListener('pointerup');

                v2 = pointerdown.position
            }, this);
        }

        this.physics.add.overlap(paper, bin, hitTarget, null, this);
        function hitTarget(paper, bin) {
            paper.disableBody(true, true);
            paper.enableBody(true, 400, 550, true, true);
        }
    }, this);
    console.log("update");
}