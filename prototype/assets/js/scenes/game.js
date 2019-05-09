// version 0.2.2
import Button from '../objects/button.js'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        // image assets
        this.load.image('background', 'assets/img/study_area.png');
        this.load.image('bin_top', 'assets/img/bin_top.png');
        this.load.image('paper', 'assets/img/paper_ball.png');
        this.load.image('waterbottle', 'assets/img/water_bottle.png');
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

    create() {
        this.createBackground(this);
        this.createLight(this);

        // Create Score
        this.scoreValue = 0;
        this.scoreText = this.add.text(window.innerWidth * 0.32, window.innerHeight * 0.28, 'Score: ' + this.scoreValue, {
            fontStyle: 'Bolder',
            fontSize: 69,
            color: 'black'
        });

        // Create Hero
        this.hero = this.createHeroProjectile(this, 'paper');

        this.queue = ['paper', 'banana', 'waterbottle'];

        this.hero = this.createHeroProjectile(this, this.queue[Math.floor(Math.random() * 3)]);
        this.hero.visible = true;
        this.hero.setInteractive();
        this.hero.on('pointerdown', this.pointerDownHandler, this);
        this.createPhysicsObjects(this);

        // Create Lives
        this.lives = this.add.group();
        for (let i = 0; i < 3; i++) {
            let life = this.lives.create(window.innerWidth * 0.193 - ((window.innerWidth * 0.076) * i), window.innerHeight * 0.028, 'life');
            life.displayWidth = window.innerWidth * 0.070;
            life.displayHeight = window.innerHeight * 0.039;
        }
    }

    update() {
        if (this.hero.body.velocity.y > 0 && this.floorCollider.active === false) {
            this.floorCollider.active = true;
        }
    }

    pointerDownHandler() {
        this.input.on('pointerup', this.pointerUpHandler, this);
    }

    pointerUpHandler(pointer) {
        let velocityX = pointer.upX - pointer.downX;
        let velocityY = pointer.upY - pointer.downY;
        let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
        velocity.scale(1000);

        console.log(velocity.angle());
        if (velocity.angle() > 3.5 && velocity.angle() < 5.8) {
            this.hero.state = 'flying';
            this.hero.disableInteractive();
            this.hero.body.setVelocity(velocity.x * 0.2, velocity.y * 2.0);
            this.hero.body.setAngularVelocity(500);
            this.hero.body.setAccelerationY((velocity.y * -1) * 1.2);
            this.addProjectileScalingTween(this, this.hero);
            // gfx.clear().strokeLineShape(line);
            this.input.off('pointerup');

            if (this.hero.body.velocity.y > 0) {
                this.createShadow(this);
            }
        }


    }

    //in progress shadow effect
    createShadow(game) {
        let shadow = game.add.image(window.innerWidth * .3, window.innerHeight * 0.559, 'shadow');
        // shadow.tint = ;
        shadow.visible = true;
    }

    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }


    createLight(scene) {
        let light, darkenEffect;
        light = scene.add.image(window.innerWidth / 2, window.innerHeight * 0.027, 'light_on');
        light.setInteractive();
        darkenEffect = scene.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
            window.innerWidth, window.innerHeight);
        darkenEffect.setDepth(1000);
        darkenEffect.setVisible(false);
        darkenEffect.setFillStyle(0x000000, 100);
        darkenEffect.setBlendMode('MULTIPLY');
        light.on('pointerdown', function () {
            this.setTexture(this.texture.key === 'light_on' ? 'light_off' : 'light_on');
            darkenEffect.setVisible(!darkenEffect.visible);
        });
    }


    createHeroProjectile(game, image) {
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


    createPhysicsObjects(game) {
        let binOne = game.add.rectangle(window.innerWidth * 0.295, window.innerHeight * 0.430, 170, 1);
        let binTwo = game.add.rectangle(window.innerWidth * 0.640, window.innerHeight * 0.430, 170, 1);
        let floor = game.add.rectangle(window.innerWidth / 2, window.innerHeight * 0.559, window.innerWidth, 1);
        game.physics.add.existing(binOne, true);
        game.physics.add.existing(binTwo, true);
        game.physics.add.existing(floor, true);

        // Add physical interactions
        game.physics.add.overlap(game.hero, binOne, this.hitTarget, null, game);
        game.physics.add.overlap(game.hero, binTwo, this.hitTarget, null, game);
        game.floorCollider = game.physics.add.collider(game.hero, floor, this.missedTarget, null, game);
        game.floorCollider.active = false;
    }


    hitTarget(projectile) {
        if (projectile.body.velocity.y > 0) {
            projectile.disableBody(false, true);
            this.resetProjectile(projectile);
            this.scoreHandler(this);
            this.floorCollider.active = false;
            this.sound.play('hit-target');
        }
    }


    missedTarget(projectile) {
        this.setProjectileDrag(projectile);
        if (projectile.body.angularVelocity === 0) {
            this.lifeHandler(this);
            projectile.disableBody(false, false);
            this.resetProjectile(projectile);
            this.floorCollider.active = false;
        }
    }

    spawnProjectile(projectile) {
        let scene = projectile.scene;

        scene.hero = this.createHeroProjectile(scene, scene.queue[Math.floor(Math.random() * 3)]);

        scene.hero.visible = true;
        scene.hero.setInteractive();
        scene.hero.on('pointerdown', this.pointerDownHandler, scene);

        this.createPhysicsObjects(scene)
    }

    resetProjectile(projectile) {
        projectile.body.stop();
        console.log(projectile);
        projectile.scene.tweens.killTweensOf(projectile);
        this.spawnProjectile(projectile);
    }


    setProjectileDrag(projectile) {
        projectile.body.setAllowDrag(true);
        projectile.body.setDrag(20, 0);
        projectile.body.setAngularDrag(180);
    }


    addProjectileScalingTween(game, projectile) {
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


    lifeHandler(scene) {
        let life = scene.lives.getFirstAlive();
        if (life) {
            scene.lives.killAndHide(life);
        }

        if (scene.lives.countActive() < 1) {
            scene.scoreText.setText('Game Over');
            setTimeout(function() {scene.scene.start('LeaderBoard')}, 2000)
        }
    }


    scoreHandler(scene) {
        let score = scene.scoreValue += 1;
        scene.scoreText.setText('Score: ' + score)
    }
}