import Phaser from "phaser";

class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: "OfficeScene" });
  }

  preload() {
    // Load the Tiled map JSON
    this.load.tilemapTiledJSON("office_map", "/assets/office2.json");

    this.load.spritesheet("avatar","/assets/Characters_MV.png",{
      frameWidth:50,
      frameHeight:94,
    });

    // Load the tileset image used in Tiled
    // this.load.image("floor", "/assets/floor.png");
    this.load.image("walls", "/assets/tileset_of_pokemon_xy_by_finalartz_d6gm33m.png");
    this.load.image("coffee-machine", "/assets/coffee-maker.png");
    this.load.image("deskpc", "/assets/desk-with-pc.png");
    this.load.image("plant1", "assets/plant.png");
    this.load.image("trash", "assets/Trash.png");
    this.load.image('kitchen','assets/sample_of_kitchen_tileset_by_ekat99_dd76rdn.png')
    // this.load.image()
  }

  create() {
    const map = this.make.tilemap({ key: "office_map" });
   
    const tileset = map.addTilesetImage("sample_of_kitchen_tileset_by_ekat99_dd76rdn", "kitchen");
    const walls = map.addTilesetImage("tileset_of_pokemon_xy_by_finalartz_d6gm33m", "walls");
    const deskPc = map.addTilesetImage("desk-with-pc", "deskpc");
    const coffeeMachine = map.addTilesetImage("coffee-maker", "coffee-machine");
    const plant1 = map.addTilesetImage("plant", "plant1");

    // const walls = [tileset2, tileset3];
    const objects = [deskPc, coffeeMachine, plant1];
    const floorLayer = map.createLayer("Floor", tileset, 300, 100);
    const wallLayer = map.createLayer("walls-layer", walls, 300, 100);
    map.createLayer("desks", objects, 300, 100);
    const kitchenLayer = map.createLayer("kitchen", tileset, 300, 100);

    wallLayer.setCollisionByProperty({collides:true});
    kitchenLayer.setCollisionByProperty({collides:true});
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);

    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;
    const zoomX = screenWidth / mapWidth;
    const zoomY = screenHeight / mapHeight;
    const zoom = Math.min(zoomX, zoomY);

    this.cameras.main.setZoom(1);

    this.player = this.physics.add.sprite(550,350,"avatar");
    this.physics.add.collider(this.player,kitchenLayer);

    //sprite animation
    this.anims.create({
      key:"walk-down",
      frames:this.anims.generateFrameNumbers("avatar",{start:0,end:3}),
      frameRate:10,
      repeat:-1,
    });

    this.anims.create({
      key:"walk-left",
      frames:this.anims.generateFrameNumbers("avatar",{start:4,end:7}),
      frameRate:10,
      repeat:-1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("avatar", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("avatar", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    //keyboard shortcuts for movement
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }
  update() {
    // Player movement
    const speed = 150;
    this.player.setVelocity(0);

    if (this.wasd.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("walk-left", true);
    } else if (this.wasd.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("walk-right", true);
    } else if (this.wasd.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play("walk-up", true);
    } else if (this.wasd.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play("walk-down", true);
    } else {
      this.player.anims.stop();
    }
  }
}



export default OfficeScene;
