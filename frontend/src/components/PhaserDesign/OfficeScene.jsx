import Phaser from "phaser";

class OfficeScene extends Phaser.Scene {
    constructor(socket, spaceId, userId) {
        super({ key: "OfficeScene" });
        this.socket = socket;
        this.spaceId = spaceId;
        this.userId = userId;
        this.players = {}; // Stores player sprites by userId
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

        // Set up the tilemap
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

        // Set camera bounds
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        this.cameras.main.setBounds(0, 0, mapWidth + 600, mapHeight + 200);
        this.cameras.main.setZoom(1);

        // Create the current player's sprite
        this.player = this.physics.add.sprite(550, 350, "avatar");
        this.physics.add.collider(this.player, kitchenLayer);
        this.physics.add.collider(this.player, wallLayer);
        this.players[this.userId] = this.player; // Add current player to players object

        // Camera follows the current player
        this.cameras.main.startFollow(this.player);

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Emit join-space event to the server
        this.socket.emit("join-space", { spaceId: this.spaceId, userId: this.userId });

        // Handle initial players data from the server
        this.socket.on("init-players", (players) => {
            console.log("Initial players:", players);
            for (const [userId, position] of Object.entries(players)) {
                if (userId !== this.userId) {
                    this.players[userId] = this.physics.add.sprite(position.x, position.y, "avatar");
                    this.physics.add.collider(this.players[userId], kitchenLayer);
                    this.physics.add.collider(this.players[userId], wallLayer);
                }
            }
        });

        // Handle updates to the user list (players joining/leaving)
        this.socket.on("update-users", (data) => {
            console.log("Users in space:", data.users);

            // Add new players who joined after this client
            data.users.forEach((userId) => {
                if (userId !== this.userId && !this.players[userId]) {
                    this.players[userId] = this.physics.add.sprite(550, 350, "avatar");
                    this.physics.add.collider(this.players[userId], kitchenLayer);
                    this.physics.add.collider(this.players[userId], wallLayer);
                }
            });

            // Remove players who disconnected
            Object.keys(this.players).forEach((userId) => {
                if (userId !== this.userId && !data.users.includes(userId)) {
                    this.players[userId].destroy();
                    delete this.players[userId];
                }
            });
        });

        // Handle player movement updates from other clients
        this.socket.on("player-move", ({ userId, x, y }) => {
            if (userId !== this.userId && this.players[userId]) {
                this.players[userId].setPosition(x, y);
            }
        });

        // Define animations
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

        // Handle player movement with WASD keys
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

        // Emit movement updates to the server
        if (moved) {
            this.socket.emit("move-player", { x: this.player.x, y: this.player.y });
        }
    }
}

export default OfficeScene;