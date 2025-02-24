import Phaser from "phaser";

class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: "OfficeScene" });
  }

  preload() {
    // Load the Tiled map JSON
    this.load.tilemapTiledJSON("office_map", "/assets/office2.json");

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
    map.createLayer("Floor", tileset, 300, 100);
    map.createLayer("walls-layer", walls, 300, 100);
    map.createLayer("desks", objects, 300, 100);
    map.createLayer("kitchen", tileset, 300, 100);

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

  }
}



export default OfficeScene;
