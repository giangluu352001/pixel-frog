export function showAndAddScore(scene: Phaser.Scene, value: number, object: any): void {
    scene.registry.values.score += value;
    scene.events.emit('scoreChanged');
    let scoreText = scene.add
      .text(
        object.x,
        object.y - 20,
        `+${value.toString()}`,
        {fontSize: '10px'}
      ).setOrigin(0, 0);
    scene.add.tween({
      targets: scoreText,
      props: { y: scoreText.y - 25 },
      duration: 800,
      ease: 'Power0',
      yoyo: false,
      onComplete: () => scoreText.destroy()
    });
  }
export function transitionScene(scene: Phaser.Scene): void {
    let blocks = scene.add.group();
      blocks.createMultiple({
        key: 'transition',
        repeat: 80,
        setScale: {x: 0, y: 0},
      });
      blocks.setDepth(5);
      Phaser.Actions.GridAlign(blocks.getChildren(), {
          width: 14,
          cellWidth: 50,
          cellHeight: 50,
          x: 10,
          y: 20
      });
      let i = 0;
      blocks.children.iterate((child) => {
      scene.tweens.add({
          targets: child,
          scaleX: 2.5,
          scaleY: 2.5,
          _ease: 'Sine.easeInOut',
          ease: 'Power2',
          delay: i * 50,
          duration: 500,
          repeat: 0,
          yoyo: true,
          onComplete: () => child.destroy()
        });
        i++;
        if (i % 14 === 0) i = 0;
      });
}