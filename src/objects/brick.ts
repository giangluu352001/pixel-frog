import { IBrickConstructor } from '../interfaces/brick.interface';

export class Brick extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  protected destroyingValue: number;
  constructor(aParams: IBrickConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.destroyingValue = aParams.value;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  update(): void {
    if (this.body.touching.down) {
      for (let i = -2; i < 2; i++) {
        let brick = this.scene.add
          .sprite(this.x, this.y, 'brick')
          .setOrigin(0, 0)
          .setDisplaySize(8, 8);
        this.scene.physics.world.enable(brick);
      }
      this.scene.registry.values.score += this.destroyingValue;
      this.scene.events.emit('scoreChanged');
      this.destroy();
    }
  }
}