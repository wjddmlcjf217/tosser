// version 0.9
import game_objects from '../objects/game_objects.js'

// takes all database profile data to display on profile page
let displayName = null;
let object = null;

// constants
// lower to reduce overall wind effect
const WIND_SCALE = window.innerWidth * 0.05;
// raise to lower wind variance
const WIND_VARIANCE = 3;
// lower to increase y velocity
const VELOCITY_Y_SCALE = -1.3;
// raise to increase x velocity
const VELOCITY_X_SCALE = 0.3;
const GRAVITY = window.innerHeight * 1;

function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            displayName = user.displayName;
        } else {

        }
    }, function (error) {
        console.log(error);
    });
}

window.addEventListener('load', function () {
    initApp()
});

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    /**
     * Preload assets for Phaser Game
     */
    preload() {
    }

    /**
     * Initial Object Creation for Phaser Game
     */
    create() {
        this.createBackground(this);
        this.createLight(this);

        //Add Scoreboard
        this.scoreValue = 0;
        this.addScoreText(this);
        this.addObjectText(this);

        // wind setup
        this.windSetup(this);

        // Create Hero
        // Uses the game_object instead
        this.queue = Object.keys(game_objects);
        object = this.queue[Math.floor(Math.random() * 4)];
        this.spawnProjectile(this.createHeroProjectile(this, object));

        // Create Lives
        this.lives = this.add.group();
        for (let i = 0; i < 3; i++) {
            let life = this.lives.create(window.innerWidth * 0.193 - ((window.innerWidth * 0.076) * i), window.innerHeight * 0.028, 'life');
            life.displayWidth = window.innerWidth * 0.070;
            life.displayHeight = window.innerHeight * 0.039;
        }

        //Journal
        this.journalButton = this.add.image(window.innerWidth * 0.17, window.innerHeight * 0.99, 'book');
        this.journalButton.displayWidth = window.innerWidth * 0.15;
        this.journalButton.displayHeight = window.innerHeight * 0.075;
        this.journalButton.setInteractive();
        this.journalButton.setOrigin(1);
        this.journalButton.on('pointerdown', function() {
            this.createJournal();
            this.journalButton.visible = false;
            this.hero.visible = false;
        }, this);
    }

    /**
     * Called Every Frame for Phaser Game
     */
    update() {
        if (this.hero.body.velocity.y > 0 && this.floorCollider.active === false) {
            this.floorCollider.active = true;

            this.rimOneLeftCollider.active = true;
            this.rimOneRightCollider.active = true;

            this.rimTwoLeftCollider.active = true;
            this.rimTwoRightCollider.active = true;

            this.rimThreeLeftCollider.active = true;
            this.rimThreeRightCollider.active = true;

        }
    }

    /**
     * Handles Pointer Down Event
     */
    pointerDownHandler() {
        this.input.on('pointerup', this.pointerUpHandler, this);
    }

    /**
     * Handles Pointer up Event
     * @param pointer Phaser pointer
     */
    pointerUpHandler(pointer) {
        // calculate swipe angle
        let swipeX = pointer.upX - pointer.downX;
        let swipeY = pointer.upY - pointer.downY;
        let swipe = new Phaser.Math.Vector2(swipeX, swipeY).normalize();

        // calculate velocity
        let velocityY = window.innerHeight * VELOCITY_Y_SCALE;
        let velocityX = (swipe.x * window.innerWidth) * VELOCITY_X_SCALE;

        // validate swipe direction
        let angle = swipe.angle();
        if (angle > 3.41 && angle < 6.01) {
            this.hero.state = 'flying';
            this.hero.disableInteractive();

            // set projectile velocity
            this.hero.body.setVelocity(velocityX, velocityY);

            // set projectile gravity
            this.hero.body.setAccelerationY(GRAVITY);

            // todo: make projectile spin logarithmic
            let projectileSpin = (angle - 4.71) * 2000;
            this.hero.body.setAngularVelocity(projectileSpin);
            this.addProjectileScalingTween(this, this.hero);
            this.input.off('pointerup');

            if (this.hero.body.velocity.y > 0) {
                this.createShadow(this);
            }

            // set wind
            this.hero.setAccelerationX((this.windValue / WIND_VARIANCE) * WIND_SCALE);
        }

    }

    /**
     * casts a check mark animation upon scoring correctly
     */
    createGood() {
        this.good = this.add.image(window.innerWidth * .5, window.innerHeight * 0.3, 'good');
        this.good.displayHeight = window.innerHeight * 0.241;
        this.good.displayWidth = window.innerWidth * 0.429;
    }

    /**
     * casts a check mark animation upon scoring correctly
     */
    createBad() {
        this.bad = this.add.image(window.innerWidth * .5, window.innerHeight * 0.3, 'bad');
        this.bad.displayHeight = window.innerHeight * 0.241;
        this.bad.displayWidth = window.innerWidth * 0.429;
    }

    /**
     * casts a shadow under the hero projectile
     * @param scene Phaser Game
     */
    //in progress shadow effect
    createShadow(scene) {
        let shadow = scene.add.image(window.innerWidth * .3, window.innerHeight * 0.559, 'shadow');
        // shadow.tint = ;
        shadow.visible = true;
    }

    /**
     * Creates Background in scene
     * @param scene Phaser Game
     */
    createBackground(scene) {
        let background = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }

    /**
     * Create Light in scene
     * @param scene
     */
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
            this.scene.discoMode(this);
        });
    }

    /**
     * Disco mode in scene
     */
    discoMode() {
        this.discoTriangles = [];
        this.discoInterval = undefined;
        this.discoBall = this.add.image(window.innerWidth / 2, window.innerHeight * 0.11, 'discoball');
        this.discoBall.displayWidth = 150;
        this.discoBall.displayHeight = 150;
        this.discoBall.setInteractive();
        let discoBool = true;

        let discoColors = [0xFF00CB, 0xFFFF00, 0x00FFFF, 0xFF0000, 0xFFFF00, 0x53FF00, 0xFF00FF,
            0xFF00CB, 0x00FFFF, 0x00FFFF, 0xFF8700];

        for (let i = 0; i < discoColors.length; i++) {
            let triangle = this.add.triangle(
                window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight
            );
            triangle.setDepth(1000);
            triangle.setVisible(false);
            triangle.setFillStyle(discoColors[i], 100);
            triangle.setBlendMode('COLORDODGE');
            triangle.setRotation(i);
            this.discoTriangles.push(triangle);
        }

        let background = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
            window.innerWidth, window.innerHeight);
        background.setDepth(999);
        background.setVisible(false);
        background.setFillStyle(0x000000, 100);
        background.setBlendMode('MULTIPLY');

        this.discoBall.on('pointerdown', function () {
            let gameScene = window.game.scene.scenes[2];
            if (discoBool === true) {
                gameScene.sound.play('disco');
                gameScene.discoInterval = setInterval(function () {
                    for (let triangle of gameScene.discoTriangles) {
                        triangle.setRandomPosition();
                    }
                }, 500);
                discoBool = false;
            }
            else if (discoBool === false){
                gameScene.sound.stopAll('disco');
                clearInterval(gameScene.discoInterval);
                discoBool = true;
            }

            background.setVisible(!background.visible);
            for (let triangle of gameScene.discoTriangles) {
                triangle.setVisible(!triangle.visible);
            }
        });
    }

    /**
     * Creates the hero projectile
     * @param scene Phaser scene
     * @param image Phaser image key
     * @returns Hero image game object
     */
    createHeroProjectile(scene, image) {
        let hero = scene.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.89, image);
        hero.setInteractive();
        let aspect_ratio = hero.height / hero.width;
        hero.state = 'resting';
        hero.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[object]['scaling_factor'];
        hero.displayWidth = window.innerWidth * 0.165 * game_objects[object]['scaling_factor'];
        hero.setY(window.innerHeight * (1 - 0.07) - (hero.displayHeight * 0.5));
        hero.setBounce(.4);
        // hero.body.onWorldBounds = true;
        // hero.body.setCollideWorldBounds(true);
        hero.visible = false;
        return hero;
    }

    /**
     * Creates physics objects
     * @param scene Phaser Game
     */
    createPhysicsObjects(scene) {
        let binOne = scene.add.rectangle(window.innerWidth * 0.185, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimOneLeft = scene.add.rectangle(window.innerWidth * 0.11, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);//0.015
        let rimOneRight = scene.add.rectangle(window.innerWidth * 0.260, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25); //0.015

        let binTwo = scene.add.rectangle(window.innerWidth * 0.51775, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimTwoLeft = scene.add.rectangle(window.innerWidth * 0.44275, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);//0.015
        let rimTwoRight = scene.add.rectangle(window.innerWidth * 0.59275, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25); //0.015

        let binThree = scene.add.rectangle(window.innerWidth * 0.84725, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimThreeLeft = scene.add.rectangle(window.innerWidth * 0.77225, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);
        let rimThreeRight = scene.add.rectangle(window.innerWidth * 0.92225, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);

        let floor = scene.add.rectangle(window.innerWidth / 2, window.innerHeight * 0.57, window.innerWidth * 10, 50);

        scene.physics.add.existing(binOne, true);
        scene.physics.add.existing(binTwo, true);
        scene.physics.add.existing(binThree, true);

        scene.physics.add.existing(rimOneLeft, true);
        scene.physics.add.existing(rimOneRight, true);
        scene.physics.add.existing(rimTwoLeft, true);
        scene.physics.add.existing(rimTwoRight, true);
        scene.physics.add.existing(rimThreeLeft, true);
        scene.physics.add.existing(rimThreeRight, true);

        scene.physics.add.existing(floor, true);


        // Add physical interactions

        scene.floorCollider = scene.physics.add.collider(scene.hero, floor, this.missedTarget, null, scene);

        scene.rimOneLeftCollider = scene.physics.add.collider(scene.hero, rimOneLeft, this.hitRim, null, scene);
        scene.rimOneRightCollider = scene.physics.add.collider(scene.hero, rimOneRight, this.hitRim, null, scene);

        scene.rimTwoLeftCollider = scene.physics.add.collider(scene.hero, rimTwoLeft, this.hitRim, null, scene);
        scene.rimTwoRightCollider = scene.physics.add.collider(scene.hero, rimTwoRight, this.hitRim, null, scene);

        scene.rimThreeLeftCollider = scene.physics.add.collider(scene.hero, rimThreeLeft, this.hitRim, null, scene);
        scene.rimThreeRightCollider = scene.physics.add.collider(scene.hero, rimThreeRight, this.hitRim, null, scene);

        scene.physics.add.overlap(scene.hero, binOne, this.hitBlueBin, null, scene);
        scene.physics.add.overlap(scene.hero, binTwo, this.hitGreenBin, null, scene);
        scene.physics.add.overlap(scene.hero, binThree, this.hitYellowBin, null, scene);

        scene.physicsColliders = [scene.rimOneLeftCollider, scene.rimOneRightCollider, scene.rimTwoLeftCollider,
            scene.rimTwoRightCollider, scene.rimThreeLeftCollider, scene.rimThreeRightCollider, scene.floorCollider];

        scene.deactivateAll(scene.physicsColliders);
    }

    hitRim(projectile, rim) {
        projectile.setAccelerationX(0);
        this.setProjectileDrag(projectile);
        projectile.body.bounce.set(0.45);

        if (projectile.x > rim.x) {
            projectile.setVelocityX(Math.floor((Math.random() * 150) + 200));

            // projectile.body.gravity.set(150, 0);
        }
        else {
            projectile.setVelocityX(Math.floor((Math.random() * 150) + 200) * -1);
            // projectile.body.gravity.set(-150, 0);
        }

        if (projectile.body.angularVelocity === 0) {
            this.lifeHandler(this);
            // projectile.disableBody(false, false);
            this.resetProjectile(projectile);
            this.deactivateAll(this.physicsColliders);
        }
    }

    /**
     * Projectile Hit target handler
     * @param projectile
     */
    hitYellowBin(projectile) {
        if (projectile.body.velocity.y > 0) {
            projectile.disableBody(false, true);
            this.deactivateAll(this.physicsColliders);
            this.sound.play('hit-target');
            if (game_objects[object]['paper']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.scoreHandler(this);
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
                this.lifeHandler(this);
            }
            this.resetProjectile(projectile);
        }
    }

    hitBlueBin(projectile) {
        if (projectile.body.velocity.y > 0) {
            projectile.disableBody(false, true);
            this.deactivateAll(this.physicsColliders);
            this.sound.play('hit-target');
            if (game_objects[object]['container']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.scoreHandler(this);
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
                this.lifeHandler(this);
            }
            this.resetProjectile(projectile);
        }
    }

    hitGreenBin(projectile) {
        if (projectile.body.velocity.y > 0) {
            projectile.disableBody(false, true);
            this.deactivateAll(this.physicsColliders);
            this.sound.play('hit-target');
            if (game_objects[object]['organic']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.scoreHandler(this);
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
                this.lifeHandler(this);
            }
            this.resetProjectile(projectile);
        }
    }

    /**
     * Projectile missed target handler
     * @param projectile
     */
    missedTarget(projectile) {
        projectile.body.setAccelerationX(0);
        this.setProjectileDrag(projectile);
        let angularVelocity = projectile.body.angularVelocity;
        projectile.body.setAngularVelocity(angularVelocity * 0.5);
        projectile.body.velocityX -= 200;


        if (projectile.body.angularVelocity === 0) {
            this.createBad();
            this.fadeAndRecedeTween(this.bad);
            this.lifeHandler(this);
            projectile.disableBody(false, false);
            this.resetProjectile(projectile);
            this.deactivateAll(this.physicsColliders);

        }
    }

    /**
     * Spawns a new projectile
     * @param projectile
     */
    spawnProjectile(projectile) {
        let scene = projectile.scene;
        object = scene.queue[Math.floor(Math.random() * 4)];
        scene.objectText.setText(object);
        scene.hero = this.createHeroProjectile(scene, object);
        scene.hero.visible = true;
        scene.hero.setInteractive();
        scene.hero.on('pointerdown', this.pointerDownHandler, scene);

        this.createPhysicsObjects(scene);
        this.windUpdate();
    }

    /**
     * Reset projectile to original position
     * @param projectile
     */
    resetProjectile(projectile) {
        projectile.body.stop();
        projectile.scene.tweens.killTweensOf(projectile);
        this.spawnProjectile(projectile);
    }

    windUpdate() {
        // calculate wind
        let min = -5;
        let max = 5;
        let wind = Math.floor(Math.random() * (max - min + 1)) + min;
        this.windValue = wind;

        // set wind display text
        this.windValueDisplay.text = wind;

        // rotate arrow and position text
        if (wind < 0) {
            this.windArrow.rotation = 3.14;
        } else {
            this.windArrow.rotation = 0;
        }
    }

    windSetup() {
        // add arrow image
        this.windArrow = this.add.image(window.innerWidth / 2, window.innerHeight * 0.75, 'wind_arrow');
        this.windArrow.displayHeight = 100;
        this.windArrow.displayWidth = 150;

        // create font
        let fontStyle = {
            fontFamily: 'Kalam',
            fontSize: 40,
            color: '#FFFFFF'
        };

        // set initial wind
        this.windValue = 0;

        // add text to scene
        this.windValueDisplay = this.add.text(window.innerWidth / 2, window.innerHeight * 0.75 - 24, this.windValue, fontStyle);
    }

    /**
     * Applies drag to projectile
     * @param projectile
     */
    setProjectileDrag(projectile) {
        projectile.body.setAllowDrag(true);
        projectile.body.setDrag(100, 0);
        projectile.body.setAngularDrag(200);
    }

    /**
     * Scales the projectile over time
     * @param scene
     * @param projectile
     */
    addProjectileScalingTween(scene, projectile) {
        scene.tweens.add({
            targets: projectile,
            displayWidth: projectile.displayWidth / 5.5,
            displayHeight: projectile.displayHeight / 5.5,
            ease: 'Linear',
            duration: 1500,
            repeat: 0,
            yoyo: false
        });
    }

    fadeAndRecedeTween(image) {
        this.tweens.add({
            targets: image,
            alpha: 0,
            displayWidth: 50,
            displayHeight: 50,
            ease: 'Linear',
            duration: 1500,
            repeat: 0,
        });
    }

    /**
     * Reduce player lives
     * @param scene
     */
    lifeHandler(scene) {
        let life = scene.lives.getFirstAlive();
        if (life) {
            scene.lives.killAndHide(life);
        }

        if (scene.lives.countActive() < 1) {
            scene.hero.active = false;
            scene.staticScoreText.setVisible(false);
            scene.scoreText.setVisible(false);
            scene.gameOverText.setVisible(true);
            this.discoBall.removeInteractive();
            clearInterval(this.discoInterval);
            // Write score to leaderboard
            this.writeLeaderBoard();
            setTimeout(function () {
                scene.scene.start('LeaderBoard')
            }, 2000)
        }
    }

    /**
     * Increase player score
     * @param scene
     */
    scoreHandler(scene) {
        let score = scene.scoreValue += 1;
        scene.scoreText.setText(score);
    }

    /**
     * write to firebase with score ONLY if it's a higher score
     */
    // Write score
    writeLeaderBoard() {
        let first_name = displayName.split(' ')[0];
        if (this.scoreValue > leaderBoard[first_name] || leaderBoard[first_name] === undefined) {
            firebase.database().ref("users/").update({
                [first_name]: this.scoreValue
            });
        }
    }

    /**
     * Add score related text to the canvas
     */
    addScoreText(scene) {
        let fontStyle = {
            fontFamily: 'Kalam',
            fontSize: 70,
            color: '#84BCCE',
        };

        scene.gameOverText = scene.add.text(
            window.innerWidth * 0.285, window.innerHeight * 0.285, 'Game Over', fontStyle);
        scene.gameOverText.setVisible(false);
        scene.staticScoreText = scene.add.text(
            window.innerWidth * 0.31, window.innerHeight * 0.295, 'Score:', fontStyle);
        scene.scoreText = scene.add.text(
            window.innerWidth * 0.58, window.innerHeight * 0.295, scene.scoreValue, fontStyle);
        scene.scoreText.setOrigin(0.5, 0);
        scene.scoreText.setAlign('center');
    }

    addObjectText(scene) {
        scene.objectText = scene.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.97, null, LEADERBOARD_FONT);
        scene.objectText.setOrigin(0.5);
        scene.objectText.setFontSize(60);
    }

    createJournal() {
        this.journalContainer = this.add.container(0, 0);
        let bg = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5, 'journal').setOrigin(0.5);
        bg.displayWidth = window.innerWidth * 0.90;
        bg.displayHeight = window.innerHeight * 0.90;
        this.journalContainer.add(bg);
        let heading = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.15, "Did You Know?", JOURNAL_FONT).setOrigin(0.5);
        this.journalContainer.add(heading);
        this.createCloseButton();
        this.journalContainer.add(this.closeButton);
        let image = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.25, object).setOrigin(0.5);
        let aspect_ratio = image.height / image.width;
        image.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[object]['scaling_factor'];
        image.displayWidth = window.innerWidth * 0.165 * game_objects[object]['scaling_factor'];
        this.journalContainer.add(image);
        for (let i = 1; i <= 3; i++) {
            let fact = this.add.text(window.innerWidth * 0.5, window.innerHeight * (0.25 + i * (0.15)), game_objects[object]['fact_'+i], JOURNAL_FONT).setOrigin(0.5);
            fact.setFontSize(45);
            this.journalContainer.add(fact);
        }
    }

    createCloseButton() {
        this.closeButton = this.add.text(window.innerWidth * 0.90, window.innerHeight * 0.09, 'X', JOURNAL_FONT).setOrigin(0.5);
        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.journalContainer.destroy();
            this.journalButton.visible = true;
            this.hero.visible = true;
        })
    }

    deactivateAll (array) {
        for (let i = 0; i < array.length; i++) {
            array[i].active = false;
        }
    }
}