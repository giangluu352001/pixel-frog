import { IBarConstructor } from '../interfaces/bar.interface';
export class Bar extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;
  constructor(aParams: IBarConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.initSprite();
    this.scene.add.existing(this);
  }
  private initSprite(): void {
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.setOrigin(0, 0);
    this.body.setSize(this.width, this.height * 0.3);
    this.body.setOffset(0, 0);
    this.body.setImmovable(true);
	this.body.checkCollision.down = false;
  }
}