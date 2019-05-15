// version 0.9
import game_objects from '../objects/game_objects.js'

// takes all database profile data to display on profile page
let displayName = null;
let object = null;


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
        this.discoMode(this);

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
        let velocityX = pointer.upX - pointer.downX;
        let velocityY = pointer.upY - pointer.downY;
        let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();

        // calculate velocity
        velocity.set(velocity.x * (1000), velocity.y * 1000);

        // validate swipe direction
        let angle = velocity.angle();
        if (angle > 3.41 && angle < 6.01) {
            this.hero.state = 'flying';
            this.hero.disableInteractive();
            this.hero.body.setVelocity(velocity.x * window.innerWidth * 0.0008, velocity.y * window.innerHeight * 0.0022);

            let projectileSpin = (angle - 4.71) * 2000;
            this.hero.body.setAngularVelocity(projectileSpin);
            this.hero.body.setAccelerationY(velocity.y * window.innerHeight * -0.00259);
            this.addProjectileScalingTween(this, this.hero);
            this.input.off('pointerup');

            if (this.hero.body.velocity.y > 0) {
                this.createShadow(this);
            }
        }

        this.hero.setAccelerationX(this.windValue * 75);
    }

    /**
     * casts a check mark animation upon scoring correctly
     * @param N/A
     */
    createGood() {
        this.good = this.add.image(window.innerWidth * .5, window.innerHeight * 0.3, 'good');
        this.good.displayHeight = window.innerHeight * 0.241;
        this.good.displayWidth = window.innerWidth * 0.429;
    }

    /**
     * casts a check mark animation upon scoring correctly
     * @param N/A
     */
    createBad() {
        this.bad = this.add.image(window.innerWidth * .5, window.innerHeight * 0.3, 'bad');
        this.bad.displayHeight = window.innerHeight * 0.241;
        this.bad.displayWidth = window.innerWidth * 0.429;
    }

    /**
     * casts a shadow under the hero projectile
     * @param game Phaser Game
     */
    //in progress shadow effect
    createShadow(game) {
        let shadow = game.add.image(window.innerWidth * .3, window.innerHeight * 0.559, 'shadow');
        // shadow.tint = ;
        shadow.visible = true;
    }

    /**
     * Creates Background in scene
     * @param game Phaser Game
     */
    createBackground(game) {
        let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
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

        });
    }

    /**
     * Disco mode in scene
     * @param scene
     */
    discoMode(scene) {
        scene.discoTriangles = [];
        scene.discoInterval = undefined;
        scene.discoBall = scene.add.image(window.innerWidth / 2, window.innerHeight * 0.11, 'discoball');
        scene.discoBall.displayWidth = 150;
        scene.discoBall.displayHeight = 150;
        scene.discoBall.setInteractive();
        let discoBool = true;

        let discoColors = [0xFF00CB, 0xFFFF00, 0x00FFFF, 0xFF0000, 0xFFFF00, 0x53FF00, 0xFF00FF,
            0xFF00CB, 0x00FFFF, 0x00FFFF, 0xFF8700];

        for (let i = 0; i < discoColors.length; i++) {
            let triangle = scene.add.triangle(
                window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight
            );
            triangle.setDepth(1000);
            triangle.setVisible(false);
            triangle.setFillStyle(discoColors[i], 100);
            triangle.setBlendMode('COLORDODGE');
            triangle.setRotation(i);
            scene.discoTriangles.push(triangle);
        }

        let background = scene.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
            window.innerWidth, window.innerHeight);
        background.setDepth(999);
        background.setVisible(false);
        background.setFillStyle(0x000000, 100);
        background.setBlendMode('MULTIPLY');

        scene.discoBall.on('pointerdown', function () {

            if (discoBool === true) {
                // scene.sound.play('disco');
                scene.discoInterval = setInterval(function () {
                    for (let triangle of scene.discoTriangles) {
                        triangle.setRandomPosition();
                    }
                }, 500);
                discoBool = false;
            }
            else if (discoBool === false){
                // scene.sound.stopAll('disco');
                clearInterval(scene.discoInterval);
                discoBool = true;
            }

            background.setVisible(!background.visible);
            for (let triangle of scene.discoTriangles) {
                triangle.setVisible(!triangle.visible);
            }
        });
    }

    /**
     * Creates the hero projectile
     * @param game Phaser game
     * @param image Phaser image key
     * @returns Hero image game object
     */
    createHeroProjectile(game, image) {
        let hero = game.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.89, image);
        hero.setInteractive();
        let aspect_ratio = hero.height / hero.width;
        hero.state = 'resting';
        hero.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[object]['scaling_factor'];
        hero.displayWidth = window.innerWidth * 0.165 * game_objects[object]['scaling_factor'];
        hero.setY(hero.y - (hero.displayHeight - (window.innerWidth * 0.165)) * 0.5);
        hero.setBounce(.4);
        // hero.body.onWorldBounds = true;
        // hero.body.setCollideWorldBounds(true);
        hero.visible = false;
        return hero;
    }

    /**
     * Creates physics objects
     * @param game Phaser Game
     */
    createPhysicsObjects(game) {
        let binOne = game.add.rectangle(window.innerWidth * 0.185, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimOneLeft = game.add.rectangle(window.innerWidth * 0.11, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);//0.015
        let rimOneRight = game.add.rectangle(window.innerWidth * 0.260, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25); //0.015

        let binTwo = game.add.rectangle(window.innerWidth * 0.51775, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimTwoLeft = game.add.rectangle(window.innerWidth * 0.44275, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);//0.015
        let rimTwoRight = game.add.rectangle(window.innerWidth * 0.59275, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25); //0.015

        let binThree = game.add.rectangle(window.innerWidth * 0.84725, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimThreeLeft = game.add.rectangle(window.innerWidth * 0.77225, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);
        let rimThreeRight = game.add.rectangle(window.innerWidth * 0.92225, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);

        let floor = game.add.rectangle(window.innerWidth / 2, window.innerHeight * 0.57, window.innerWidth * 10, 50);

        game.physics.add.existing(binOne, true);
        game.physics.add.existing(binTwo, true);
        game.physics.add.existing(binThree, true);

        game.physics.add.existing(rimOneLeft, true);
        game.physics.add.existing(rimOneRight, true);
        game.physics.add.existing(rimTwoLeft, true);
        game.physics.add.existing(rimTwoRight, true);
        game.physics.add.existing(rimThreeLeft, true);
        game.physics.add.existing(rimThreeRight, true);

        game.physics.add.existing(floor, true);


        // Add physical interactions

        game.floorCollider = game.physics.add.collider(game.hero, floor, this.missedTarget, null, game);


        game.rimOneLeftCollider = game.physics.add.collider(game.hero, rimOneLeft, this.hitRim, null, game);
        game.rimOneRightCollider = game.physics.add.collider(game.hero, rimOneRight, this.hitRim, null, game);

        game.rimTwoLeftCollider = game.physics.add.collider(game.hero, rimTwoLeft, this.hitRim, null, game);
        game.rimTwoRightCollider = game.physics.add.collider(game.hero, rimTwoRight, this.hitRim, null, game);

        game.rimThreeLeftCollider = game.physics.add.collider(game.hero, rimThreeLeft, this.hitRim, null, game);
        game.rimThreeRightCollider = game.physics.add.collider(game.hero, rimThreeRight, this.hitRim, null, game);

        game.physics.add.overlap(game.hero, binOne, this.hitBlueBin, null, game);
        game.physics.add.overlap(game.hero, binTwo, this.hitGreenBin, null, game);
        game.physics.add.overlap(game.hero, binThree, this.hitYellowBin, null, game);



        game.rimOneLeftCollider.active = false;
        game.rimOneRightCollider.active = false;
        game.rimTwoLeftCollider.active = false;
        game.rimTwoRightCollider.active = false;
        game.rimThreeLeftCollider.active = false;
        game.rimThreeRightCollider.active = false;
        game.floorCollider.active = false;
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
            projectile.disableBody(false, false);
            this.resetProjectile(projectile);
            this.floorCollider.active = false;
            this.rimOneRightCollider.active = false;
            this.rimOneLeftCollider.active = false;
            this.rimTwoRightCollider.active = false;
            this.rimTwoLeftCollider.active = false;
            this.rimThreeRightCollider.active = false;
            this.rimThreeLeftCollider.active = false;
        }
    }

    /**
     * Projectile Hit target handler
     * @param projectile
     */
    hitYellowBin(projectile) {
        if (projectile.body.velocity.y > 0) {
            projectile.disableBody(false, true);
            this.floorCollider.active = false;
            this.rimOneRightCollider.active = false;
            this.rimOneLeftCollider.active = false;
            this.rimTwoRightCollider.active = false;
            this.rimTwoLeftCollider.active = false;
            this.rimThreeRightCollider.active = false;
            this.rimThreeLeftCollider.active = false;
            this.sound.play('hit-target');
            if (object === "paper") {
                this.createGood();
                this.addGoodTween(this.good);
                this.scoreHandler(this);
            }
            else {
                this.createBad();
                this.addBadTween(this.bad);
                this.lifeHandler(this);
            }
            this.resetProjectile(projectile);
        }
    }

    hitBlueBin(projectile) {
        if (projectile.body.velocity.y > 0) {
            projectile.disableBody(false, true);
            this.floorCollider.active = false;
            this.rimOneRightCollider.active = false;
            this.rimOneLeftCollider.active = false;
            this.rimTwoRightCollider.active = false;
            this.rimTwoLeftCollider.active = false;
            this.rimThreeRightCollider.active = false;
            this.rimThreeLeftCollider.active = false;
            this.sound.play('hit-target');
            if (object === "waterbottle") {
                this.createGood();
                this.addGoodTween(this.good);
                this.scoreHandler(this);
            }
            else {
                this.createBad();
                this.addBadTween(this.bad);
                this.lifeHandler(this);
            }
            this.resetProjectile(projectile);
        }
    }

    hitGreenBin(projectile) {
        if (projectile.body.velocity.y > 0) {
            projectile.disableBody(false, true);
            this.floorCollider.active = false;
            this.rimOneRightCollider.active = false;
            this.rimOneLeftCollider.active = false;
            this.rimTwoRightCollider.active = false;
            this.rimTwoLeftCollider.active = false;
            this.rimThreeRightCollider.active = false;
            this.rimThreeLeftCollider.active = false;
            this.sound.play('hit-target');
            if (object === "banana" || object === 'apple') {
                this.createGood();
                this.addGoodTween(this.good);
                this.scoreHandler(this);
            }
            else {
                this.createBad();
                this.addBadTween(this.bad);
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
            this.addBadTween(this.bad);
            this.lifeHandler(this);
            projectile.disableBody(false, false);
            this.resetProjectile(projectile);
            this.floorCollider.active = false;
            this.rimOneRightCollider.active = false;
            this.rimOneLeftCollider.active = false;
            this.rimTwoRightCollider.active = false;
            this.rimTwoLeftCollider.active = false;
            this.rimThreeRightCollider.active = false;
            this.rimThreeLeftCollider.active = false;

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
        console.log(projectile);
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
     * @param game
     * @param projectile
     */
    addProjectileScalingTween(game, projectile) {
        game.tweens.add({
            targets: projectile,
            displayWidth: projectile.displayWidth / 6,
            displayHeight: projectile.displayHeight / 6,
            ease: 'Linear',
            duration: 1500,
            repeat: 0,
            yoyo: false
        });
    }

    addGoodTween(image) {
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

    addBadTween(image) {
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
        if (this.scoreValue > leaderBoard[first_name]) {
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
}