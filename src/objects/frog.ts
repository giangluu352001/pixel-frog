import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Bullet } from './bullet';
export class Frog extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private acceleration: number;
  private isJumping: boolean;
  private isDoubleJumping: boolean;
  private isDying: boolean;
  private isOnWall: boolean;
  private dartGroup: Phaser.GameObjects.Group;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;
  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys;
  }
  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.initSprite();
    this.scene.add.existing(this);
  }
  private initSprite(): void {
    this.acceleration = 1000;
    this.isJumping = false;
    this.isDying = false;
    this.isOnWall = false;
    this.isDoubleJumping = null;
    this.keys = new Map([
      ['LEFT', this.addKey('LEFT')],
      ['RIGHT', this.addKey('RIGHT')],
      ['DOWN', this.addKey('DOWN')],
      ['JUMP', this.addKey('UP')],
      ['THROW', this.addKey('SPACE')]
    ]);
    this.dartGroup = this.scene.add.group();
    this.scene.physics.world.enable(this);
    this.body.setSize(this.width * 0.7, this.height * 0.85);
    this.body.setOffset(5, 5);
    this.setDepth(3);
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 400;
    this.keys.get('JUMP').on('down', this.jump, this);
    this.keys.get('THROW').on('down', this.throwDart, this);
  }
  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.scene.input.keyboard.addKey(key);
  }
  update(): void {
    if (!this.isDying) {
      this.dartGroup.getChildren().forEach(dart => dart.update());
      this.changeState();
      this.handleInput();
      this.handleAnimations();
    }
    else {
      if (this.flipX) this.angle += 1;
      else this.angle -= 1;
      if (this.y > this.scene.cameras.main.height) {
        this.scene.scene.stop('GameScene');
        this.scene.scene.stop('HUDScene');
        this.scene.scene.start('MenuScene');
      }
    }
  }
  private changeState(): void {
    if (this.y > this.scene.cameras.main.height)
      this.isDying = true;
    if (this.body.onFloor() || this.body.touching.down || this.body.blocked.down) {
      this.isJumping = false;
      this.isDoubleJumping = null;
    }
    else if (this.isJumping && this.isDoubleJumping === null && this.body.velocity.y > 0) 
      this.isDoubleJumping = false;
    if ((this.body.blocked.right || this.body.blocked.left) &&
      !this.body.blocked.down) {
        this.isOnWall = true;
        //console.log('ha');
      }
    else this.isOnWall = false;
  }
  private handleInput(): void {
    if (this.keys.get('RIGHT').isDown)
      this.run(this.acceleration, false);
    else if (this.keys.get('LEFT').isDown)
      this.run(-this.acceleration, true);
    else this.idle();
  }
  private run(acceleration: number, isFlip: boolean): void {
    this.body.setAccelerationX(acceleration);
    this.setFlipX(isFlip);
  }
  private idle(): void {
    this.body.setVelocityX(0);
    this.body.setAccelerationX(0);
  }
  private jump = (): void => {
    if (!this.isJumping) {
      this.body.setVelocityY(-300);
      this.isJumping = true;
    }
    else if (this.isDoubleJumping === false) {
      this.body.setVelocityY(-300);
      this.isDoubleJumping = true;
    }
  }
  private handleAnimations(): void {
    if (this.body.velocity.y !== 0) {
      if (this.body.velocity.y > 0)
      {
        if (this.isOnWall) {
          this.body.setVelocityY(5);
          this.anims.play('frogwalljump', true);
        }
        else {
          this.anims.stop();
          this.setTexture('frogfall');
        }
      }
      else {
        if (this.isDoubleJumping)
          this.anims.play('frogdoublejump', true);
        else {
          this.anims.stop();
          this.setTexture('frogjump');
        }
      }
    } 
    else if (this.body.velocity.x !== 0)
      this.anims.play('frogrun', true);
    else this.anims.play('frogidle', true);
  }

  public bounceUpAfterHitEnemyOnHead(): void {
    this.scene.add.tween({
      targets: this,
      props: { y: this.y - 5 },
      duration: 200,
      ease: 'Power1',
      yoyo: true
    });
  }
  private throwDart = (): void => {
    let pos: number = 10, speed: number = 200;
    if (this.flipX) { 
      pos = - pos;
      speed = - speed;
    }
    let bullet: Bullet = new Bullet({
      scene: this.scene,
      x: this.x + pos,
      y: this.y - 20,
      texture: 'darton'
    }, speed);
    this.dartGroup.add(bullet);
    bullet.fly();
  }
  public gotHit = (): void => {
    this.isDying = true;
    this.body.stop();
    this.scene.cameras.main.shake(100, 0.01);
    this.anims.play('froghit', true);
    this.body.setVelocityY(-300);
    if (this.flipX) this.body.setVelocityX(50);
    else this.body.setVelocityX(-50);
    this.body.checkCollision.none = true;
  }
  public getDartGroup(): Phaser.GameObjects.Group {
    return this.dartGroup;
  }
}