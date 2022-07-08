export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  constructor() {
    super({ key: 'MenuScene' });
  }
  init(): void {
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.initGlobalDataManager();
  }
  create(): void {
    this.add.image(0, 0, 'title').setOrigin(0, 0);
    this.add.text(220, 200, 'START', { fontFamily: 'Arial', fontSize: '20px', color: '#00ff00' });
  }
  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('HUDScene');
      this.scene.start('GameScene');
      this.scene.bringToTop('HUDScene');
    }
  }
  private initGlobalDataManager(): void {
    this.registry.set('time', 300);
    this.registry.set('level', 1);
    this.registry.set('world', '1-1');
    this.registry.set('worldTime', 'WORLD TIME');
    this.registry.set('score', 0);
    this.registry.set('coins', 0);
    this.registry.set('lives', 2);
    this.registry.set('spawn', { x: 39.5, y: 64.5, dir: 'down' });
    this.registry.set('marioSize', 'small');
  }
}
