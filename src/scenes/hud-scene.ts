import { transitionScene } from "../helpers/tween-helper";

export class HUDScene extends Phaser.Scene {
    private scoreText: Phaser.GameObjects.Text;
    private roomText: Phaser.GameObjects.Text;
    private previousButton: Phaser.GameObjects.Image;
    private nextButton: Phaser.GameObjects.Image;
    private container: Phaser.GameObjects.Container;
    constructor() {
      super({ key: 'HUDScene' });
    }
    create(): void {
      this.roomText = this.add.text(-100, -120, `Room ${this.registry.get('room')}`, { fontSize: '12px' });
      this.container = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
      this.scoreText = this.add.text(-10, -120, `Score ${this.registry.get('score')}`, { fontSize: '12px' });

      const level = this.scene.get('GameScene');
      level.events.on('scoreChanged', this.updateScore, this);

      transitionScene(this);
      this.scene.launch('GameScene');
      this.scene.sleep('GameScene');

      this.previousButton = this.add.image(170, -130, 'previous').setVisible(false);
      this.nextButton = this.add.image(190, -130, 'next');
      let restartButton = this.add.image(210, -130, 'restart');

      this.container.add(this.scoreText).add(this.previousButton)
      .add(this.nextButton).add(restartButton).add(this.roomText);
      this.container.setVisible(false);

      this.previousButton.setInteractive().on('pointerdown', () => this.changeRoom(level, -1));
      this.nextButton.setInteractive().on('pointerdown', () => this.changeRoom(level, 1));
      restartButton.setInteractive().on('pointerdown', () => this.changeRoom(level, 0));
      
      this.time.addEvent({
        delay: 800, 
        loop: false,
        callback: () => {
          this.container.setVisible(true);
          this.scene.stop('MenuScene');
          this.scene.wake('GameScene');
          this.scene.bringToTop('HUDScene');
        }
      });
    }
    private updateScore(): void {
      this.scoreText.setText(`Score ${this.registry.get('score')}`);
    }
    private updateRoom(): void {
      this.roomText.setText(`Room ${this.registry.get('room')}`);
    }
    private changeRoom(level: Phaser.Scene, val: number): void {
      this.registry.set('score', 0);
        this.registry.set('room', this.registry.get('room') + val);
        transitionScene(this);
        this.time.addEvent({
          delay: 800,
          loop: false,
          callback: () => {
            level.scene.restart();
            this.updateRoom();
            this.updateScore();
            if (this.registry.get('room') === 2) 
              this.nextButton.setVisible(false);
              else this.nextButton.setVisible(true);
            if (this.registry.get('room') !== 1) 
              this.previousButton.setVisible(true);
            else this.previousButton.setVisible(false);
          },
          callbackScope: this
        });
    }
  }