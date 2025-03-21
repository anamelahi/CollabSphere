import Phaser from "phaser";
import io from "socket.io-client";

class OfficeScene extends Phaser.Scene {
  constructor(socket) {
    super({ key: "OfficeScene" });
    this.socket = socket;
    this.players = {}; // Store all players
  }

  preload() {
    this.load.tilemapTiledJSON("office_map", "/assets/office2.json");
    this.load.spritesheet("avatar", "/assets/main-female.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.image("walls", "/assets/tileset_of_pokemon_xy_by_finalartz_d6gm33m.png");
    this.load.image("deskpc", "/assets/desk-with-pc.png");
    this.load.image("coffee-machine", "/assets/coffee-maker.png");
    this.load.image("plant1", "/assets/plant.png");
    this.load.image("trash", "/assets/Trash.png");
    this.load.image("kitchen", "/assets/sample_of_kitchen_tileset_by_ekat99_dd76rdn.png");
  }

  create() {
    console.log("OfficeScene is running...");

    const map = this.make.tilemap({ key: "office_map" });
    const tileset = map.addTilesetImage("sample_of_kitchen_tileset_by_ekat99_dd76rdn", "kitchen");
    const walls = map.addTilesetImage("tileset_of_pokemon_xy_by_finalartz_d6gm33m", "walls");
    const deskPc = map.addTilesetImage("desk-with-pc", "deskpc");
    const coffeeMachine = map.addTilesetImage("coffee-maker", "coffee-machine");
    const plant1 = map.addTilesetImage("plant", "plant1");

    const objects = [deskPc, coffeeMachine, plant1];

    const floorLayer = map.createLayer("Floor", tileset, 300, 100);
    const wallLayer = map.createLayer("walls-layer", walls, 300, 100);
    map.createLayer("desks", objects, 300, 100);
    const kitchenLayer = map.createLayer("kitchen", tileset, 300, 100);

    wallLayer.setCollisionByProperty({ collides: true });
    kitchenLayer.setCollisionByProperty({ collides: true });

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);
    this.cameras.main.setZoom(1);

    // Current player instance
    this.player = this.physics.add.sprite(550, 350, "avatar");
    this.physics.add.collider(this.player, kitchenLayer);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Emit new player event
    this.socket.emit("new-player", { x: this.player.x, y: this.player.y });

    // Listen for updates on connected players
    this.socket.on("update-users", (data) => {
      console.log("Users in space:", data.users);

      // Remove disconnected players
      Object.keys(this.players).forEach((userId) => {
        if (!data.users.includes(userId)) {
          this.players[userId].destroy();
          delete this.players[userId];
        }
      });

      // Add new players
      data.users.forEach((userId, index) => {
        if (!this.players[userId] && this.add) {
          this.players[userId] = this.add.sprite(100 + index * 50, 100, "avatar");
        }
      });
    });

    // Listen for player movement updates
    this.socket.on("player-move", ({ userId, x, y }) => {
      if (this.players[userId]) {
        this.players[userId].setPosition(x, y);
      }
    });

    // animations
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("avatar", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("avatar", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("avatar", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("avatar", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    const speed = 150;
    this.player.setVelocity(0);
    let moved = false;

    if (this.wasd.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("walk-left", true);
      moved = true;
    } else if (this.wasd.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("walk-right", true);
      moved = true;
    } else if (this.wasd.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play("walk-up", true);
      moved = true;
    } else if (this.wasd.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play("walk-down", true);
      moved = true;
    } else {
      this.player.anims.stop();
    }

    if (moved) {
      this.socket.emit("move-player", { x: this.player.x, y: this.player.y });
    }
  }
}

export default OfficeScene;
