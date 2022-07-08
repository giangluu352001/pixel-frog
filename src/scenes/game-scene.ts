import { Box } from '../objects/box';
import { Brick } from '../objects/brick';
import { Collectible } from '../objects/collectible';
import { Goomba } from '../objects/goomba';
import { Mario } from '../objects/mario';
import { Portal } from '../objects/portal';

export class GameScene extends Phaser.Scene {
  // tilemap
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private backgroundLayer: Phaser.Tilemaps.TilemapLayer;
  private foregroundLayer: Phaser.Tilemaps.TilemapLayer;

  // game objects
  private boxes: Phaser.GameObjects.Group;
  private bricks: Phaser.GameObjects.Group;
  private collectibles: Phaser.GameObjects.Group;
  private enemies: Phaser.GameObjects.Group;
  private player: Mario;
  private portals: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'GameScene' });
  }
  create(): void {
    this.map = this.make.tilemap({ key: `level${this.registry.get('level')}` });
    this.tileset = this.map.addTilesetImage('tiles');
    this.backgroundLayer = this.map.createLayer('backgroundLayer', this.tileset, 0, 0);
    this.foregroundLayer = this.map.createLayer('foregroundLayer', this.tileset, 0, 0);
    this.foregroundLayer.setName('foregroundLayer').setCollisionByProperty({ collide: true });

    this.portals = this.add.group({ runChildUpdate: true });
    this.boxes = this.add.group({ runChildUpdate: true });
    this.bricks = this.add.group({ runChildUpdate: true });
    this.collectibles = this.add.group({ runChildUpdate: true });
    this.enemies = this.add.group({ runChildUpdate: true });
    this.loadObjectsFromTilemap();
    let fireballGroup = this.player.getFireballGroup();
   
    this.physics.add.collider(this.player, this.foregroundLayer);
    this.physics.add.collider(this.enemies, this.foregroundLayer);
    this.physics.add.collider(fireballGroup, this.foregroundLayer);
    this.physics.add.collider(this.enemies, this.boxes);
    this.physics.add.collider(this.enemies, this.bricks);
    this.physics.add.collider(this.player, this.bricks);
    this.physics.add.collider(this.player, this.boxes, this.playerHitBox);
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyOverlap);
    this.physics.add.overlap(this.player, this.portals, this.handlePlayerPortalOverlap);
    this.physics.add.overlap(this.player, this.collectibles, this.handlePlayerCollectiblesOverlap);
    this.physics.add.overlap(fireballGroup, this.enemies, this.handleFireEnemyOverlap);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update(): void {
    this.player.update();
  }
  private loadObjectsFromTilemap(): void {
    const objects = this.map.getObjectLayer('objects').objects as any[];
    objects.forEach((object) => {
      if (object.name === 'exit' || object.name === 'portal') {
        this.portals.add(
          new Portal({
            scene: this,
            x: object.x,
            y: object.y,
            height: object.width,
            width: object.height,
            spawn: {
              x: object.properties[1].value,
              y: object.properties[2].value,
              dir: object.properties[0].value
            }
          }).setName(object.name)
        );
      }

      if (object.name === 'player') {
        this.player = new Mario({
          scene: this,
          x: this.registry.get('spawn').x,
          y: this.registry.get('spawn').y,
          texture: 'mario'
        });
      }

      if (object.name === 'goomba') {
        this.enemies.add(
          new Goomba({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'goomba'
          })
        );
      }

      if (object.name === 'brick') {
        this.bricks.add(
          new Brick({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'brick',
            value: 50
          })
        );
      }

      if (object.name === 'box') {
        this.boxes.add(
          new Box({
            scene: this,
            content: object.properties[0].value,
            x: object.x,
            y: object.y,
            texture: 'box'
          })
        );
      }

      if (object.name === 'collectible') {
        this.collectibles.add(
          new Collectible({
            scene: this,
            x: object.x,
            y: object.y,
            texture: object.properties[0].value,
            points: 100
          })
        );
      }
    });
  }

  private handlePlayerEnemyOverlap = (player: Mario, enemy: Goomba): void => {
    if (player.body.touching.down && enemy.body.touching.up) {
      player.bounceUpAfterHitEnemyOnHead();
      enemy.gotHitOnHead();
      this.add.tween({
        targets: enemy,
        props: { alpha: 0 },
        duration: 1000,
        ease: 'Power0',
        yoyo: false,
        onComplete: () => enemy.isDead()
      });
    } else {
      if (player.getVulnerable()) player.gotHit();
    }
  }

  private handleFireEnemyOverlap = (player: Mario, enemy: Goomba): void => {
      enemy.isBurnt();
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.add.tween({
            targets: enemy,
            props: { alpha: 0 },
            duration: 1000,
            ease: 'Power0',
            yoyo: false,
            onComplete: () => enemy.isDead()
          });
        },
        callbackScope: this,
        loop: false
      });
  }

  private playerHitBox = (player: Mario, box: Box): void => {
    if (box.body.touching.down && box.active) {
      box.hitBottomBox();
      this.collectibles.add(box.spawnBoxContent());
      switch (box.getBoxContent()) {
        case 'coin':
        case 'rotatingCoin': 
          box.tweenBoxContent({ y: box.y - 100, alpha: 0 }, 700, 
          () => box.getContent().destroy());
          box.addCoinAndScore(1, 100);
          break;
        case 'flower':
          box.tweenBoxContent({ y: box.y - 8 }, 200,
          () => box.getContent().anims.play('flower'));
          break;
        case 'mushroom':
        case 'star':
          box.popUpCollectible();
          break;
        default: break;
      }
      box.startTween();
    }
  }

  private handlePlayerPortalOverlap = (player: Mario, portal: Portal): void => {
    if (
      (player.getKeys().get('DOWN').isDown &&
        portal.getPortalDestination().dir === 'down') ||
      (player.getKeys().get('RIGHT').isDown &&
        portal.getPortalDestination().dir === 'right')
    ) {
      this.registry.set('level', this.registry.get('level') + 1);
      this.registry.set('spawn', {
        x: portal.getPortalDestination().x,
        y: portal.getPortalDestination().y,
        dir: portal.getPortalDestination().dir
      });
      this.scene.restart();
    } else if (portal.name === 'exit') {
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.start('MenuScene');
    }
  }

  private handlePlayerCollectiblesOverlap = (player: Mario, collectible: Collectible): void => {
    switch (collectible.texture.key) {
      case 'flower': break;
      case 'mushroom':
        player.growMario();
        break;
      case 'star':
      case 'flower': 
        break;
      default: break;
    }
    collectible.collected();
  }
}
