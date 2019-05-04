// version 0.1.5


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

let game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/img/school_scene.png');
    this.load.image('bin_top', 'assets/img/bin_top.png');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
}


function create() {
    this.projectiles = {
        hero: {
            name: 'Paper',
            path: 'assets/img/paper.png',
            gameObject: null,
        },
        first: {
            name: 'Banana',
            path: 'assets/img/banana-sprite.png',
            gameObject: null,
        },
        second: {
            name: 'Banana',
            path: 'assets/img/banana-sprite.png',
            gameObject: null,
        }
    };

    createBackground(this);
    this.colliders = [];
    this.projectiles.hero.gameObject = createHeroProjectile(this);
    let hero = this.projectiles.hero.gameObject;

    bin_top = this.physics.add.image(290, 750, 'bin_top');
    bin_top_2 = this.physics.add.image(650, 750, 'bin_top');
    floor = this.physics.add.image(window.innerWidth / 2, 975, 'bin_top');
    floor.displayWidth = window.innerWidth;
    floor.setImmovable(true);

    this.physics.add.overlap(hero, bin_top, hitTarget, null, this);
    this.physics.add.overlap(hero, bin_top_2, hitTarget, null, this);
    let floorCollider = this.physics.add.collider(hero, floor, missedTarget, null, this);
    floorCollider.active = false;
    this.colliders.push(floorCollider);

    // function that does something when an object collides with the bounds
    // this.physics.world.on('worldbounds', function () {
    //     // console.log('You hit the bounds!');
    // });
    let line = new Phaser.Geom.Line();
    let gfx = this.add.graphics().setDefaultStyles({lineStyle: {width: 10, color: 0xffdd00, alpha: 0.5}});

    // spawn paper and object physics
    hero.on('pointerdown', function (pointerdown) {
        if (hero.getBounds().contains(pointerdown.downX, pointerdown.downY)) {
            this.input.on('pointerup', function (pointerup) {
                let velocityX = pointerup.upX - pointerdown.downX;
                let velocityY = pointerup.upY - pointerdown.downY;
                let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
                velocity.scale(1000);
                hero.isFlying = true;
                hero.enableBody(true, hero.x, hero.y, true, true);
                hero.body.setVelocity(velocity.x * 0.2, velocity.y * 1.45)
                hero.body.setAngularVelocity(500);
                hero.body.setAccelerationY((velocity.y * -1) * 0.75);
                gfx.clear().strokeLineShape(line);
                this.input.off('pointerup');
            }, this);
        }

    }, this);


}

function update() {
    let hero = this.projectiles.hero.gameObject;
    if (hero.isFlying && hero.displayHeight > 50 && hero.displayWidth > 50) {
        hero.displayHeight -= 0.7;
        hero.displayWidth -= 0.7;
    }
    if (hero.body.velocity.y > 0 && this.colliders[0].active === false) {
        this.colliders[0].active = true
    }
    // curve.draw(gfx)
}

function pointerDownHandler () {

}

function createBackground (game) {
    let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerWidth;
}

function createHeroProjectile (game) {
    let hero = game.physics.add.image(530, 1400, game.projectiles.hero.name);
    hero.setInteractive();
    hero.isFlying = false;
    hero.displayHeight = 150;
    hero.displayWidth = 150;
    hero.body.onWorldBounds = true;
    hero.body.setCollideWorldBounds(true);
    hero.setBounce(0.4);
    return hero;
}

function hitTarget (projectile) {
    if (projectile.body.velocity.y > 0) {
        resetProjectile(this, projectile);
        this.colliders[0].active = false;
    }
}

function missedTarget (projectile) {
    setProjectileDrag(projectile);
    if (projectile.body.angularVelocity === 0) {
        resetProjectile(this, projectile);
        this.colliders[0].active = false;
    }
}

function resetProjectile (game, projectile) {
    projectile.disableBody(true, true);
    projectile.enableBody(true, 530, 1400, true, true);
    projectile.visible = true;
    projectile.isFlying = false;
    projectile.displayHeight = 150;
    projectile.displayWidth = 150;
    projectile.body.setAllowDrag(false);
}

function setProjectileDrag (projectile) {
    projectile.body.setAllowDrag(true);
    projectile.body.setDrag(20, 0);
    projectile.body.setAngularDrag(180);
}


