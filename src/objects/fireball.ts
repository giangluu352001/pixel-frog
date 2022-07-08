import { ISpriteConstructor } from "../interfaces/sprite.interface";
export class Fireball extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    constructor(aParams: ISpriteConstructor, speed: number) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.setVelocityX(speed);
        this.scene.add.existing(this);
        this.setScale(0.1);
        this.body.setSize(450, 140).setOffset(-8, 45);
      }
}