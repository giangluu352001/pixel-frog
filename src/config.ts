import { BootScene } from './scenes/boot-scene';
import { GameScene } from './scenes/game-scene';
import { HUDScene } from './scenes/hud-scene';
import { MenuScene } from './scenes/menu-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Super Mario Land',
  width: 512,
  height: 288,
  type: Phaser.AUTO,
  zoom: 2,
  scene: [BootScene, MenuScene, HUDScene, GameScene],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true
    }
  },
  render: { pixelArt: true, antialias: false}
};
