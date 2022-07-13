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
    this.add.image(0, 0, 'title').setOrigin(0.5, 0.5).setScale(0.5).
    setX(this.cameras.main.width / 2).setY(this.cameras.main.height / 2);
    this.add.text(220, 200, 'START', { fontSize: '20px' });
    this.scene.launch('HUDScene');
    this.scene.sleep('HUDScene');
  }
  update(): void {
    if (this.startKey.isDown)
      this.scene.wake('HUDScene');
  }
  private initGlobalDataManager(): void {
    this.registry.set('room', 1);
    this.registry.set('score', 0);
  }
}
