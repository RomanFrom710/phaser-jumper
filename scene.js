import config from './config.js';

export default class extends Phaser.Scene {
  create() {
    this._barrierGroup = this.physics.add.group();

    this._player = this.add.circle(
      config.player.x,
      config.field.height / 2,
      config.player.size,
      config.player.color,
    );
    this.physics.add.existing(this._player);
    this._player.body.setGravityY(config.player.gravity);

    this.input.on('pointerdown', this._jump, this);

    this.physics.add.collider(
      this._player,
      this._barrierGroup,
      this._handleGameOver,
      null,
      this, // C'mon guys, 5 arguments? This is not WinAPI.
    );
  }

  _jump() {
    this._player.body.setVelocityY(-config.player.jumpForce);
  }

  update() {
    const children = this._barrierGroup.getChildren();

    this._tryAddNewBarrier(children[children.length - 1]);

    const oldestBarrier = children[0];
    if (oldestBarrier.x < -config.barrier.width) {
      this._removeBarriers(children.slice(0, 2)); // Two oldest are top and bottom.
    }

    if (this._player.y > config.field.height || this._player.y < 0) {
      this._handleGameOver();
    }
  }

  _removeBarriers(barriers) {
    barriers.forEach((barrier) => this._barrierGroup.remove(barrier, true, true));
  }

  _handleGameOver() {
    this.scene.start();
  }

  _tryAddNewBarrier(lastBarrier) {
    if (lastBarrier && config.field.width - lastBarrier.x < config.barrier.distance) {
      return;
    }

    const holeHeight = config.hole.height;
    const holePosition = Phaser.Math.Between(0, config.field.height - holeHeight);
    this._addBarrier(holePosition, holeHeight);
  }

  _addBarrier(holePosition, holeHeight) {
    const topBarrier = this._addBarrierRectangle(0, holePosition);

    const bottomBarrierY = holePosition + holeHeight;
    const bottomBarrierHeight = config.field.height - bottomBarrierY;
    const bottomBarrier = this._addBarrierRectangle(bottomBarrierY, bottomBarrierHeight);

    this._barrierGroup
      .addMultiple([topBarrier, bottomBarrier])
      .setVelocityX(-config.barrier.speed);
  }

  _addBarrierRectangle(y, height) {
    return this.add.rectangle(
      config.field.width,
      y,
      config.barrier.width,
      height,
      config.barrier.color,
    ).setOrigin(0, 0)
  }
}
