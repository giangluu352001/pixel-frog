import { AnimationHelper } from "../helpers/animation-helper";

export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private loadingText: Phaser.GameObjects.Text;
  private percentText: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'BootScene' });
  }
  preload(): void {
    this.cameras.main.setBackgroundColor(0x0000);
    this.createLoadingGraphics();
    this.load.on('progress', (value: number) => {
        this.percentText.setText((Math.floor(value) * 100).toString() + '%');
        this.progressBar.clear();
        this.progressBar.fillStyle(0x32CD32, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          8
        );
      }, this);
    this.load.on('complete', () => {
        new AnimationHelper(this, this.cache.json.get('animationJSON'));
        this.progressBar.destroy();
        this.loadingBar.destroy();
        this.loadingText.destroy();
        this.percentText.destroy();
        this.scene.start('MenuScene');
      }, this);
    this.load.pack('preload', './assets/pack.json', 'preload');
  }
  private createLoadingGraphics(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x222222, 1);
    this.loadingBar.fillRect( 
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      12
    );
    this.progressBar = this.add.graphics();
    this.loadingText = this.add.text(
      this.cameras.main.width / 2 - 15,
      this.cameras.main.height / 2,
      'Loading...',
      {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#ffffff'
      }
    );
    this.percentText = this.add.text(
      this.cameras.main.width / 2 - 10,
      this.cameras.main.height / 2 - 16,
      '0%',
      {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#ffffff'
      }
    );
  }
}
