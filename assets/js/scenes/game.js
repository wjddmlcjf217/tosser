// version 0.9
import game_objects from '../objects/game_objects.js'


// constants
const WIND_SCALE = window.innerWidth * 0.05;
// raise to lower wind variance
const WIND_VARIANCE = 3;
// lower to increase y velocity
const VELOCITY_Y_SCALE = -1.3;
// raise to increase x velocity
const VELOCITY_X_SCALE = 0.32;
// modify gravity
const GRAVITY = window.innerHeight * 1;

export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.displayName = null;
        this.object = null;
    }

    /**
     * Initial Object Creation for Phaser Game
     */
    create() {
        // background setup
        this.createBackground();
        this.createLight();
        this.discoMode();

        //Add Scoreboard
        this.scoreValue = 0;
        this.addScoreText(this);
        this.addObjectText();

        // wind setup
        this.windSetup(this);

        // Create Hero
        this.queue = Object.keys(game_objects);
        this.object = this.queue[Math.floor(Math.random() * this.queue.length)];
        this.spawnProjectile(this.createHeroProjectile(this.object));

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

        // create option button
        this.optionButton = this.add.image(window.innerWidth * 0.945, window.innerHeight * 0.035, 'option');
        this.optionButton.displayWidth = window.innerWidth * 0.10;
        this.optionButton.displayHeight = window.innerHeight * 0.056;
        this.optionButton.setInteractive();
        this.optionButton.on('pointerdown', function() {
            this.createOptions();
            this.optionButton.visible = false;
            this.hero.visible = false;
            this.journalButton.visible = false;
        }, this);

        // create journal button
        this.journalButton.on('pointerdown', function() {
            this.createJournal();
            this.optionButton.visible = false;
            this.journalButton.visible = false;
            this.hero.visible = false;
        }, this);
    }

    /**
     * Called Every Frame for Phaser Game
     */
    update() {
        // if projectile moving downwards and floor collider is dissabled
        if (this.hero.body.velocity.y > 0 && this.floorCollider.active === false) {
            // set floor collider to active
            this.floorCollider.active = true;

            // set rim collider to active
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

            // set projectile spin
            let projectileSpin = (angle - 4.71) * 2000;
            this.hero.body.setAngularVelocity(projectileSpin);
            this.addProjectileScalingTween(this.hero);
            this.input.off('pointerup');

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
     * Creates Background in scene
     */
    createBackground() {
        let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }

    /**
     * Create Light in scene
     */
    createLight() {
        let light, darkenEffect;
        // add light to scene
        light = this.add.image(window.innerWidth / 2, window.innerHeight * 0.027, 'light_on');
        // making the light clickable
        light.setInteractive();

        // creating darken effect
        darkenEffect = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
            window.innerWidth, window.innerHeight);
        darkenEffect.setDepth(1000);
        darkenEffect.setVisible(false);
        darkenEffect.setFillStyle(0x000000, 100);
        darkenEffect.setBlendMode('MULTIPLY');

        // handle clicking on light
        light.on('pointerdown', function () {
            this.setTexture(this.texture.key === 'light_on' ? 'light_off' : 'light_on');
            darkenEffect.setVisible(!darkenEffect.visible);
            this.scene.discoBall.visible = true;
        });
    }

    /**
     * Disco mode in scene
     */
    discoMode() {
        // array to hold light triangles
        this.discoTriangles = [];
        this.discoInterval = null;
        // add disco ball to scene
        this.discoBall = this.add.image(window.innerWidth / 2, window.innerHeight * 0.11, 'discoball');
        this.discoBall.displayWidth = 150;
        this.discoBall.displayHeight = 150;
        this.discoBall.setInteractive();
        this.discoBall.visible = false;
        let discoBool = true;

        // set disco ray colors
        let discoColors = [0xFF00CB, 0xFFFF00, 0x00FFFF, 0xFF0000, 0xFFFF00, 0x53FF00, 0xFF00FF,
            0xFF00CB, 0x00FFFF, 0x00FFFF, 0xFF8700];

        // add disco triangles to array
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

        // create darken effect
        let background = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
            window.innerWidth, window.innerHeight);
        background.setDepth(999);
        background.setVisible(false);
        background.setFillStyle(0x000000, 100);
        background.setBlendMode('MULTIPLY');

        // handle clicking on discoball
        this.discoBall.on('pointerdown', function () {
            // if diso is playing
            if (discoBool === true) {
                // play music
                this.discoMusic = this.sound.play('disco');
                let thisScene = this;
                // change disco rays
                this.discoInterval = setInterval(function () {
                    for (let triangle of thisScene.discoTriangles) {
                        triangle.setRandomPosition();
                    }
                }, 500, thisScene);
                discoBool = false;
            } else if (discoBool === false){
                this.sound.stopAll('disco');
                clearInterval(this.discoInterval);
                discoBool = true;
            }

            // toggling triangle visibility
            background.setVisible(!background.visible);
            for (let triangle of this.discoTriangles) {
                triangle.setVisible(!triangle.visible);
            }
        }, this);
    }

    /**
     * Creates the hero projectile
     * @param image Phaser image key
     * @returns Hero image game object
     */
    createHeroProjectile(image) {
        // add herop to scnene
        let hero = this.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.89, image);
        hero.setInteractive();
        let aspect_ratio = hero.height / hero.width;
        hero.state = 'resting';
        // display settings
        hero.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[this.object]['scaling_factor'];
        hero.displayWidth = window.innerWidth * 0.165 * game_objects[this.object]['scaling_factor'];
        hero.setY(window.innerHeight * (1 - 0.07) - (hero.displayHeight * 0.5));
        hero.setBounce(.4);
        // set non-visible
        hero.visible = false;
        return hero;
    }

    /**
     * Creates physics objects
     */
    createPhysicsObjects() {
        // add bin one rectangle
        let binOne = this.add.rectangle(window.innerWidth * 0.185, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimOneLeft = this.add.rectangle(window.innerWidth * 0.11, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);//0.015
        let rimOneRight = this.add.rectangle(window.innerWidth * 0.260, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25); //0.015

        // add bin two rectangle
        let binTwo = this.add.rectangle(window.innerWidth * 0.51775, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimTwoLeft = this.add.rectangle(window.innerWidth * 0.44275, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);//0.015
        let rimTwoRight = this.add.rectangle(window.innerWidth * 0.59275, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25); //0.015

        // add bin three rectangle
        let binThree = this.add.rectangle(window.innerWidth * 0.84725, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimThreeLeft = this.add.rectangle(window.innerWidth * 0.77225, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);
        let rimThreeRight = this.add.rectangle(window.innerWidth * 0.92225, (window.innerHeight * 0.44) + 10, window.innerWidth * 0.001, 25);

        // add floor rectangle
        let floor = this.add.rectangle(window.innerWidth / 2, window.innerHeight * 0.57, window.innerWidth * 10, 50);

        // add collider rectangles to scene
        this.physics.add.existing(binOne, true);
        this.physics.add.existing(binTwo, true);
        this.physics.add.existing(binThree, true);
        this.physics.add.existing(rimOneLeft, true);
        this.physics.add.existing(rimOneRight, true);
        this.physics.add.existing(rimTwoLeft, true);
        this.physics.add.existing(rimTwoRight, true);
        this.physics.add.existing(rimThreeLeft, true);
        this.physics.add.existing(rimThreeRight, true);
        this.physics.add.existing(floor, true);

        // Add floor collider events
        this.floorCollider = this.physics.add.collider(this.hero, floor, this.missedTarget, null, this);

        // Add rim collider events
        this.rimOneLeftCollider = this.physics.add.collider(this.hero, rimOneLeft, this.hitRim, null, this);
        this.rimOneRightCollider = this.physics.add.collider(this.hero, rimOneRight, this.hitRim, null, this);
        this.rimTwoLeftCollider = this.physics.add.collider(this.hero, rimTwoLeft, this.hitRim, null, this);
        this.rimTwoRightCollider = this.physics.add.collider(this.hero, rimTwoRight, this.hitRim, null, this);
        this.rimThreeLeftCollider = this.physics.add.collider(this.hero, rimThreeLeft, this.hitRim, null, this);
        this.rimThreeRightCollider = this.physics.add.collider(this.hero, rimThreeRight, this.hitRim, null, this);

        // Add bin collider events
        this.physics.add.overlap(this.hero, binOne, this.hitBlueBin, null, this);
        this.physics.add.overlap(this.hero, binTwo, this.hitGreenBin, null, this);
        this.physics.add.overlap(this.hero, binThree, this.hitYellowBin, null, this);

        this.physicsColliders = [this.rimOneLeftCollider, this.rimOneRightCollider, this.rimTwoLeftCollider,
            this.rimTwoRightCollider, this.rimThreeLeftCollider, this.rimThreeRightCollider, this.floorCollider];

        this.deactivateAll(this.physicsColliders);
    }

    /**
     * Handle the projectile hitting the rim of a bin
     * @param projectile
     * @param rim
     */
    hitRim(projectile, rim) {
        // remove X acceleration
        projectile.setAccelerationX(0);
        this.setProjectileDrag(projectile);
        projectile.body.bounce.set(0.45);

        // determine the direction of bounce
        if (projectile.x > rim.x) {
            projectile.setVelocityX(Math.floor((Math.random() * 150) + 200));
        } else {
            projectile.setVelocityX(Math.floor((Math.random() * 150) + 200) * -1);
        }

        // reset the projectile if the rotaion velocity is zero
        if (projectile.body.angularVelocity === 0) {
            this.lifeHandler();
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
        // if projectile is moving downwards
        if (projectile.body.velocity.y > 0) {
            // disable and hide projectile
            projectile.disableBody(false, true);
            // disable physics colliders
            this.deactivateAll(this.physicsColliders);
            // play hit target sound
            this.sound.play('hit-target');
            // if the paper hits the yellow bin
            if (game_objects[this.object]['paper']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.scoreHandler();
            } else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
                this.lifeHandler();
            }
            // reset projectile to start location
            this.resetProjectile(projectile);
        }
    }

    hitBlueBin(projectile) {
        // if projectile is moving downwards
        if (projectile.body.velocity.y > 0) {
            // disable and hide projectile
            projectile.disableBody(false, true);
            // disable physics colliders
            this.deactivateAll(this.physicsColliders);
            // play hit target sound
            this.sound.play('hit-target');
            // if the bottle hits the blue bin
            if (game_objects[this.object]['container']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.scoreHandler();
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
                this.lifeHandler();
            }
            // reset projectile to start location
            this.resetProjectile(projectile);
        }
    }

    hitGreenBin(projectile) {
        // if projectile is moving downwards
        if (projectile.body.velocity.y > 0) {
            // disable and hide projectile
            projectile.disableBody(false, true);
            // disable physics colliders
            this.deactivateAll(this.physicsColliders);
            // play hit target sound
            this.sound.play('hit-target');
            // if the organic hits the green bin
            if (game_objects[this.object]['organic']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.scoreHandler();
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
                this.lifeHandler();
            }
            // reset projectile to start location
            this.resetProjectile(projectile);
        }
    }

    /**
     * Projectile missed target handler
     * @param projectile
     */
    missedTarget(projectile) {
        // gradually stop projectile motion
        projectile.body.setAccelerationX(0);
        this.setProjectileDrag(projectile);
        let angularVelocity = projectile.body.angularVelocity;
        projectile.body.setAngularVelocity(angularVelocity * 0.5);
        projectile.body.velocityX -= 200;

        // if the object has stopped rotating
        if (projectile.body.angularVelocity === 0) {
            this.createBad();
            this.fadeAndRecedeTween(this.bad);
            this.lifeHandler();
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
        // sets current scene scope
        let scene = projectile.scene;
        // set next object from queue
        this.object = scene.queue[Math.floor(Math.random() * this.queue.length)];
        scene.objectText.setText(this.object);
        // creates new hero projectile
        scene.hero = this.createHeroProjectile(this.object);
        scene.hero.visible = true;
        scene.hero.setInteractive();
        scene.hero.on('pointerdown', this.pointerDownHandler, scene);
        // add physics to hero
        this.createPhysicsObjects();
        // add wind
        this.windUpdate();
    }

    /**
     * Reset projectile to original position
     * @param projectile
     */
    resetProjectile(projectile) {
        // stop projectile motion
        projectile.body.stop();
        projectile.scene.tweens.killTweensOf(projectile);
        // spawn next projectile if the user has remaining lives
        if (this.lives.countActive() > 0) {
            this.spawnProjectile(projectile);
        }
    }

    /**
     * Update the wind value for a projectile
     */
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

    /**
     * Initial game wind setup
     */
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
        // set velocity drag
        projectile.body.setDrag(100, 0);
        // set angular velocity drag
        projectile.body.setAngularDrag(200);
    }

    /**
     * Scales the projectile over time
     * @param projectile
     */
    addProjectileScalingTween(projectile) {
        this.tweens.add({
            targets: projectile,
            displayWidth: projectile.displayWidth / 5.5,
            displayHeight: projectile.displayHeight / 5.5,
            ease: 'Linear',
            duration: 1500,
            repeat: 0,
            yoyo: false
        });
    }

    /**
     * Animation for the target hit image
     * @param image
     */
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
     * Handle player losing a life
     */
    lifeHandler() {
        // finding the first remaining life
        let life = this.lives.getFirstAlive();
        // if the user has lives remaining
        if (life) {
            // remove life and hide the heart image
            this.lives.killAndHide(life);
        }

        // check if the player has lost all of their lives
        if (this.lives.countActive() < 1) {
            // disable hero projectile
            this.hero.active = false;
            // show game over information
            this.staticScoreText.setVisible(false);
            this.scoreText.setVisible(false);
            this.gameOverText.setVisible(true);

            // remove disco effect
            this.sound.stopAll('disco');
            this.discoBall.removeInteractive();
            clearInterval(this.discoInterval);

            // Write score to leaderboard
            this.writeLeaderBoard();
            let thisScene = this;
            setTimeout(function () {
                thisScene.scene.start('LeaderBoard')
            }, 2000, thisScene)
        }
    }

    /**
     * Increase player score
     */
    scoreHandler() {
        let score = this.scoreValue += 1;
        this.scoreText.setText(score);
    }

    /**
     * write to firebase with score ONLY if it's a higher score
     */
    // Write score for normal mode
    writeLeaderBoard() {
        this.displayName = firebase.auth().currentUser.displayName;
        let first_name = this.displayName.split(' ')[0];
        if (this.scoreValue > leaderBoard[first_name] || leaderBoard[first_name] === undefined) {
            firebase.database().ref("users/").update({
                [first_name]: this.scoreValue
            });
        }
    }


    /**
     * Add score related text to the canvas
     */
    addScoreText() {
        let fontStyle = {
            fontFamily: 'Kalam',
            fontSize: 70,
            color: '#84BCCE',
        };
        // add text to scene
        this.gameOverText = this.add.text(
            window.innerWidth * 0.285, window.innerHeight * 0.285, 'Game Over', fontStyle);
        this.gameOverText.setVisible(false);
        this.staticScoreText = this.add.text(
            window.innerWidth * 0.31, window.innerHeight * 0.295, 'Score:', fontStyle);
        this.scoreText = this.add.text(
            window.innerWidth * 0.58, window.innerHeight * 0.295, this.scoreValue, fontStyle);
        this.scoreText.setOrigin(0.5, 0);
        this.scoreText.setAlign('center');
    }

    /**
     * add hero projectile name text to scene
     */
    addObjectText() {
        this.objectText = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.97, null, LEADERBOARD_FONT);
        this.objectText.setOrigin(0.5);
        this.objectText.setFontSize(60);
    }

    createJournal() {
        // creates and add journal container and elements
        this.journalContainer = this.add.container(0, 0);
        this.journalContainer.setDepth(500);
        let bg = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5, 'journal').setOrigin(0.5);
        bg.displayWidth = window.innerWidth * 0.90;
        bg.displayHeight = window.innerHeight * 0.90;
        this.journalContainer.add(bg);
        // create heading
        let heading = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.15, "Did You Know?", JOURNAL_FONT).setOrigin(0.5);
        this.journalContainer.add(heading);
        this.createCloseButton();
        this.journalContainer.add(this.closeButton);
        // create image
        let image = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.25, this.object).setOrigin(0.5);
        let aspect_ratio = image.height / image.width;
        image.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[this.object]['scaling_factor'];
        image.displayWidth = window.innerWidth * 0.165 * game_objects[this.object]['scaling_factor'];
        this.journalContainer.add(image);
        // add object facts to scene
        for (let i = 1; i <= 3; i++) {
            let fact = this.add.text(window.innerWidth * 0.5, window.innerHeight * (0.25 + i * (0.15)), game_objects[this.object]['fact_'+i], JOURNAL_FONT).setOrigin(0.5);
            fact.setFontSize(45);
            fact.setWordWrapWidth(window.innerWidth * 0.65);
            this.journalContainer.add(fact);
        }
    }

    /**
     * Create button to close the journal
     */
    createCloseButton() {
        // add button to scene
        this.closeButton = this.add.text(window.innerWidth * 0.90, window.innerHeight * 0.09, 'X', JOURNAL_FONT).setOrigin(0.5);
        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.journalContainer.destroy();
            this.optionButton.visible = true;
            this.journalButton.visible = true;
            this.hero.visible = true;
        })
    }

    createOptions() {
        // create menu container
        this.optionContainer = this.add.container(0,0);
        let bg = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5, 'options_background').setOrigin(0.5);
        bg.displayWidth = window.innerWidth * 0.90;
        bg.displayHeight = window.innerHeight * 0.60;
        this.optionContainer.add(bg);

        // create resume game option
        this.resumeGame = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.4, 'Resume', TITLE_FONT).setOrigin(0.5);
        this.resumeGame.setFontSize(150);
        this.resumeGame.setInteractive();
        this.resumeGame.on('pointerdown', () => {
            this.optionContainer.destroy();
            this.journalButton.visible = true;
            this.hero.visible = true;
            this.optionButton.visible = true;
            }, this);
        this.optionContainer.add(this.resumeGame);

        // create main menu option
        this.mainMenu = this.add.text(window.innerWidth * 0.5, window.innerHeight * 0.55, 'Main Menu', TITLE_FONT).setOrigin(0.5);
        this.mainMenu.setFontSize(150);
        this.mainMenu.setInteractive();
        this.mainMenu.on('pointerdown', function() {
            this.sound.stopAll('disco');
            this.discoBall.removeInteractive();
            clearInterval(this.discoInterval);
            this.scene.start('Title');
        }, this);
        this.optionContainer.add(this.mainMenu);
    }

    /**
     * Deactivate all phaser elements in an array
     * @param array
     */
    deactivateAll (array) {
        for (let i = 0; i < array.length; i++) {
            array[i].active = false;
        }
    }
}