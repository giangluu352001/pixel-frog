import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Fireball } from './fireball';
export class Mario extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private marioSize: string;
  private acceleration: number;
  private isJumping: boolean;
  private isDying: boolean;
  private isThrowing: boolean;
  private isVulnerable: boolean;
  private vulnerableCounter: number;
  private fireballGroup: Phaser.GameObjects.Group;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;
  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys;
  }
  public getVulnerable(): boolean {
    return this.isVulnerable;
  }
  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.initSprite();
    this.scene.add.existing(this);
  }
  private initSprite() {
    this.marioSize = this.scene.registry.get('marioSize');
    this.acceleration = 1000;
    this.isJumping = false;
    this.isDying = false;
    this.isVulnerable = true;
    this.isThrowing = false;
    this.vulnerableCounter = 100;
    this.fireballGroup = this.scene.add.group();
    this.setOrigin(0.5, 0.5).setFlipX(false);
    this.keys = new Map([
      ['LEFT', this.addKey('LEFT')],
      ['RIGHT', this.addKey('RIGHT')],
      ['DOWN', this.addKey('DOWN')],
      ['JUMP', this.addKey('SPACE')],
      ['THROW', this.addKey('T')]
    ]);
    this.scene.physics.world.enable(this);
    this.adjustPhysicBodyToSmallSize();
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 300;
  }
  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.scene.input.keyboard.addKey(key);
  }
  update(): void {
    if (!this.isDying) {
      this.handleInput();
      this.handleAnimations();
    } else {
      this.setFrame(6);
      if (this.y > this.scene.cameras.main.height) {
        this.scene.scene.stop('GameScene');
        this.scene.scene.stop('HUDScene');
        this.scene.scene.start('MenuScene');
      }
    }
    if (!this.isVulnerable) {
      if (this.vulnerableCounter > 0)
        this.vulnerableCounter -= 1;
      else {
        this.vulnerableCounter = 100;
        this.isVulnerable = true;
      }
    }
  }

  private handleInput() {
    if (this.y > this.scene.cameras.main.height)
      this.isDying = true;
    if (this.body.onFloor() || this.body.touching.down || this.body.blocked.down) {
      this.isJumping = false;
    }
    if (this.keys.get('RIGHT').isDown) {
      this.body.setAccelerationX(this.acceleration);
      this.setFlipX(false);
    }
    else if (this.keys.get('LEFT').isDown) {
      this.body.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.keys.get('THROW')) && !this.isThrowing) {
      this.isThrowing = true;
      this.throwFireball();
    }
    else {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
    }
    if (this.keys.get('JUMP').isDown && !this.isJumping) {
      this.body.setVelocityY(-330);
      this.isJumping = true;
    }
  }

  private handleAnimations(): void {
    if (this.body.velocity.y !== 0) {
      this.anims.stop();
      if (this.marioSize === 'small') this.setFrame(5);
      else this.setFrame(13);
    } 
    else if (this.body.velocity.x !== 0)
      this.anims.play(this.marioSize + 'MarioWalk', true);
    else {
      if(!this.isThrowing) {
        this.anims.stop();
        if (this.marioSize === 'small') this.setFrame(0);
        else this.setFrame(8);
      }
    }
  }

  public growMario(): void {
    this.marioSize = 'big';
    this.scene.registry.set('marioSize', 'big');
    this.adjustPhysicBodyToBigSize();
  }

  private shrinkMario(): void {
    this.marioSize = 'small';
    this.scene.registry.set('marioSize', 'small');
    this.adjustPhysicBodyToSmallSize();
  }

  private adjustPhysicBodyToSmallSize(): void {
    this.body.setSize(8, 16);
    this.body.setOffset(12, 15);
  }

  private adjustPhysicBodyToBigSize(): void {
    this.body.setSize(20, 32);
    this.body.setOffset(6, 0);
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
  private throwFireball(): void {
    this.anims.play(this.marioSize + 'MarioThrow', true);
    this.scene.time.addEvent({
      delay: 300,
      loop: false,
      callback: () => {
        this.isThrowing = false;
        let pos: number, speed: number;
        if (this.flipX) { 
          pos = -30;
          speed = -100;
        }
        else {
          pos = 30;
          speed = 100;
        }
        let fireball: Fireball = new Fireball({
          scene: this.scene,
          x: this.x + pos,
          y: this.y - 10,
          texture: 'fireball'
        }, speed);
        this.fireballGroup.add(fireball);
        fireball.on('animationcomplete', () => fireball.destroy());
        fireball.anims.play('firing', true);
      }
    });
  }
  public getFireballGroup(): Phaser.GameObjects.Group {
    return this.fireballGroup;
  }
  public gotHit(): void {
    this.isVulnerable = false;
    if (this.marioSize === 'big')
      this.shrinkMario();
    else {
      this.isDying = true;
      this.body.stop();
      this.anims.stop();
      this.body.setVelocityY(-180);
      this.body.checkCollision.none = true;
    }
  }
}