import { ICollectibleConstructor } from '../interfaces/collectible.interface';
export class Collectible extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private points: number;
  constructor(aParams: ICollectibleConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.points = aParams.points;
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.scene.add.existing(this);
  }
  public collected(): void {
    this.scene.registry.values.score += this.points;
    this.scene.events.emit('scoreChanged');
    this.destroy();
  }
}