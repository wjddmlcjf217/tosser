// import superclass Game
import GameScene from './game.js'
// import game objects
import game_objects from '../objects/game_objects.js'

/**
 * TutorialScene is a Phaser game scene designed to teach the player how to play Tosser
 */
export default class TutorialScene extends GameScene {
    constructor() {
        super("Tutorial");
        // projectile description
        this.object = null;
        // tutorial projectile queue counter
        this.j = 0;
        // tutorial is completed when all bin types have been hit
        this.recycle = false;
        this.organic = false;
        this.paper = false;
    }

    /**
     * Initial Object Creation for Phaser Game
     */
    create() {
        // setup background
        this.createBackground();
        this.addObjectText();
        this.addTutorialText();
        this.addSwipeText();
        this.swipeText.setText("Swipe to throw!");

        // Create Hero
        this.queue = ['paper', 'banana', 'waterbottle'];
        this.object = this.queue[this.j];
        this.objectText.setText(this.object);
        this.tutorial(this.object);
        this.hero = this.createHeroProjectile(this.object);
        this.hero.visible = true;
        this.hero.setInteractive();
        this.hero.on('pointerdown', this.pointerDownHandler, this);
        this.createPhysicsObjects();
    }

    /**
     * Creates the hero projectile
     * @param image Phaser image key
     * @returns Hero image game object
     */
    createHeroProjectile(image) {
        // add projectile to phaser game
        let hero = this.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.89, image);

        // configure hero projectile
        hero.setInteractive();
        hero.state = 'resting';
        let aspect_ratio = hero.height / hero.width;

        // set projectile display
        hero.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[this.object]['scaling_factor'];
        hero.displayWidth = window.innerWidth * 0.165 * game_objects[this.object]['scaling_factor'];
        hero.setY(window.innerHeight * (1 - 0.07) - (hero.displayHeight * 0.5));

        // set phaser properties
        hero.setBounce(.4);
        hero.visible = true;
        if (this.j < 2) {
            this.j += 1
        }
        else {
            this.j = 0
        }

        return hero;
    }

    /**
     * Reset projectile to starting position
     * @param projectile Hero Projectile
     */
    resetProjectile(projectile) {
        // stop projectile motion
        projectile.body.stop();
        // stop projectile scaling animation
        projectile.scene.tweens.killTweensOf(projectile);
        // spawn a new projectile at starting position
        this.spawnProjectile(projectile);
    }

    /**
     * Projectile Hit target handler
     * @param projectile
     */
    hitYellowBin(projectile) {
        // if the projectile is moving downwards
        if (projectile.body.velocity.y > 0) {
            // disable and hide projectile
            projectile.disableBody(false, true);
            // disable physics colliders
            this.deactivateAll(this.physicsColliders);
            // play hit target sound
            this.sound.play('hit-target');
            // if the paper hits the yellow bin
            if (game_objects[this.object]['paper']) {
                // set global paper top true
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.paper = true;
            } else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
            }
            // reset projectile to start location
            this.resetProjectile(projectile);
            //check if the user has hit all of the bin correctly
            if (this.organic && this.paper && this.recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                // reseting tutorial
                this.organic = false;
                this.paper = false;
                this.recycle = false;
                // send user back to title screen after 1.5 seconds
                setTimeout(function() {projectile.scene.scene.start('Title')}, 1500);
            }
        }
    }

    hitBlueBin(projectile) {
        // if the projectile is moving downwards]
        if (projectile.body.velocity.y > 0) {
            // disable and hide projectile
            projectile.disableBody(false, true);
            // disable physics colliders
            this.deactivateAll(this.physicsColliders);
            // play hit target sound
            this.sound.play('hit-target');
            // if the bottle hits the blue bin
            if (game_objects[this.object]['container']) {
                // set global recycle to true
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.recycle = true;
            } else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
            }
            // reset projectile to start location
            this.resetProjectile(projectile);
            //check if the user has hit all of the bin correctly
            if (this.organic && this.paper && this.recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                this.organic = false;
                this.paper = false;
                this.recycle = false;
                // send user back to title screen after 1.5 seconds
                setTimeout(function() {projectile.scene.scene.start('Title')}, 1500);
            }
        }
    }

    hitGreenBin(projectile) {
        // if the projectile is moving downwards
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
                this.organic = true;
            } else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
            }
            // reset projectile to start location
            this.resetProjectile(projectile);
            //check if the user has hit all of the bin correctly
            if (this.organic && this.paper && this.recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                // reseting tutorial
                this.organic = false;
                this.paper = false;
                this.recycle = false;
                // send user back to title screen after 1.5 seconds
                setTimeout(function() {projectile.scene.scene.start('Title')}, 1500);
            }
        }
    }

    /**
     * Projectile missed target handler
     * @param projectile Hero projectile
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
            projectile.disableBody(false, false);
            this.resetProjectile(projectile);
            this.floorCollider.active = false;
            // disable physics colliders
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
        this.object = scene.queue[this.j];
        scene.objectText.setText(this.object);
        this.tutorial(this.object);
        // creates new hero projectile
        scene.hero = this.createHeroProjectile(this.object);
        scene.hero.visible = true;
        scene.hero.setInteractive();
        scene.hero.on('pointerdown', this.pointerDownHandler, scene);
        // add physics to hero
        this.createPhysicsObjects()
    }

    /**
     * add guiding text in tutorial scene
     */
    addTutorialText() {
        this.tutorialText = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.65, null, TUTORIAL_FONT);
        this.tutorialText.setOrigin(0.5);
        this.tutorialText.setFontSize(70);
    }

    /**
     * add guiding text in tutorial scene
     */
    addSwipeText() {
        this.swipeText = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.17, null, TUTORIAL_FONT);
        this.swipeText.setOrigin(0.5);
        this.swipeText.setFontSize(70);
    }

    /**
     * Dynamically update tutorial text depending upon the hero projectile
     * @param object
     */
    tutorial(object) {
        if (object === "paper") {
            this.tutorialText.setText("Paper goes into the YELLOW BIN!");
            this.tutorialText.setColor('yellow');
            this.tutorialText.setStroke('#4d377d');
        }
        if (object === "banana") {
            this.tutorialText.setText("Banana goes into the GREEN BIN!");
            this.tutorialText.setColor('lightgreen');
            this.tutorialText.setStroke('#4d377d');
        }
        if (object === "waterbottle") {
            this.tutorialText.setText("Bottle goes into the BLUE BIN!");
            this.tutorialText.setColor('#1263F5');
            this.tutorialText.setStroke('white');
        }
    }
}