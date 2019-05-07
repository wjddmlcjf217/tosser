// version 0.2.2


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
    // image assets
    this.load.image('background', 'assets/img/study_area.png');
    this.load.image('bin_top', 'assets/img/bin_top.png');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
    // audio assets
    this.load.audio('hit-target', [
        'assets/audio/bin-sound.m4a',
        'assets/audio/bin-sound.mp3',
    ]);
    this.load.audio('hit-target', 'assets/audio/bin-sound.mp3');
    this.sound.add('hit-target', {loop: true})
    this.load.image('light_off', 'assets/img/light_off.png');
    this.load.image('light_on', 'assets/img/light_on.png');
}

function create() {
    createBackground(this);
    createLight(this);
    this.hero = createHeroProjectile(this, 'paper');
    this.hero.on('pointerdown', pointerDownHandler, this);
    createPhysicsObjects(this);
}

function update() {
    if (this.hero.body.velocity.y > 0 && this.floorCollider.active === false) {
        this.floorCollider.active = true;
    }
}

function pointerDownHandler () {
    this.input.on('pointerup', pointerUpHandler, this);
}

function pointerUpHandler (pointer) {
    let velocityX = pointer.upX - pointer.downX;
    let velocityY = pointer.upY - pointer.downY;
    let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
    velocity.scale(1000);
    this.hero.state = 'flying';
    this.hero.disableInteractive();
    this.hero.body.setVelocity(velocity.x * 0.2, velocity.y * 2.0);
    this.hero.body.setAngularVelocity(500);
    this.hero.body.setAccelerationY((velocity.y * -1) * 1.2);
    addProjectileScalingTween(this, this.hero);
    // gfx.clear().strokeLineShape(line);
    this.input.off('pointerup');
}

function createBackground (game) {
    let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerWidth;
}

function createLight (scene) {
    let light, darkenEffect;
    light = scene.add.image(window.innerWidth / 2, window.innerHeight * 0.027, 'light_on');
    light.setInteractive();
    darkenEffect = scene.add.rectangle(window.innerWidth / 2, window.innerHeight /2,
        window.innerWidth, window.innerHeight);
    darkenEffect.setDepth(1000);
    darkenEffect.setVisible(false);
    darkenEffect.setFillStyle(0x000000, 100);
    darkenEffect.setBlendMode('MULTIPLY');
    light.on('pointerdown', function () {
        this.setTexture(this.texture.key === 'light_on'? 'light_off' : 'light_on');
        darkenEffect.setVisible(!darkenEffect.visible);
    });
}

function createHeroProjectile (game, image) {
    let hero = game.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.9, image);
    hero.setInteractive();
    hero.state = 'resting';
    hero.displayHeight = 150;
    hero.displayWidth = 150;
    hero.setBounce(0.3);
    hero.body.onWorldBounds = true;
    hero.body.setCollideWorldBounds(true);
    return hero;
}

function createPhysicsObjects (game) {
    let binOne = game.add.rectangle(window.innerWidth * 0.295, window.innerHeight * 0.430, 170, 1);
    let binTwo = game.add.rectangle(window.innerWidth * 0.640, window.innerHeight * 0.430, 170, 1);
    let floor = game.add.rectangle(window.innerWidth / 2, window.innerHeight * 0.559, window.innerWidth, 1);
    game.physics.add.existing(binOne, true);
    game.physics.add.existing(binTwo, true);
    game.physics.add.existing(floor, true);

    // Add physical interactions
    game.physics.add.overlap(game.hero, binOne, hitTarget, null, game);
    game.physics.add.overlap(game.hero, binTwo, hitTarget, null, game);
    game.floorCollider = game.physics.add.collider(game.hero, floor, missedTarget, null, game);
    game.floorCollider.active = false;
}

function hitTarget (projectile) {
    if (projectile.body.velocity.y > 0) {
        resetProjectile(projectile);
        this.floorCollider.active = false;
        this.sound.play('hit-target');
    }
}

function missedTarget (projectile) {
    setProjectileDrag(projectile);
    if (projectile.body.angularVelocity === 0) {
        resetProjectile(projectile);
        this.floorCollider.active = false;
    }
}

function resetProjectile (projectile) {
    projectile.scene.tweens.killTweensOf(projectile);
    projectile.disableBody(true, true);
    projectile.enableBody(true, window.innerWidth / 2, window.innerHeight * 0.9, true, true);
    projectile.setInteractive();
    projectile.visible = true;
    projectile.state = 'resting';
    projectile.displayHeight = 150;
    projectile.displayWidth = 150;
    projectile.body.setAllowDrag(false);
}

function setProjectileDrag (projectile) {
    projectile.body.setAllowDrag(true);
    projectile.body.setDrag(20, 0);
    projectile.body.setAngularDrag(180);
}

function addProjectileScalingTween (game, projectile) {
    game.tweens.add({
        targets: projectile,
        displayWidth: 30,
        displayHeight: 30,
        ease: 'Linear',
        duration: 2500,
        repeat: 0,
        yoyo: false
    });
}
