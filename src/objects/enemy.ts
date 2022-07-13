import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Enemy extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  protected isActivated: boolean;
  protected isDying: boolean;
  protected speed: number;
  protected dyingScoreValue: number;
  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.isActivated = false;
    this.isDying = false;
    this.setFrame(0);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  public getIsDying(): boolean {
    return this.isDying;
  }
}
