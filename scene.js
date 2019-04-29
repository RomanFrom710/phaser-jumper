import config from './config.js';

export default class extends Phaser.Scene {
  create() {
    this.barrierGroup = this.physics.add.group();

    this.player = this.add.circle(
      config.playerStartPosition,
      config.height / 2,
      config.playerSize,
      config.playerColor
    );
    this.physics.add.existing(this.player);
    this.player.body.setGravityY(config.playerGravity);

    this.input.on('pointerdown', this.jump, this);

    this.physics.add.collider(
      this.player,
      this.barrierGroup,
      this.handleGameOver,
      null,
      this, // C'mon guys, 5 arguments? This is not WinAPI.
    );
  }

  update() {
    const children = this.barrierGroup.getChildren();
    const lastBarrier = children[children.length - 1];

    if (!lastBarrier || config.width - lastBarrier.x >= config.platformDistance) {
      this.addBarrier(Phaser.Math.Between(0, config.height - config.holeHeight), config.holeHeight);
    }

    if (children[0].x < 0) {
      this.barrierGroup.remove(children[0], true, true);
      this.barrierGroup.remove(children[0], true, true);
    }

    if (this.player.y > config.height || this.player.y < 0) {
      this.handleGameOver();
    }
  }

  addBarrier(holePosition, holeHeight) {
    const topBarrier = this.add.rectangle(
      config.width,
      0,
      config.platformWidth,
      holePosition,
      config.platformColor,
    ).setOrigin(0, 0);

    const bottomBarrier = this.add.rectangle(
      config.width,
      holePosition + holeHeight,
      config.platformWidth,
      config.height - holePosition - holeHeight,
      config.platformColor,
    ).setOrigin(0, 0);

    this.barrierGroup
      .addMultiple([topBarrier, bottomBarrier])
      .setVelocityX(-config.platformStartSpeed);
  }

  jump() {
    this.player.body.setVelocityY(-config.jumpForce);
  }

  handleGameOver() {
    this.scene.start();
  }
}
