import game_objects from '../objects/game_objects.js'
let object = null;
let j = 0;
let recycle = false;
let organic = false;
let paper = false;

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super("Tutorial");
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
        this.addObjectText(this);
        this.addTutorialText(this);
        this.addSwipeText(this);
        this.swipeText.setText("Swipe to throw!");
        // Create Hero
        this.queue = ['paper', 'banana', 'waterbottle'];
        object = this.queue[j];
        this.objectText.setText(object);
        this.tutorial(this, object);
        this.hero = this.createHeroProjectile(this, object);


        this.hero.visible = true;
        this.hero.setInteractive();
        this.hero.on('pointerdown', this.pointerDownHandler, this);
        this.createPhysicsObjects(this);
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
     * casts a check mark animation upon scoring correctly
     * @param N/A
     */
    createGood() {
        this.good = this.add.image(window.innerWidth * .5, window.innerHeight * 0.3, 'good');
        this.good.displayHeight = 420;
        this.good.displayWidth = 420;
    }

    /**
     * casts a check mark animation upon scoring correctly
     * @param N/A
     */
    createBad() {
        this.bad = this.add.image(window.innerWidth * .5, window.innerHeight * 0.3, 'bad');
        this.bad.displayHeight = 420;
        this.bad.displayWidth = 420;
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

    /**
     * Creates the hero projectile
     * @param game Phaser game
     * @param image Phaser image key
     * @returns Hero image game object
     */
    createHeroProjectile(game, image) {
        let hero = game.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.89, image);
        hero.setInteractive();
        hero.state = 'resting';
        let aspect_ratio = hero.height / hero.width;
        hero.displayHeight = window.innerHeight * 0.092 * aspect_ratio * game_objects[object]['scaling_factor'];
        hero.displayWidth = window.innerWidth * 0.165 * game_objects[object]['scaling_factor'];
        hero.setBounce(.4);
        // hero.body.onWorldBounds = true;
        // hero.body.setCollideWorldBounds(true);
        hero.visible = false;
        if (j < 2) {
            j += 1
        }
        else {
            j = 0
        }

        return hero;
    }

    /**
     * Creates physics objects
     * @param game Phaser Game
     */
    createPhysicsObjects(game) {
        let binOne = game.add.rectangle(window.innerWidth * 0.185, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimOneLeft = game.add.rectangle(window.innerWidth * 0.11, window.innerHeight * 0.44, window.innerWidth * 0.001, 25);//0.015
        let rimOneRight = game.add.rectangle(window.innerWidth * 0.260, window.innerHeight * 0.44, window.innerWidth * 0.001, 25); //0.015

        let binTwo = game.add.rectangle(window.innerWidth * 0.51775, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimTwoLeft = game.add.rectangle(window.innerWidth * 0.44275, window.innerHeight * 0.44, window.innerWidth * 0.001, 25);//0.015
        let rimTwoRight = game.add.rectangle(window.innerWidth * 0.59275, window.innerHeight * 0.44, window.innerWidth * 0.001, 25); //0.015

        let binThree = game.add.rectangle(window.innerWidth * 0.84725, window.innerHeight * 0.450, window.innerWidth * 0.13, 15);
        let rimThreeLeft = game.add.rectangle(window.innerWidth * 0.77225, window.innerHeight * 0.44, window.innerWidth * 0.001, 25);
        let rimThreeRight = game.add.rectangle(window.innerWidth * 0.92225, window.innerHeight * 0.44, window.innerWidth * 0.001, 25);

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
            if (game_objects[object]['paper']) {
                this.createGood();
                this.addGoodTween(this.good);
                paper = true;
            }
            else {
                this.createBad();
                this.addBadTween(this.bad);
            }
            this.resetProjectile(projectile);
            if (organic && paper && recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                organic = false;
                paper = false;
                recycle = false;
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
            if (game_objects[object]['container']) {
                this.createGood();
                this.addGoodTween(this.good);
                recycle = true;
            }
            else {
                this.createBad();
                this.addBadTween(this.bad);
            }
            this.resetProjectile(projectile);
            if (organic && paper && recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                organic = false;
                paper = false;
                recycle = false;
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
            if (game_objects[object]['organic']) {
                this.createGood();
                this.addGoodTween(this.good);
                organic = true;
            }
            else {
                this.createBad();
                this.addBadTween(this.bad);
            }
            this.resetProjectile(projectile);
            if (organic && paper && recycle) {
                this.tutorialText.setText("CONGRATULATIONS!");
                this.tutorialText.setColor('#24CC18');
                organic = false;
                paper = false;
                recycle = false;
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
            this.addBadTween(this.bad);
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
        object = scene.queue[j];
        scene.objectText.setText(object);
        this.tutorial(scene, object);
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


    addObjectText(scene) {
        scene.objectText = scene.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.97, null, LEADERBOARD_FONT);
        scene.objectText.setOrigin(0.5);
        scene.objectText.setFontSize(60);
    }

    addTutorialText(scene) {
        scene.tutorialText = scene.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.65, null, TUTORIAL_FONT);
        scene.tutorialText.setOrigin(0.5);
        scene.tutorialText.setFontSize(70);
    }

    addSwipeText(scene) {
        scene.swipeText = scene.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.17, null, TUTORIAL_FONT);
        scene.swipeText.setOrigin(0.5);
        scene.swipeText.setFontSize(70);
    }

    tutorial(scene, object) {
        if (object === "paper") {
            scene.tutorialText.setText("Paper goes into the YELLOW BIN!");
            scene.tutorialText.setColor('yellow');
            scene.tutorialText.setStroke('#4d377d');
        }
        if (object === "banana") {
            scene.tutorialText.setText("Banana goes into the GREEN BIN!");
            scene.tutorialText.setColor('lightgreen');
            scene.tutorialText.setStroke('#4d377d');
        }
        if (object === "waterbottle") {
            scene.tutorialText.setText("Bottle goes into the BLUE BIN!");
            scene.tutorialText.setColor('#1263F5');
            scene.tutorialText.setStroke('white');
        }
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
}