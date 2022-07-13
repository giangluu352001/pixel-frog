import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { showAndAddScore } from '../helpers/tween-helper';

export class Goomba extends Enemy {
  body: Phaser.Physics.Arcade.Body;
  constructor(aParams: ISpriteConstructor) {
    super(aParams);
    this.speed = -20;
    this.dyingScoreValue = 100;
    this.body.setSize(this.width * 0.8, this.height * 0.6);
    this.body.setOffset(3, 13);
  }
  update(): void {
    if (!this.isDying) {
      if (this.isActivated) {
        this.body.setVelocityX(this.speed);
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.velocity.x = this.speed;
          if (this.speed > 0) this.setFlipX(true);
          else this.setFlipX(false);
        }
        this.anims.play('rungoomba', true);
      } 
      else {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
        this.getBounds(), this.scene.cameras.main.worldView))
          this.isActivated = true;
      }
    }
    else this.body.checkCollision.none = true;
  }
  public gotHit(): void {
    this.isDying = true;
    this.anims.play('hitgoomba', true);
    this.body.setVelocityY(100);
    showAndAddScore(this.scene, this.dyingScoreValue, this);
    this.scene.add.tween({
      targets: this,
      props: { alpha: 0 },
      duration: 1000,
      ease: 'Power0',
      yoyo: false,
      onComplete: () => this.isDead()
    });
  }
  public isDead(): void {
    this.destroy();
  }
}
