export class BreakBox extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    constructor(scene: Phaser.Scene, x: number, y: number, frame: number) {
      super(scene, x, y, 'breakbox', frame);
      scene.add.existing(this);
      scene.physics.world.enable(this);
      this.body.setSize(this.width * 0.45, this.height * 0.45);
    }
    update(): void {
      if (this.body && this.body.blocked.down)
        this.body.setVelocity(0, 0);
    }
    public flash(): void {
      this.alpha = 0;
      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        duration: 200,
        repeat: 5,
        onComplete: () => this.destroy()
      });
    }
  }