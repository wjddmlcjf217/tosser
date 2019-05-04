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

new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/img/school_scene.png');
    this.load.image('bin_top', 'assets/img/bin_top.png');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
}


function create() {
    createBackground(this);
    this.hero = createHeroProjectile(this, 'paper');
    createPhysicsObjects(this);


    // function that does something when an object collides with the bounds
    // this.physics.world.on('worldbounds', function () {
    //     // console.log('You hit the bounds!');
    // });
    // let line = new Phaser.Geom.Line();
    // let gfx = this.add.graphics().setDefaultStyles({lineStyle: {width: 10, color: 0xffdd00, alpha: 0.5}});

    this.hero.on('pointerdown', pointerDownHandler, this);
}

function update() {
    if (this.hero.isFlying && this.hero.displayHeight > 35 && this.hero.displayWidth > 35) {
        this.hero.displayHeight -= 0.8;
        this.hero.displayWidth -= 0.8;
    }
    if (this.hero.body.velocity.y > 0 && this.floorCollider.active === false) {
        this.floorCollider.active = true
    }
}

function pointerDownHandler (pointer) {
    if (this.hero.getBounds().contains(pointer.downX, pointer.downY)) {
        this.input.on('pointerup', pointerUpHandler, this);
    }
}

function pointerUpHandler (pointer) {
    let velocityX = pointer.upX - pointer.downX;
    let velocityY = pointer.upY - pointer.downY;
    let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
    velocity.scale(1000);
    this.hero.isFlying = true;
    this.hero.enableBody(true, this.hero.x, this.hero.y, true, true);
    this.hero.body.setVelocity(velocity.x * 0.2, velocity.y * 1.45);
    this.hero.body.setAngularVelocity(500);
    this.hero.body.setAccelerationY((velocity.y * -1) * 0.75);
    // gfx.clear().strokeLineShape(line);
    this.input.off('pointerup');
}

function createBackground (game) {
    let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerWidth;
}

function createHeroProjectile (game, image) {
    let hero = game.physics.add.image(530, 1400, image);
    hero.setInteractive();
    hero.isFlying = false;
    hero.displayHeight = 150;
    hero.displayWidth = 150;
    hero.body.onWorldBounds = true;
    hero.body.setCollideWorldBounds(true);
    hero.setBounce(0.4);
    return hero;
}

function createPhysicsObjects (game) {
    let binOne = game.add.rectangle(295, 750, 170, 1);
    let binTwo = game.add.rectangle(635, 750, 170, 1);
    let floor = game.add.rectangle(window.innerWidth / 2, 975, window.innerWidth, 1);
    game.physics.add.existing(binOne);
    game.physics.add.existing(binTwo);
    game.physics.add.existing(floor);
    floor.body.setImmovable(true);

    // Add physical interactions
    game.physics.add.overlap(game.hero, binOne, hitTarget, null, game);
    game.physics.add.overlap(game.hero, binTwo, hitTarget, null, game);
    game.floorCollider = game.physics.add.collider(game.hero, floor, missedTarget, null, game);
    game.floorCollider.active = false;
}

function hitTarget (projectile) {
    console.log('function hitTarget called');
    if (projectile.body.velocity.y > 0) {
        resetProjectile(projectile);
        console.log(this);
        this.floorCollider.active = false;
    }
}

function missedTarget (projectile) {
    console.log('function missTarget called');
    setProjectileDrag(projectile);
    if (projectile.body.angularVelocity === 0) {
        resetProjectile(projectile);
        this.floorCollider.active = false;
    }
}

function resetProjectile (projectile) {
    projectile.disableBody(true, true);
    projectile.enableBody(true, 530, 1400, true, true);
    projectile.visible = true;
    projectile.isFlying = false;
    projectile.displayHeight = 150;
    projectile.displayWidth = 150;
    projectile.body.setAllowDrag(false);
}

function setProjectileDrag (projectile) {
    projectile.body.setAllowDrag(true);
    projectile.body.setDrag(20, 0);
    projectile.body.setAngularDrag(180);
}


