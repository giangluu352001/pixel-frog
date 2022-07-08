import { Collectible } from './collectible';
import { IBoxConstructor } from '../interfaces/box.interface';
export class Box extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private hitBoxTimeline: Phaser.Tweens.Timeline;
  private boxContent: string;
  private content: Collectible;
  constructor(aParams: IBoxConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.boxContent = aParams.content;
    this.hitBoxTimeline = this.scene.tweens.createTimeline({});
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
    this.setFrame(0);
    this.body.setAllowGravity(false);
    this.scene.add.existing(this);
  }
  public getBoxContent(): string {
    return this.boxContent;
  }
  public getContent(): Collectible {
    return this.content;
  }
  public hitBottomBox(): void {
    this.hitBoxTimeline.add({
      targets: this,
      props: { y : this.y - 10 },
      duration: 60, 
      ease: 'Power0',
      yoyo: true, 
      onComplete: () => {
        this.active = false;
        this.setFrame(1);
      }
    });
  }
  public spawnBoxContent(): Collectible {
    this.content = new Collectible({
      scene: this.scene,
      x: this.x,
      y: this.y - 8,
      texture: this.boxContent,
      points: 1000
    });
    return this.content;
  }
  public tweenBoxContent(
    props: {},
    duration: number,
    complete: () => void
  ): void {
    this.hitBoxTimeline.add({
      targets: this.content,
      props: props,
      delay: 0,
      duration: duration,
      ease: 'Power0',
      onComplete: complete
    });
  }
  public popUpCollectible(): void {
    this.content.body.setVelocity(30, -50);
    this.content.body.setAllowGravity(true);
    this.content.body.setGravityY(-300);
  }
  public startTween(): void {
    this.hitBoxTimeline.play();
  }
  public addCoinAndScore(coin: number, score: number): void {
    this.scene.registry.values.coins += coin;
    this.scene.events.emit('coinsChanged');
    this.scene.registry.values.score += score;
    this.scene.events.emit('scoreChanged');
  }
}