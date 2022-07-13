import { Box } from '../objects/box';
import { Fruit } from '../objects/fruit';
import { Goomba } from '../objects/goomba';
import { Frog } from '../objects/frog';
import { Bar } from '../objects/bar';
import { Bullet } from '../objects/bullet';
import { Dart } from '../objects/dart';

export class GameScene extends Phaser.Scene {
  [x: string]: any;
  // tilemap
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private foregroundLayer: Phaser.Tilemaps.TilemapLayer;

  // game objects
  private boxes: Phaser.GameObjects.Group;
  private bars: Phaser.GameObjects.Group;
  private enemies: Phaser.GameObjects.Group;
  private player: Frog;
  private fruits: Phaser.GameObjects.Group;
  private darts: Phaser.GameObjects.Group;
  constructor() {
    super({ key: 'GameScene' });
  }
  preload(): void {
    /*this.load.scenePlugin({
      key: 'AnimatedTiles',
      url: 'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js',
      sceneKey: 'animatedTiles'
    });*/
  }
  create(): void {
    this.map = this.make.tilemap({ key: `room${this.registry.get('room')}` });
    this.tileset = this.map.addTilesetImage('tiles');
    this.map.createLayer('backgroundLayer', this.map.addTilesetImage('graybackground'), 0, 0);
    this.foregroundLayer = this.map.createLayer('foregroundLayer', this.tileset, 0, 0);
    this.foregroundLayer.setName('foregroundLayer').setCollisionByProperty({ collide: true }).setDepth(2);
    //this.animatedTiles.init(this.map);
    
    this.fruits = this.add.group({ runChildUpdate: true });
    this.boxes = this.add.group({ runChildUpdate: true });
    this.bars = this.add.group({ runChildUpdate: true });
    this.enemies = this.add.group({ runChildUpdate: true });
    this.darts = this.add.group({ runChildUpdate: true });
    this.loadObjectsFromTilemap();
    let dartGroup = this.player.getDartGroup();
    this.physics.add.collider(this.player, this.foregroundLayer);
    this.physics.add.collider(this.player, this.boxes, this.playerHitBox);
    this.physics.add.collider(this.player, this.bars);
    this.physics.add.collider(this.player, this.darts, this.player.gotHit);
    this.darts.getChildren().forEach((dart: Dart) => {
      if (dart.getDart())
        this.physics.add.collider(dart.getDart(), this.player, this.player.gotHit);
    });
    this.addCollideWithSolids(this.fruits);
    this.addCollideWithSolids(this.enemies);
    this.addCollideWithSolids(dartGroup);
    this.boxes.getChildren().forEach((box: Box) => 
    this.physics.add.collider(box.getBreakGroup(), this.foregroundLayer));
    this.physics.add.overlap(this.player, this.fruits, this.handleFruitsOverlap);
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyOverlap);
    this.physics.add.overlap(dartGroup, this.enemies, this.handleDartEnemyOverlap);
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }
  update(): void {
    this.player.update();
  }
  private addCollideWithSolids(objects: Phaser.GameObjects.Group) {
    this.physics.add.collider(objects, this.bars);
    this.physics.add.collider(objects, this.boxes);
    this.physics.add.collider(objects, this.foregroundLayer);
  }
  private loadObjectsFromTilemap(): void {
    const objects = this.map.getObjectLayer('objects').objects as any[];
    objects.forEach((object) => {
      if (object.name === 'player') {
        this.player = new Frog({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'frogidle'
        });
      }
      if (object.name === 'box') {
        this.boxes.add(
          new Box({
            scene: this,
            content: object.properties[0].value,
            x: object.x,
            y: object.y,
            texture: 'idlebox'
          })
        );
      }
      if (object.name === 'fruit') {
        this.fruits.add(
          new Fruit({
            scene: this,
            x: object.x,
            y: object.y,
            texture: object.properties[0].value,
            points: 100
          })
        );
      }
      if (object.name === 'bar') {
        this.bars.add(
          new Bar({
            scene: this,
            x: object.x,
            y: object.y,
            texture: object.properties[0].value,
          })
        );
      }
      if (object.name === 'goomba') {
        this.enemies.add(
          new Goomba({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'rungoomba',
          })
        );
      }
      if (object.name === 'dart') {
        this.darts.add(
          new Dart({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'darton',
          }, object.properties[0].value
        ));
      }
      if (object.name === 'chain') {
        this.add.image(
          object.x,
          object.y,
          'chain',
        );
      }
    });
  }

  private handlePlayerEnemyOverlap = (player: Frog, enemy: Goomba): void => {
    if (player.body.touching.down && enemy.body.touching.up) {
      this.cameras.main.shake(100, 0.01);
      player.bounceUpAfterHitEnemyOnHead();
      enemy.gotHit();
    } else player.gotHit();
  }

  private handleDartEnemyOverlap = (bullet: Bullet, enemy: Goomba): void => {
    enemy.gotHit();
    bullet.hit();
  }

  private playerHitBox = (player: Frog, box: Box): void => {
    if ((box.body.touching.down || box.body.touching.up) && box.active) {
      box.body.checkCollision.none = true;
      box.hitBottomBox(this.fruits);
    }
  }
  private handleFruitsOverlap = (player: Frog, fruit: Fruit): void => {
    fruit.body.checkCollision.none = true;
    fruit.collected();
  }
}
