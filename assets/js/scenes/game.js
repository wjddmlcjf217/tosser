// version 0.9

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
        // image assets
        this.load.image('background', 'assets/img/study_area.png');
        this.load.image('bin_top', 'assets/img/bin_top.png');
        this.load.image('paper', 'assets/img/paper_ball.png');
        this.load.image('waterbottle', 'assets/img/water_bottle.png');
        this.load.image('banana', 'assets/img/banana-sprite.png');
        this.load.image('life', 'assets/img/life.gif');
        this.load.image('light_off', 'assets/img/light_off.png');
        this.load.image('light_on', 'assets/img/light_on.png');
        this.load.image('scoreboard', 'assets/img/scoreboard.png');
        this.load.image('plus1', 'assets/img/plus1.jpg');
        this.load.image('scoreboard', 'assets/img/scoreboard.png');
        this.load.image('discoball', 'assets/img/disco-ball.png');


        // audio assets
        this.load.audio('hit-target', [
            'assets/audio/bin-sound.m4a',
            'assets/audio/bin-sound.mp3',

        ]);

        // this.load.audio('disco', 'assets/audio/ymca.mp3')
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

        // Create Hero
        this.queue = ['paper', 'banana', 'waterbottle'];
        object = this.queue[Math.floor(Math.random() * 3)];
        this.hero = this.createHeroProjectile(this, object);
        this.objectText.setText(object);

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

    // game_objects = {
    //     'banana' : {
    //         'description': '',
    //         'bin': '',
    //         'path': 'assets/img/banana-sprite.png',
    //         'scaling_factor': ''
    //     },
    //     'apple' : {
    //         'description': '',
    //         'bin': '',
    //         'path': '',
    //         'scaling_factor': ''
    //     },
    //     'bread' : {
    //         'description': '',
    //         'bin': '',
    //         'path': '',
    //         'scaling_factor': ''
    //     },
    //     'paper' : {
    //         'description': '',
    //         'bin': '',
    //         'path': 'assets/img/paper_ball.png',
    //         'scaling_factor': ''
    //     },
    //     'cardboard' : {
    //         'description': '',
    //         'bin': '',
    //         'path': '',
    //         'scaling_factor': ''
    //     },
    //     'magazine' : {
    //         'description': '',
    //         'bin': '',
    //         'path': '',
    //         'scaling_factor': ''
    //     },
    //     'waterbottle' : {
    //         'description': '',
    //         'bin': '',
    //         'path': 'assets/img/paper_ball.png',
    //         'scaling_factor': ''
    //     },
    //     'popcan' : {
    //         'description': '',
    //         'bin': '',
    //         'path': '',
    //         'scaling_factor': ''
    //     },
    //     'jug' : {
    //         'description': '',
    //         'bin': '',
    //         'path': '',
    //         'scaling_factor': ''
    //     }
    // };

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
        let velocityX = pointer.upX - pointer.downX;
        let velocityY = pointer.upY - pointer.downY;
        let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
        velocity.scale(1000);

        console.log(velocity.angle());
        if (velocity.angle() > 3.5 && velocity.angle() < 5.8) {
            this.hero.state = 'flying';
            this.hero.disableInteractive();
            // this.hero.body.setVelocity(velocity.x * 0.75, velocity.y * 4);
            this.hero.body.setVelocity(velocity.x * window.innerWidth * 0.0008, velocity.y * window.innerHeight * 0.0022);

            this.hero.body.setAngularVelocity(400);
            this.hero.body.setAccelerationX(velocity.x * window.innerWidth * -0.00037001119); //-0.275
            this.hero.body.setAccelerationY(velocity.y * window.innerHeight * -0.00259);
            // this.hero.body.setAccelerationX(velocity.x * -0.275); //-0.275
            // this.hero.body.setAccelerationY(velocity.y * -4.4);
            this.addProjectileScalingTween(this, this.hero);
            // gfx.clear().strokeLineShape(line);
            this.input.off('pointerup');

            if (this.hero.body.velocity.y > 0) {
                this.createShadow(this);
            }
        }


    }

    /**
     * casts a plus 1 animation upon scoring correctly
     * @param N/A
     */
    //in progress shadow effect
    createPlus1() {
        this.plus1 = this.add.image(window.innerWidth * .5, window.innerHeight * 0.3, 'plus1');
        this.plus1.displayHeight = 420;
        this.plus1.displayWidth = 420;
    }

    /**
     * casts a shadow under the hero projectil
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
        let discoBall = scene.add.image(window.innerWidth / 2, window.innerHeight * 0.11, 'discoball');
        discoBall.displayWidth = 150;
        discoBall.displayHeight = 150;
        discoBall.setInteractive();
        let discoBool = true;

        let background = scene.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
            window.innerWidth, window.innerHeight);
        background.setDepth(1000);
        background.setVisible(false);
        background.setFillStyle(0x000000, 100);
        background.setBlendMode('MULTIPLY');

        let discoEffect = scene.add.triangle(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight);
        discoEffect.setDepth(1000);
        discoEffect.setVisible(false);
        discoEffect.setFillStyle(0xFFFF00, 100);
        discoEffect.setBlendMode('COLORDODGE');
        discoEffect.setRotation(1);

        let discoEffect2 = scene.add.triangle(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight);
        discoEffect2.setDepth(1000);
        discoEffect2.setVisible(false);
        discoEffect2.setFillStyle(0x00FF00, 100);
        discoEffect2.setBlendMode('COLORDODGE');
        discoEffect2.setRotation(3);


        let discoEffect3 = scene.add.triangle(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight);
        discoEffect3.setDepth(1000);
        discoEffect3.setVisible(false);
        discoEffect3.setFillStyle(0x00FFFF, 100);
        discoEffect3.setBlendMode('COLORDODGE');
        discoEffect3.setRotation(4);


        let discoEffect4 = scene.add.triangle(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight);
        discoEffect4.setDepth(1000);
        discoEffect4.setVisible(false);
        discoEffect4.setFillStyle(0xFF0000, 100);
        discoEffect4.setBlendMode('COLORDODGE');
        discoEffect4.setRotation(5);

        let discoEffect5 = scene.add.triangle(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight);
        discoEffect5.setDepth(1000);
        discoEffect5.setVisible(false);
        discoEffect5.setFillStyle(0x8B00FF, 100);
        discoEffect5.setBlendMode('COLORDODGE');
        discoEffect5.setRotation(6);


        let discoEffect6 = scene.add.triangle(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight);
        discoEffect6.setDepth(1000);
        discoEffect6.setVisible(false);
        discoEffect6.setFillStyle(0x53FF00, 100);
        discoEffect6.setBlendMode('COLORDODGE');
        discoEffect6.setRotation(7);


        let discoEffect7 = scene.add.triangle(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight);
        discoEffect7.setDepth(1000);
        discoEffect7.setVisible(false);
        discoEffect7.setFillStyle(0xFF00FF, 100);
        discoEffect7.setBlendMode('COLORDODGE');
        discoEffect7.setRotation(8);



        setInterval(function() {discoEffect.setRandomPosition();}, 500);
        setInterval(function() {discoEffect.setRandomPosition();}, 500);
        setInterval(function() {discoEffect2.setRandomPosition();}, 500);
        setInterval(function() {discoEffect3.setRandomPosition();}, 500);
        setInterval(function() {discoEffect4.setRandomPosition();}, 500);
        setInterval(function() {discoEffect5.setRandomPosition();}, 500);
        setInterval(function() {discoEffect6.setRandomPosition();}, 500);
        setInterval(function() {discoEffect7.setRandomPosition();}, 500);

        discoBall.on('pointerdown', function () {

            if (discoBool === true) {
                scene.sound.play('disco');
                discoBool = false;
            }
            else if (discoBool === false){
                scene.sound.stopAll('disco');
                // clearInterval(a);
                discoBool = true;
            }

            background.setVisible(!discoEffect.visible);
            discoEffect.setVisible(!discoEffect.visible);
            discoEffect2.setVisible(!discoEffect2.visible);
            discoEffect3.setVisible(!discoEffect3.visible);
            discoEffect4.setVisible(!discoEffect4.visible);
            discoEffect5.setVisible(!discoEffect5.visible);
            discoEffect6.setVisible(!discoEffect6.visible);
            discoEffect7.setVisible(!discoEffect7.visible);



        });

    }

    /**
     * Creates the hero projectile
     * @param game Phaser game
     * @param image Phaser image key
     * @returns Hero image game object
     */
    createHeroProjectile(game, image) {
        let hero = game.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.9, image);
        hero.setInteractive();
        hero.state = 'resting';
        hero.displayHeight = 150;
        hero.displayWidth = 150;
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
        let binOne = game.add.rectangle(window.innerWidth * 0.185, window.innerHeight * 0.450, window.innerWidth * 0.13, 10);
        let rimOneLeft = game.add.rectangle(window.innerWidth * 0.11, window.innerHeight * 0.44, window.innerWidth * 0.001, 5);//0.015
        let rimOneRight = game.add.rectangle(window.innerWidth * 0.260, window.innerHeight * 0.44, window.innerWidth * 0.001, 5); //0.015

        let binTwo = game.add.rectangle(window.innerWidth * 0.51775, window.innerHeight * 0.450, window.innerWidth * 0.13, 10);
        let rimTwoLeft = game.add.rectangle(window.innerWidth * 0.44275, window.innerHeight * 0.44, window.innerWidth * 0.001, 5);//0.015
        let rimTwoRight = game.add.rectangle(window.innerWidth * 0.59275, window.innerHeight * 0.44, window.innerWidth * 0.001, 5); //0.015

        let binThree = game.add.rectangle(window.innerWidth * 0.84725, window.innerHeight * 0.450, window.innerWidth * 0.13, 10);
        let rimThreeLeft = game.add.rectangle(window.innerWidth * 0.77225, window.innerHeight * 0.44, window.innerWidth * 0.001, 5);
        let rimThreeRight = game.add.rectangle(window.innerWidth * 0.92225, window.innerHeight * 0.44, window.innerWidth * 0.001, 5);

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
        game.physics.add.overlap(game.hero, binTwo, this.hitYellowBin, null, game);
        game.physics.add.overlap(game.hero, binThree, this.hitGreenBin, null, game);

        game.rimOneLeftCollider.active = false;
        game.rimOneRightCollider.active = false;
        game.rimTwoLeftCollider.active = false;
        game.rimTwoRightCollider.active = false;
        game.rimThreeLeftCollider.active = false;
        game.rimThreeRightCollider.active = false;
        game.floorCollider.active = false;
    }

    hitRim(projectile, rim) {
        this.setProjectileDrag(projectile);
        // projectile.setAccelerationX(0);
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
                this.createPlus1();
                this.addplus1Tween(this.plus1);
                this.scoreHandler(this);
            }
            else {
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
                this.createPlus1();
                this.addplus1Tween(this.plus1);
                this.scoreHandler(this);
            }
            else {
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
            if (object === "banana") {
                this.createPlus1();
                this.addplus1Tween(this.plus1);
                this.scoreHandler(this);
            }
            else {
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
        this.setProjectileDrag(projectile);
        projectile.setAccelerationX(0);

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
     * Spawns a new projectile
     * @param projectile
     */
    spawnProjectile(projectile) {
        let scene = projectile.scene;
        object = scene.queue[Math.floor(Math.random() * 3)];
        scene.objectText.setText(object);
        scene.hero = this.createHeroProjectile(scene, object);
        scene.hero.visible = true;
        scene.hero.setInteractive();
        scene.hero.on('pointerdown', this.pointerDownHandler, scene);

        this.createPhysicsObjects(scene)
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

    /**
     * Applies drag to projectile
     * @param projectile
     */
    setProjectileDrag(projectile) {
        projectile.body.setAllowDrag(true);
        projectile.body.setDrag(175, 0);
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
            displayWidth: 25,
            displayHeight: 25,
            ease: 'Linear',
            duration: 1500,
            repeat: 0,
            yoyo: false
        });
    }

    addplus1Tween(image) {
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
    // }

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