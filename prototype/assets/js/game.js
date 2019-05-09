
// version 3.16.2


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

/**
 * Preload assets for Phaser Game
 */
function preload() {
    // image assets
    this.load.image('background', 'assets/img/study_area.png');
    this.load.image('bin_top', 'assets/img/bin_top.png');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
    this.load.image('life', 'assets/img/life.gif');
    this.load.image('light_off', 'assets/img/light_off.png');
    this.load.image('light_on', 'assets/img/light_on.png');

    // audio assets
    this.load.audio('hit-target', [
        'assets/audio/bin-sound.m4a',
        'assets/audio/bin-sound.mp3',
    ]);
}

/**
 * Initial Object Creation for Phaser Game
 */
function create() {
    // Create Background
    createBackground(this);

    // Create Light
    createLight(this);

    // Create Score
    this.scoreValue = 0;
    this.scoreText = this.add.text(window.innerWidth * 0.32, window.innerHeight * 0.28, 'Score: ' + this.scoreValue, {fontStyle: 'Bolder', fontSize: 69, color: 'black'});

    // Create Hero
    this.hero = createHeroProjectile(this, 'paper');

    this.queue = ['paper', 'banana', 'waterbottle'];

    this.hero = createProjectile(this, this.queue[Math.floor(Math.random() * 3)]);
    this.hero.visible = true;
    this.hero.setInteractive();
    this.hero.on('pointerdown', pointerDownHandler, this);
    createPhysicsObjects(this);

    // Create Lives
    this.lives = this.add.group();
    for (let i = 0; i < 3; i++) {
        let life = this.lives.create(window.innerWidth * 0.193 - ((window.innerWidth * 0.076) * i), window.innerHeight * 0.028, 'life');
        life.displayWidth = window.innerWidth * 0.070;
        life.displayHeight = window.innerHeight * 0.039;
    }
}

/**
 * Called Every Frame for Phaser Game
 */
function update() {
    // Activate floor collider
    if (this.hero.body.velocity.y > 0 && this.floorCollider.active === false) {
        this.floorCollider.active = true;
    }

    // console.log(this.hero.body.velocity.y)
}

/**
 * Handles Pointer Down Event
 */
function pointerDownHandler () {
    this.input.on('pointerup', pointerUpHandler, this);
}

/**
 * Handles Pointer up Event
 * @param pointer Phaser pointer
 */
function pointerUpHandler (pointer) {
    let velocityX = pointer.upX - pointer.downX;
    let velocityY = pointer.upY - pointer.downY;
    let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
    velocity.scale(1000);

    console.log(velocity.angle());
    if (velocity.angle() > 3.5 && velocity.angle() < 5.8){
        this.hero.state = 'flying';
        this.hero.disableInteractive();
        this.hero.body.setVelocity(velocity.x * 0.2, velocity.y * 2.0);
        this.hero.body.setAngularVelocity(500);
        this.hero.body.setAccelerationY((velocity.y * -1) * 1.2);
        addProjectileScalingTween(this, this.hero);
        // gfx.clear().strokeLineShape(line);
        this.input.off('pointerup');

        if (this.hero.body.velocity.y > 0){
            createShadow(this);
        }
    }



}

function createShadow(game) {
    let shadow = game.add.image(window.innerWidth * .3, window.innerHeight * 0.559, 'shadow');
    // shadow.tint = ;
    shadow.visible = true;
}

/**
 * Creates Background in scene
 * @param game Phaser Game
 */
function createBackground (game) {
    let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerWidth;
}

/**
 * Create Light in scene
 * @param scene
 */
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

/**
 * Creates the hero projectile
 * @param game Phaser game
 * @param image Phaser image key
 * @returns Hero image game object
 */
function createHeroProjectile (game, image) {
    let hero = game.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.9, image);
    hero.setInteractive();
    hero.state = 'resting';
    hero.displayHeight = 150;
    hero.displayWidth = 150;
    hero.setBounce(0.3);
    hero.body.onWorldBounds = true;
    hero.body.setCollideWorldBounds(true);
    hero.visible = false;
    return hero;
}
/**
 * Creates physics objects
 * @param game Phaser Game
 */
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

/**
 * Projectile Hit target handler
 * @param projectile
 */
function hitTarget (projectile) {
    if (projectile.body.velocity.y > 0) {
        projectile.disableBody(false, true);
        resetProjectile(projectile);
        scoreHandler(this);
        this.floorCollider.active = false;
        this.sound.play('hit-target');
    }
}

/**
 * Projectile missed target handler
 * @param projectile
 */
function missedTarget (projectile) {
    setProjectileDrag(projectile);
    if (projectile.body.angularVelocity === 0) {
        lifeHandler(this);
        projectile.disableBody(false, false);
        resetProjectile(projectile);
        this.floorCollider.active = false;
    }
}

function spawnProjectile(projectile) {
    let scene = projectile.scene;

    scene.hero = createProjectile(scene, scene.queue[Math.floor(Math.random() * 3)]);

    scene.hero.visible = true;
    scene.hero.setInteractive();
    scene.hero.on('pointerdown', pointerDownHandler, scene);

    createPhysicsObjects(scene)
}

/**
 * Reset projectile to original position
 * @param projectile
 */
function resetProjectile(projectile) {
    projectile.body.stop();
    console.log(projectile);
    projectile.scene.tweens.killTweensOf(projectile);
    spawnProjectile(projectile);

}

/**
 * Applies drag to projectile
 * @param projectile
 */
function setProjectileDrag (projectile) {
    projectile.body.setAllowDrag(true);
    projectile.body.setDrag(20, 0);
    projectile.body.setAngularDrag(180);
}

/**
 * Scales the projectile over time
 * @param game
 * @param projectile
 */
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

/**
 * Reduce player lives
 * @param scene
 */
function lifeHandler (scene) {
    let life = scene.lives.getFirstAlive();
    if (life) {
        scene.lives.killAndHide(life);
    }

    if (scene.lives.countActive() < 1) {
        console.log('game over');
    }
}

/**
 * Increase player score
 * @param scene
 */
function scoreHandler (scene) {
    let score = scene.scoreValue += 1;
    scene.scoreText.setText('Score: ' + score)
}

function turnLightsOff(game) {
    let lightsOff = game.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
        window.innerWidth, window.innerHeight);
    lightsOff.setFillStyle(0x202030, 100);
    lightsOff.setBlendMode('MULTIPLY');
}