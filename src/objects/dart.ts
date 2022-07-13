import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Dart extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private dart: Phaser.GameObjects.PathFollower;
  private direction: string;
  private props: any = {};
  constructor(aParams: ISpriteConstructor, direction: string) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.direction = direction;
    this.initSprite();
  }
  private initSprite(): void {
    if (this.direction === 'up' || this.direction === 'right') {
      this.scene.physics.world.enable(this);
      this.body.setSize(this.width * 0.9, this.height * 0.85);
      this.setScale(0.7).setDepth(1);
      this.body.setAllowGravity(false);
      this.body.setImmovable(true);
      this.scene.add.existing(this);
      if (this.direction === 'up') 
        this.props = {y: this.y - 98};
      else this.props = { x: this.x + 114 };
      this.moveStraight();
    }
    else {
      let path = new Phaser.Curves.Path(this.x, this.y);
      if (this.direction === 'aroundtop') {
        path.lineTo(224, 112);
        path.lineTo(224, 176);
        path.lineTo(112, 176);
        path.lineTo(112, 112);
      }
      else {
        path.lineTo(112, 176);
        path.lineTo(112, 112);
        path.lineTo(224, 112);
        path.lineTo(224, 176);
      }
      let graphics = this.scene.add.graphics();
      graphics.lineStyle(0, 0xffffff, 1);
      path.draw(graphics, 128);
      this.dart = this.scene.add.follower(path, this.x, this.y, 'darton');
      this.scene.physics.world.enable(this.dart);
      this.scene.add.existing(this.dart);
      let bodyDart = this.dart.body as Phaser.Physics.Arcade.Body;
      bodyDart.setSize(this.width * 0.9, this.height * 0.85);
      bodyDart.setAllowGravity(false);
      bodyDart.setImmovable(true);
      this.dart.setScale(0.7).setDepth(1);
      this.dart.anims.play('darton', true);
      this.moveAround();
    }
  }
  public getDart(): Phaser.GameObjects.PathFollower {
    return this.dart;
  }
  private moveStraight(): void {
    this.anims.play('darton', true);
    this.scene.add.tween({
      targets: this,
      props: this.props,
      duration: 4000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
  private moveAround(): void {
    this.dart.startFollow({
      duration: 10000,
      repeat: -1,
      rotateToPath: true
    });
  }
}
