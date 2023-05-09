class scene1 extends Phaser.Scene {
    constructor() {
        super('scene1');
        this.porte_unlock = false
    }

    init(data) {
        this.spawnx = data.x
        this.spawny = data.y
    }

    preload() {
        this.load.image("tileset", "assets/tileset.png");
        this.load.tilemapTiledJSON("map", "assets/scene.json");
        this.load.spritesheet('fourmi', 'assets/fourmi.png',
            { frameWidth: 41, frameHeight: 25 });
    }

    create() {

        this.map = this.add.tilemap("map");
        this.tileset = this.map.addTilesetImage(
            "tileset",
            "tileset"
        );
        this.background = this.map.createLayer(
            "background",
            this.tileset
        );
        this.solide = this.map.createLayer(
            "solide",
            this.tileset
        );
        this.porte = this.map.createLayer(
            "porte",
            this.tileset
        );
        this.clef = this.map.createLayer(
            "clef",
            this.tileset
        );

        this.player = this.physics.add.sprite(8 * 32, 0, "fourmi");
        this.solide.setCollisionByExclusion(-1, true);
        this.porte.setCollisionByExclusion(-1, true);
        this.clef.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, this.solide);
        this.collide_porte = this.physics.add.collider(this.player, this.porte);
        this.physics.add.collider(this.player, this.clef, this.getclef, null, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('fourmi', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('fourmi', { start: 2, end: 3 }),
            frameRate: 2,
            repeat: -1
        });


        this.cameras.main.zoom = 2;
        this.cameras.main.startFollow(this.player);

        this.clavier = this.input.keyboard.addKeys('Z,Q,D,S,I,E,A,SPACE');
        this.cursors = this.input.keyboard.createCursorKeys();
    }


    update() {
        if (this.clavier.D.isDown || this.cursors.right.isDown) {
            this.player.setVelocityX(100)
            this.player.anims.play("right",true)
        }
        else if (this.clavier.Q.isDown || this.cursors.left.isDown) {
            this.player.setVelocityX(-100)
            this.player.anims.play("left",true)
        }
        else {
            this.player.setVelocityX(0)
        }
        if ((this.clavier.SPACE.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-300)

        }

        if(this.porte_unlock == true ){
            this.collide_porte.active = false
        }
    }

    getclef(){
        this.porte_unlock = true
    }
}