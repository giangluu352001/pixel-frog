import { ISpriteConstructor } from "../interfaces/sprite.interface";
export class Bullet extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    private speed: number;
    constructor(aParams: ISpriteConstructor, speed: number) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.speed = speed;
        this.scene.add.existing(this);
        this.initSprite();
    }
    private initSprite(): void {
      this.scene.physics.world.enable(this);
      this.setOrigin(0, 0).setScale(0.8);
    }
    public fly(): void {
      this.body.setVelocity(this.speed, -200);
      this.anims.play('darton', true);
    }
    public hit(): void {
      this.scene.tweens.add({
        targets: this, 
        props: { alpha: 0},
        duration: 500,
        loop: false,
        onComplete: () => this.destroy()
      });
    }
    update(): void {
      if (this.body && this.body.blocked.down)
        this.hit();
    }
}