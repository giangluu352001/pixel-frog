import { showAndAddScore } from '../helpers/tween-helper';
import { ICollectibleConstructor } from '../interfaces/collectible.interface';
export class Fruit extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private points: number;
  constructor(aParams: ICollectibleConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.points = aParams.points;
    this.initSprite();
    this.scene.add.existing(this);
    this.anims.play(aParams.texture, true);
  }
  private initSprite(): void {
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.body.setSize(this.width * 0.45, this.height * 0.45);

  }
  public collected(): void {
    showAndAddScore(this.scene, this.points, this);
    this.anims.play('collected', true).
    on('animationcomplete', () => this.destroy());
  }
  update(): void {
    if (this.body && this.body.blocked.down)
      this.body.setVelocity(0, 0);
  }
}