class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);



        scene.add.existing(this);
    }

    update() {
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
    }
}