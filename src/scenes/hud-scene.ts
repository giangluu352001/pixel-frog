export class HUDScene extends Phaser.Scene {
  private liveText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private coinsText: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'HUDScene' });
  }
  create(): void {
    this.liveText = this.add.text(0, 0, `MARIOx ${this.registry.get('lives')}`, { color: '#000066' });
    this.add.text(120, 0, `${this.registry.get('worldTime')}`, { color: '#000066' });
    this.scoreText = this.add.text(20, 15, `${this.registry.get('score')}`, { color: '#000066' });
    this.coinsText = this.add.text(90, 15, `${this.registry.get('coins')}`, { color: '#000066' });
    this.add.text(130, 15, `${this.registry.get('world')}`, { color: '#000066' });
    this.timeText = this.add.text(180, 15, `${this.registry.get('time')}`, { color: '#000066' });
    const level = this.scene.get('GameScene');
    level.events.on('coinsChanged', this.updateCoins, this);
    level.events.on('scoreChanged', this.updateScore, this);
    level.events.on('livesChanged', this.updateLives, this);
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true
    });
  }
  private updateTime(): void {
    this.registry.values.time -= 1;
    this.timeText.setText(`${this.registry.get('time')}`);
  }
  private updateCoins(): void {
    this.coinsText.setText(`${this.registry.get('coins')}`);
  }
  private updateScore(): void {
    this.scoreText.setText(`${this.registry.get('score')}`);
  }
  private updateLives(): void {
    this.liveText.setText(`Lives: ${this.registry.get('lives')}`);
  }
}
