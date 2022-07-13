import { Fruit } from './fruit';
import { IBoxConstructor } from '../interfaces/box.interface';
export class Box extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private boxContent: string;
  private breakGroup: Phaser.GameObjects.Group;
  constructor(aParams: IBoxConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.boxContent = aParams.content;
    this.breakGroup = aParams.scene.add.group();
    this.initSprite();
    this.scene.add.existing(this);
  }
  private initSprite(): void {
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
    this.setOrigin(0.15, 0.25);
    this.body.setSize(this.width * 0.75, this.height * 0.9);
    this.body.setAllowGravity(false);
  }
  public getBoxContent(): string {
    return this.boxContent;
  }
  public getBreakGroup(): Phaser.GameObjects.Group {
    return this.breakGroup;
  }
  public hitBottomBox(fruits: Phaser.GameObjects.Group): void {
    this.anims.play('hitbox', true).on('animationcomplete', 
    () => {
      this.spawnBoxContent(fruits, 4);
      this.scene.time.addEvent({
        delay: 500,
        callback: () => this.breakGroup.getChildren().forEach((breakpart: BreakBox) => breakpart.flash()),
        callbackScope: this,
        loop: false
      });
      this.setVisible(false);
    });
  }
  update(): void {
    this.breakGroup.getChildren().forEach(breakpart => breakpart.update());
    if (!this.visible && !this.breakGroup.getLength()) this.destroy(); 
  }
  private spawnBoxContent(fruits: Phaser.GameObjects.Group, val: number): void {
    for (let i = 0; i < val; i ++) {
      let breakpart = new BreakBox(this.scene, this.x + (Math.random() - 0.5) * 20, this.y, i);
      let content = new Fruit({
        scene: this.scene,
        x: this.x + (Math.random() - 0.5) * 20,
        y: this.y,
        texture: this.boxContent,
        points: 100
      });
      content.body.setVelocity((Math.random() - 0.5) * 150, (Math.random() + 0.5) * 100);
      breakpart.body.setVelocity((Math.random() - 0.5) * 150, (Math.random() + 0.5) * -100);
      fruits.add(content);
      this.breakGroup.add(breakpart);
    }
  }
  public addScore(score: number): void {
    this.scene.registry.values.score += score;
    this.scene.events.emit('scoreChanged');
  }
}
class BreakBox extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  constructor(scene: Phaser.Scene, x: number, y: number, frame: number) {
    super(scene, x, y, 'breakbox', frame);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setSize(this.width * 0.45, this.height * 0.45);
  }
  update(): void {
    if (this.body && this.body.blocked.down)
      this.body.setVelocity(0, 0);
  }
  public flash(): void {
    this.alpha = 0;
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200,
      repeat: 5,
      onComplete: () => this.destroy()
    });
  }
}