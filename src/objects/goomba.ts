import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Goomba extends Enemy {
  body: Phaser.Physics.Arcade.Body;
  constructor(aParams: ISpriteConstructor) {
    super(aParams);
    this.speed = -20;
    this.dyingScoreValue = 100;
  }
  update(): void {
    if (!this.isDying) {
      if (this.isActivated) {
        this.body.setVelocityX(this.speed);
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.velocity.x = this.speed;
        }
        this.anims.play('goombaWalk', true);
      } else {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
        this.getBounds(), this.scene.cameras.main.worldView))
          this.isActivated = true;
      }
    } else {
      this.anims.stop();
      this.body.setVelocity(0, 0);
      this.body.checkCollision.none = true;
    }
  }
  public gotHitOnHead(): void {
    this.isDying = true;
    this.setFrame(2);
    this.showAndAddScore();
  }
  protected gotHitFromBulletOrMarioHasStar(): void {
    this.isDying = true;
    this.body.setVelocityX(20);
    this.body.setVelocityY(-20);
    this.setFlipY(true);
  }
  public isBurnt(): void {
    this.isDying = true;
    this.setFrame(3);
    this.showAndAddScore();
  }
  public isDead(): void {
    this.destroy();
  }
}
