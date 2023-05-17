var monter = false
var grimper = false
var surcorde = false
var inInv = false
var distanceX
var distanceY
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
        this.load.spritesheet('fourmi_soldat', 'assets/fourmi_soldat.png',
            { frameWidth: 41, frameHeight: 25 });
        //this.load.spritesheet('fourmi_ouvriere', 'assets/fourmi_ouvriere.png',
        //    { frameWidth: 41, frameHeight: 25 });
        this.load.spritesheet('fourmi_ouvriere', 'assets/fourmi_ouvriere.png',
            { frameWidth: 41, frameHeight: 25 });
        this.load.image('boule', 'assets/boule.png');
        this.load.image("tileset", "assets/tileset.png");
        this.load.image("inv", "assets/inv.png");
        this.load.image("inv_left", "assets/inv_left.png");
        this.load.image("inv_right", "assets/inv_right.png");
        this.load.image("corde", "assets/corde.png");
        this.load.image("plateforme", "assets/plateforme.png");
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
        this.surbackground = this.map.createLayer(
            "surbackground",
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

        this.grpcorde = this.physics.add.group({ immovable: true, allowGravity: false })
        this.corde = this.map.getObjectLayer("corde");
        this.corde.objects.forEach(coord => {
            this.grpcorde.create(coord.x + 16, coord.y, "corde");
        });

        this.grpplateforme = this.physics.add.group({ immovable: true, allowGravity: false })
        this.plateforme = this.map.getObjectLayer("plateforme");
        this.plateforme.objects.forEach(coord => {
            this.grpplateforme.create(coord.x + 16, coord.y, "plateforme");
        });

        this.grpmonter = this.physics.add.group({ immovable: true, allowGravity: false })
        this.monter = this.map.getObjectLayer("monter");
        this.monter.objects.forEach(coord => {
            this.grpmonter.create(coord.x + 16, coord.y).setVisible(false)
        });

        if (this.spawnx && this.spawny) {
            this.player = this.physics.add.sprite(this.spawnx, this.spawny, "fourmi");
        }
        else {
            this.player = this.physics.add.sprite(8 * 32, 0, "fourmi")
        }

        this.fourmi_ouvriere = this.physics.add.sprite(-5 * 32, 11 * 32, "fourmi_ouvriere")//.body.setAllowGravity(false).setImmovable(true)

        this.boule = this.physics.add.sprite(4 * 32, -1 * 32, "boule").setCircle(32, 0, 0).setImmovable(true).setVelocityX(200)

        this.txt_ouvriere = this.add.text(this.fourmi_ouvriere.x, this.fourmi_ouvriere.y - 36, "Appuie sur E pour me recruter", { fill: '#ffffff', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: 32 }).setScale(0.5)


        this.solide.setCollisionByExclusion(-1, true);
        this.porte.setCollisionByExclusion(-1, true);
        this.clef.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.boule, this.solide);
        this.physics.add.collider(this.player, this.boule);
        this.physics.add.collider(this.player, this.solide);
        this.physics.add.collider(this.fourmi_ouvriere, this.solide); // TODO
        this.collide_porte = this.physics.add.collider(this.player, this.porte);
        this.physics.add.overlap(this.player, this.clef, this.getclef, null, this);
        this.collide_plateforme = this.physics.add.collider(this.player, this.grpplateforme);

        //fourmi ouvriere
        this.anims.create({
            key: 'ouvriere_left',
            frames: this.anims.generateFrameNumbers('fourmi_ouvriere', { start: 0, end: 0 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'ouvriere_right',
            frames: this.anims.generateFrameNumbers('fourmi_ouvriere', { start: 2, end: 2 }),
            frameRate: 2,
            repeat: -1
        });
        //fourmi normale 
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

        this.clavier = this.input.keyboard.addKeys('Z,Q,D,S,I,E,A,X,SPACE');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.image = this.add.image(652, 364, "inv")
        this.image.setScrollFactor(0).setScale(0.5).setVisible(false)

        this.fleche_left = this.add.image(450, 350, "inv_left")
        this.fleche_left.setScrollFactor(0).setScale(0.5).setVisible(false)
        this.fleche_left.setInteractive()

        this.fleche_left.on('pointerdown', this.onImageClicked, this);


       // this.cameras.main.centerOn(this.player.x, this.player.y)

    }


    update() { 
        if (Phaser.Input.Keyboard.JustDown(this.clavier.I)) {
            if (!inInv) {
                console.log("Ca entre");
                inInv = true;
                this.image.setVisible(true);
                this.fleche_left.setVisible(true);

            } else {
                console.log("Ca sort");
                inInv = false;
                this.image.setVisible(false);
                this.fleche_left.setVisible(false);
            }
        }
        if(inInv){

        }

        if (!inInv) {
            // DEPLACEMENT
            if (surcorde == false) {
                if (this.cursors.right.isDown) {
                    this.player.setVelocityX(300)
                    this.player.anims.play("right", true)
                }
                else if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-300)
                    this.player.anims.play("left", true)
                }
                else {
                    this.player.setVelocityX(0)
                    this.player.anims.stop()
                }
                if (this.cursors.up.isDown && this.player.body.onFloor()) {
                    this.player.setVelocityY(-300)
                }
            }

            // MECANIQUE GRIMPER
            if (grimper == true) {
                this.collide_plateforme.active = false
                if (this.player.body.blocked.left) {
                    this.player.body.allowGravity = false
                    this.player.setVelocityY(0)
                    this.player.angle = 90
                    if (this.cursors.up.isDown) {
                        this.player.setVelocityY(-100)
                        this.player.anims.play("left", true)
                    }
                    if (this.cursors.down.isDown) {
                        this.player.setVelocityY(100)
                        this.player.anims.play("right", true)
                    }
                }
                else if (this.player.body.blocked.right) {
                    this.player.body.allowGravity = false
                    this.player.setVelocityY(0)
                    this.player.angle = -90
                    if (this.cursors.up.isDown) {
                        this.player.setVelocityY(-100)
                        this.player.anims.play("right", true)
                    }
                    if (this.cursors.down.isDown) {
                        this.player.setVelocityY(100)
                        this.player.anims.play("left", true)
                    }
                }
                else {
                    if (surcorde == false && monter == false) {
                        this.player.body.allowGravity = true
                    }
                    this.player.angle = 0
                }
            }
            else { this.collide_plateforme.active = true }
            //GRIMPER CORDE

            if (this.physics.overlap(this.player, this.grpcorde)) {
                console.log("overlap")
                if (this.clavier.E.isDown && surcorde == false) {
                    this.player.body.allowGravity = false
                    surcorde = true

                    this.collide_plateforme.active = false

                }
            }
            else {
                if (grimper == true && surcorde == true) {
                    this.player.body.allowGravity = true
                    this.collide_plateforme.active = true
                }
                surcorde = false
                if (grimper == false && monter == false) {
                    this.player.body.allowGravity = true
                    this.collide_plateforme.active = true
                }

            }

            if (surcorde == true) {

                this.player.setVelocityY(0)
                if (this.cursors.up.isDown) {
                    this.player.setVelocityY(-100)
                }
                if (this.cursors.down.isDown) {
                    this.player.setVelocityY(100)
                }
                if (this.clavier.SPACE.isDown) {
                    console.log("sortie")
                    surcorde = false
                    this.player.body.allowGravity = true
                    this.collide_plateforme.active = true
                }
            }

            // MONTER 
            if (this.physics.overlap(this.player, this.grpmonter) && monter == false) {
                if (this.clavier.SPACE.isDown) {
                    this.player.body.allowGravity = false
                    this.player.setVelocityY(-200)
                    monter = true

                    setTimeout(() => {
                        this.player.body.allowGravity = true
                        this.player.setVelocityY(0)
                        monter = false
                    }, 2000);
                }
            }
            if (this.player.body.blocked.up && monter == true) {
                this.player.body.allowGravity = true
                this.player.setVelocityY(0)
            }

            // OUVRIR PORTE
            if (this.porte_unlock == true) {
                this.collide_porte.active = false
            }


            // RECRUTER FOURMI OUVRIERE
            if (this.player.x > this.fourmi_ouvriere.x) {
                this.fourmi_ouvriere.anims.play("ouvriere_right")
            }
            else {
                this.fourmi_ouvriere.anims.play("ouvriere_left")
            }

            if (this.physics.overlap(this.player, this.fourmi_ouvriere)) {
                if (grimper == false) {
                    this.txt_ouvriere.setVisible(true)
                }
                if (this.clavier.E.isDown) {
                    this.txt_ouvriere.text = 'Tu as maintenant la capacité de grimper aux murs, tu pourras me retrouver en haut'

                    setTimeout(() => {
                        grimper = true
                        this.fourmi_ouvriere.x = 8 * 32
                        this.fourmi_ouvriere.y = 0
                        // TODO CAMERA FLASH EFFECT 
                    }, 2000);
                }
            }
            else {
                this.txt_ouvriere.setVisible(false)
            }
        }
    }


    onImageClicked() {
        console.log("ouais")
    }
    // OUVRIR PORTE 
    getclef() {
        this.porte_unlock = true
    }
}