var monter = false // "ASCENSEUR"
var grimper = false  // UNLOCK CAPA GRIMPER
var candash = true
var planer = false

var surcorde = false
var inInv = false
var HP = 4
var distanceX
var distanceY
class scene1 extends Phaser.Scene {
    constructor() {
        super('scene1');
        this.porte_unlock = false
        this.invincible = false
        this.changedir = false
        this.isDashing = false
        this.CDdash = true

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
        this.load.image('abeille', 'assets/abeille.png');
        this.load.image("cloporte", "assets/ennemi_rampant.png");
        this.load.image("mante", "assets/ennemi_marchant.png");
        this.load.image("tileset", "assets/tileset.png");
        this.load.image("background", "assets/background_herbe.png");
        this.load.image("inv", "assets/inv.png");
        this.load.image("inv_left", "assets/inv_left.png");
        this.load.image("inv_right", "assets/inv_right.png");
        this.load.image("corde", "assets/corde.png");
        this.load.image("piege", "assets/piege.png");
        this.load.image("invisible", "assets/invisible.png");
        this.load.image("plateforme", "assets/plateforme.png");
        this.load.image("fleche_rouge", "assets/fleche.png");
        this.load.tilemapTiledJSON("map", "assets/scene.json");
        this.load.spritesheet('fourmi', 'assets/fourmi.png',
            { frameWidth: 41, frameHeight: 25 });
        this.load.spritesheet('vie', 'assets/vie.png',
            { frameWidth: 64, frameHeight: 14 });
    }

    create() {


        this.map = this.add.tilemap("map");
        this.tileset = this.map.addTilesetImage(
            "tileset",
            "tileset"
        );
        this.background_ciel = this.map.createLayer(
            "background_ciel",
            this.tileset
        );
        this.add.image(896 / 2, 448 / 2, "background").setScrollFactor(0.1)
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

        this.grppiege = this.physics.add.group({ immovable: true, allowGravity: false })
        this.piege = this.map.getObjectLayer("piege");
        this.piege.objects.forEach(coord => {
            this.grppiege.create(coord.x + 16, coord.y - 18, "piege");
        });

        this.grpcorde = this.physics.add.group({ immovable: true, allowGravity: false })
        this.corde = this.map.getObjectLayer("corde");
        this.corde.objects.forEach(coord => {
            this.grpcorde.create(coord.x + 16, coord.y - 16, "corde");
        });

        this.grpplateforme = this.physics.add.group({ immovable: true, allowGravity: false })
        this.plateforme = this.map.getObjectLayer("plateforme");
        this.plateforme.objects.forEach(coord => {
            this.grpplateforme.create(coord.x + 16, coord.y - 16, "plateforme");
        });

        this.grpmonter = this.physics.add.group({ immovable: true, allowGravity: false })
        this.monter = this.map.getObjectLayer("monter");
        this.monter.objects.forEach(coord => {
            this.grpmonter.create(coord.x + 16, coord.y).setVisible(false)
        });

        this.grphitbox_ennemi = this.physics.add.group({ immovable: true, allowGravity: false })
        this.hitbox_ennemi = this.map.getObjectLayer("hitbox_ennemi");
        this.hitbox_ennemi.objects.forEach(coord => {
            this.grphitbox_ennemi.create(coord.x + 16, coord.y - 16, "invisible");
        });

        this.grpennemi = this.physics.add.group({ immovable: true, allowGravity: false })
        this.ennemi = this.map.getObjectLayer("ennemi");
        this.ennemi.objects.forEach(coord => {
            this.grpennemi.create(coord.x + 16, coord.y - 16, "cloporte").setScale(0.5);
        });
        this.grpennemi.setVelocityX(20)
        this.grpennemi.getChildren().forEach(ennemi => {
            ennemi.changedir = false
        })
        this.physics.add.collider(this.grpennemi, this.grphitbox_ennemi, this.ChangeDirection, null, this)

        this.grpsalleboss = this.physics.add.group({ immovable: true, allowGravity: false })
        this.salleboss = this.map.getObjectLayer("salle_ennemi_boss");
        this.salleboss.objects.forEach(coord => {
            this.grpsalleboss.create(coord.x + 16, coord.y - 16, "invisible");
        });

        this.grpennemivolant = this.physics.add.group({ immovable: false, allowGravity: false })
        this.ennemivolant = this.map.getObjectLayer("ennemi volant");
        this.ennemivolant.objects.forEach(coord => {
            this.grpennemivolant.create(coord.x + 16, coord.y - 16, "abeille").setScale(0.5);
        });
        this.grpennemivolant.getChildren().forEach(ennemi => {
            ennemi.spawnx = ennemi.x
            ennemi.spawny = ennemi.y
            //this.grpennemivolant.getChildren().forEach(ennemi2 => {this.physics.add.collider(ennemi, ennemi2)})
        })
        this.physics.add.collider(this.grpennemivolant)


        this.grpboss = this.physics.add.group({ immovable: true })
        this.grpboss.create(-8 * 32, 38 * 32, "mante")

        if (this.spawnx && this.spawny) {
            this.player = this.physics.add.sprite(this.spawnx, this.spawny, "fourmi");
        }
        else {
            this.player = this.physics.add.sprite(8 * 32, 0, "fourmi")
        }

        this.fourmi_ouvriere = this.physics.add.sprite(-5 * 32, 11 * 32, "fourmi_ouvriere")//.body.setAllowGravity(false).setImmovable(true)

        this.boule = this.physics.add.sprite(4 * 32, -1 * 32, "boule").setCircle(32, 0, 0).setImmovable(true).setVelocityX(200)

        this.txt_ouvriere = this.add.text(this.fourmi_ouvriere.x, this.fourmi_ouvriere.y - 36, "Appuie sur E pour me recruter", { fill: '#ffffff', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: 32 }).setScale(0.5)
        this.vie = this.add.sprite(257, 120, "vie").setScrollFactor(0)


        this.solide.setCollisionByExclusion(-1, true);
        this.porte.setCollisionByExclusion(-1, true);
        this.clef.setCollisionByExclusion(-1, true);

        this.physics.add.collider(this.boule, this.solide);
        this.physics.add.collider(this.grpboss, this.boule);
        this.physics.add.collider(this.grpboss, this.solide);
        this.physics.add.collider(this.grpboss, this.player, this.damage, null, this);
        //ENNEMI VOLANT
        this.physics.add.collider(this.grpennemivolant, this.solide);
        this.physics.add.collider(this.grpennemivolant, this.player, this.damage, null, this);

        this.physics.add.collider(this.player, this.boule);
        this.physics.add.collider(this.player, this.solide);
        this.physics.add.overlap(this.player, this.grppiege, this.touchepiege, null, this);
        this.physics.add.collider(this.player, this.grpennemi, this.damage, null, this)
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
        // barre de vie
        this.anims.create({
            key: 'vie4',
            frames: this.anims.generateFrameNumbers('vie', { start: 0, end: 0 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'vie3',
            frames: this.anims.generateFrameNumbers('vie', { start: 1, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'vie2',
            frames: this.anims.generateFrameNumbers('vie', { start: 2, end: 3 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'vie1',
            frames: this.anims.generateFrameNumbers('vie', { start: 3, end: 3 }),
            frameRate: 2,
            repeat: -1
        });

        this.cameras.main.zoom = 2;
        this.cameras.main.startFollow(this.player);

        this.clavier = this.input.keyboard.addKeys('Z,Q,D,S,I,E,A,X,SPACE,TAB,SHIFT');
        this.cursors = this.input.keyboard.createCursorKeys();

        // INVENTAIRE
        this.image = this.add.image(652, 364, "inv")
        this.image.setScrollFactor(0).setScale(0.5).setVisible(false)

        this.fleche_left = this.add.image(450, 350, "inv_left")
        this.fleche_left.setScrollFactor(0).setScale(0.5).setVisible(false)
        this.fleche_left.setInteractive()
        this.fleche_left.on('pointerdown', this.onImageClicked, this);

        // CAMERA / MINI MAP
        this.cameramap = this.cameras.add().setVisible(false)
        this.cameramap.zoom = 0.1

        this.fleche_rouge = this.add.sprite(this.player.x, this.player.y, "fleche_rouge").setScale(3)
        this.cameras.main.ignore(this.fleche_rouge)
        this.cameramap.ignore(this.vie)
        //this.cameras.main.centerOn(this.player.x, this.player.y)
        //this.cameras.main.shake(200, 0.0005)
    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(this.clavier.SHIFT) && candash == true && this.CDdash == true) {
            this.isDashing = true
            this.CDdash = false
            this.player.body.allowGravity = false
            this.player.setVelocityY(0)
            console.log("pd")
            setTimeout(() => {
                this.isDashing = false
            }, 300);
            setTimeout(() => {
                this.CDdash = true
            }, 5000);
        }

        if (this.physics.overlap(this.player, this.grpsalleboss)) {
            console.log("salle boss")
            this.grpennemivolant.getChildren().forEach(ennemi =>
                ennemi.setVelocity(this.player.x - ennemi.x, this.player.y - ennemi.y))
        }
        else {
            this.grpennemivolant.getChildren().forEach(ennemi =>
                ennemi.setVelocity(ennemi.spawnx - ennemi.x, ennemi.spawny - ennemi.y))
        }


        this.fleche_rouge.x = this.player.x
        this.fleche_rouge.y = this.player.y - 60

        if (Phaser.Input.Keyboard.JustDown(this.clavier.TAB)) {
            this.cameramap.setVisible(true)

        }
        if (Phaser.Input.Keyboard.JustUp(this.clavier.TAB)) {
            this.cameramap.setVisible(false)

        }

        if (HP == 4) {
            this.vie.anims.play("vie4")
        }
        if (HP == 3) {
            this.vie.anims.play("vie3")
        }
        if (HP == 2) {
            this.vie.anims.play("vie2")
        }
        if (HP == 1) {
            this.vie.anims.play("vie1")
        }

        this.boule.setVelocityX(200)
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
        if (inInv) {

        }
        if (!inInv) {
            // DEPLACEMENT
            if (surcorde == false) {
                if (this.cursors.right.isDown) {
                    if (this.isDashing == true) {
                        this.player.setVelocityX(600)
                    }
                    else {
                        this.player.setVelocityX(300)
                        this.player.anims.play("right", true)
                    }


                }
                else if (this.cursors.left.isDown) {
                    if (this.isDashing == true) {
                        this.player.setVelocityX(-600)
                    }
                    else {
                        this.player.setVelocityX(-300)
                    }
                    this.player.anims.play("left", true)
                }
                else {

                    this.player.setVelocityX(0)
                    this.player.anims.stop()
                }
                if (this.cursors.up.isDown && this.player.body.onFloor()) {
                    this.player.setVelocityY(-400)
                }
                if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
                    if (this.player.body.onFloor()) {
                        this.collide_plateforme.active = false
                    }
                    else {
                        this.player.setVelocityY(300)
                    }
                }
                if ((Phaser.Input.Keyboard.JustUp(this.cursors.down))) {
                    this.collide_plateforme.active = true
                }
            }

            // MECANIQUE GRIMPER
            if (grimper == true) {
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
                    if (surcorde == false && monter == false && this.isDashing == false) {
                        this.player.body.allowGravity = true
                    }
                    this.player.angle = 0
                }
            }
            //GRIMPER CORDE

            if (this.physics.overlap(this.player, this.grpcorde)) {
                console.log("overlap")
                if (this.clavier.E.isDown && surcorde == false) {
                    this.player.body.allowGravity = false
                    surcorde = true

                    this.collide_plateforme.active = false

                }
            }
            else if (this.isDashing == false) {
                if (grimper == true && surcorde == true) {
                    this.player.body.allowGravity = true
                    // this.collide_plateforme.active = true
                }
                surcorde = false
                if (grimper == false && monter == false) {
                    this.player.body.allowGravity = true
                    // this.collide_plateforme.active = true
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
    ChangeDirection(ennemi, hitbox) {
        if (ennemi.changedir == false) {
            if (ennemi.body.velocity.x > 0) {
                ennemi.angle = 90
                ennemi.setVelocityX(0)
                ennemi.setVelocityY(100)
            }
            else if (ennemi.body.velocity.x < 0) {
                ennemi.angle = -90
                ennemi.setVelocityX(0)
                ennemi.setVelocityY(-100)
            }
            else if (ennemi.body.velocity.y < 0) {
                ennemi.angle = 0
                ennemi.setVelocityX(100)
                ennemi.setVelocityY(0)
            }
            else if (ennemi.body.velocity.y > 0) {
                ennemi.angle = 180
                ennemi.setVelocityX(-100)
                ennemi.setVelocityY(0)
            }
            ennemi.changedir = true
            setTimeout(() => {
                ennemi.changedir = false
            }, 800);
        }
    }

    damage() {
        if (this.invincible == false) {
            console.log("tu prends des degats")
            this.cameras.main.shake(200, 0.001)
            HP -= 1
            this.invincible = true
            this.player.setTint("#FFB6C1")
            setTimeout(() => {
                this.invincible = false
                this.player.clearTint()
            }, 1000);
        }
        if (HP <= 0) {
            console.log("t'es mort")
            this.scene.start("mort")
        }
    }
    onImageClicked() {
        console.log("ouais")
    }
    // OUVRIR PORTE 
    getclef() {
        this.porte_unlock = true
    }
    touchepiege() {
        if (this.invincible == false) {
            this.cameras.main.shake(200, 0.0005)
            console.log("tu prends des degats(piege)")
            HP -= 1
            this.invincible = true
            this.player.setTint("#FFB6C1")
            setTimeout(() => {
                this.invincible = false
                this.player.clearTint()
            }, 500);
        }

        if (HP <= 0) {
            console.log("t'es mort(piege)")
            this.scene.start("mort")
        }
    }

}