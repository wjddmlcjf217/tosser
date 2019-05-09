export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, targetScene) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.text = text;
        this.targetScene = targetScene;

        this.button = this.scene.add.text(this.x, this.y, this.text, { fontSize: 69, fill: '#fff' }).setInteractive();

        this.add(this.button);

        this.button.on('pointerdown', function () {
            this.scene.scene.start(this.targetScene);
        }.bind(this));

        this.scene.add.existing(this);
    }
}