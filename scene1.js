var grimper = false
var surcorde = false
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
        this.load.image('fourmi_ouvriere', 'assets/fourmi_ouvriere.png');
        this.load.image("tileset", "assets/tileset.png");
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
            this.grpcorde.create(coord.x+16 , coord.y , "corde");
        });

        this.grpplateforme = this.physics.add.group({ immovable: true, allowGravity: false })
        this.plateforme = this.map.getObjectLayer("plateforme");
        this.plateforme.objects.forEach(coord => {
            this.grpplateforme.create(coord.x+16 , coord.y , "plateforme");
        });

        this.fourmi_ouvriere = this.physics.add.sprite(-5 * 32, 11*32, "fourmi_ouvriere").body.setAllowGravity(false).setImmovable(true)
        if (this.spawnx && this.spawny) {
            this.player = this.physics.add.sprite(this.spawnx, this.spawny, "fourmi");
        }
        else {
            this.player = this.physics.add.sprite(8 * 32, 0, "fourmi")
        }
         
        


        this.solide.setCollisionByExclusion(-1, true);
        this.porte.setCollisionByExclusion(-1, true);
        this.clef.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, this.solide);
        this.physics.add.collider(this.player, this.fourmi_ouvriere);
        this.collide_porte = this.physics.add.collider(this.player, this.porte);
        this.physics.add.overlap(this.player, this.clef, this.getclef, null, this);
        this.collide_plateforme = this.physics.add.collider(this.player, this.grpplateforme);

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
        // DEPLACEMENT
        if (surcorde == false) {
            if (this.cursors.right.isDown) {
                this.player.setVelocityX(100)
                this.player.anims.play("right", true)
            }
            else if (this.cursors.left.isDown) {
                this.player.setVelocityX(-100)
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
                if(surcorde==false){
                this.player.body.allowGravity = true}
                this.player.angle = 0
            }
        }
        //GRIMPER CORDE

        if (this.physics.overlap(this.player, this.grpcorde)) {
            console.log("overlap")
            if (this.clavier.E.isDown && surcorde==false) {
                this.player.body.allowGravity = false
                surcorde = true
                console.log("sur la corde")
                this.collide_plateforme.active = false
        
            }
        }
        else{
            if(grimper==true && surcorde==true){
                this.player.body.allowGravity = true
                this.collide_plateforme.active = true
            }
            surcorde = false
            if(grimper==false){
                this.player.body.allowGravity = true
                this.collide_plateforme.active = true
            }
            console.log("pas sur corde")
        }

        if (surcorde == true) {
            
            this.player.setVelocityY(0)
            if (this.cursors.up.isDown){
                this.player.setVelocityY(-100)
            }
            if (this.cursors.down.isDown){
                this.player.setVelocityY(100)
            }
            if(this.clavier.SPACE.isDown){
                console.log("sortie")
                surcorde=false
                this.player.body.allowGravity = true
                this.collide_plateforme.active = true
            }
        }

        // OUVRIR PORTE
        if (this.porte_unlock == true) {
            this.collide_porte.active = false
        }


        // OBTENIR CAPACITE FOURMI OUVRIERE
        if (this.physics.overlap(this.player, this.fourmi_ouvriere)){
            console.log("test")
            this.add.text(this.fourmi_ouvriere.x, this.fourmi_ouvriere.y, "Appuie sur E pour me recruter", { fill: '#000000', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: 30 }) 
        }
    }



    // OUVRIR PORTE 
    getclef() {
        this.porte_unlock = true
    }
}