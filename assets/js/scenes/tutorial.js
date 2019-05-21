import GameScene from './game.js'
import game_objects from '../objects/game_objects.js'


export default class TutorialScene extends GameScene {
    constructor() {
        super("Tutorial");
        this.object = null;
        this.j = 0;
        this.recycle = false;
        this.organic = false;
        this.paper = false;
    }

    /**
     * Initial Object Creation for Phaser Game
     */
    create() {
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

        this.hero.visible = false;
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
        let hero = this.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.89, image);
        hero.setInteractive();
        hero.state = 'resting';
        let aspect_ratio = hero.height / hero.width;
        hero.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[this.object]['scaling_factor'];
        hero.displayWidth = window.innerWidth * 0.165 * game_objects[this.object]['scaling_factor'];
        hero.setY(window.innerHeight * (1 - 0.07) - (hero.displayHeight * 0.5));
        hero.setBounce(.4);
        // hero.body.onWorldBounds = true;
        // hero.body.setCollideWorldBounds(true);
        hero.visible = false;
        if (this.j < 2) {
            this.j += 1
        }
        else {
            this.j = 0
        }

        return hero;
    }

    resetProjectile(projectile) {
        projectile.body.stop();
        console.log(projectile);
        projectile.scene.tweens.killTweensOf(projectile);
        this.spawnProjectile(projectile);
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
            if (game_objects[this.object]['paper']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.paper = true;
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
            }
            this.resetProjectile(projectile);
            if (this.organic && this.paper && this.recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                this.organic = false;
                this.paper = false;
                this.recycle = false;
                setTimeout(function() {projectile.scene.scene.start('Title')}, 1500);
            }
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
            if (game_objects[this.object]['container']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.recycle = true;
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
            }
            this.resetProjectile(projectile);
            if (this.organic && this.paper && this.recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                this.organic = false;
                this.paper = false;
                this.recycle = false;
                setTimeout(function() {projectile.scene.scene.start('Title')}, 1500);
            }
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
            if (game_objects[this.object]['organic']) {
                this.createGood();
                this.fadeAndRecedeTween(this.good);
                this.organic = true;
            }
            else {
                this.createBad();
                this.fadeAndRecedeTween(this.bad);
            }
            this.resetProjectile(projectile);
            if (this.organic && this.paper && this.recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                this.organic = false;
                this.paper = false;
                this.recycle = false;
                setTimeout(function() {projectile.scene.scene.start('Title')}, 1500);
            }
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
        this.object = scene.queue[this.j];
        scene.objectText.setText(this.object);
        this.tutorial(this.object);
        scene.hero = this.createHeroProjectile(this.object);
        scene.hero.visible = true;
        scene.hero.setInteractive();
        scene.hero.on('pointerdown', this.pointerDownHandler, scene);

        this.createPhysicsObjects()
    }

    addTutorialText() {
        this.tutorialText = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.65, null, TUTORIAL_FONT);
        this.tutorialText.setOrigin(0.5);
        this.tutorialText.setFontSize(70);
    }

    addSwipeText() {
        this.swipeText = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.17, null, TUTORIAL_FONT);
        this.swipeText.setOrigin(0.5);
        this.swipeText.setFontSize(70);
    }

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