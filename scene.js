import config from './config.js';

export default class extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
    // group with all active platforms.
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function(platform) {
        platform.scene.platformPool.add(platform);
      }
    });

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function(platform) {
        platform.scene.platformGroup.add(platform);
      }
    });

    // number of consecutive jumps made by the player
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(config.width, config.width / 2);

    // adding the player;
    this.player = this.physics.add.sprite(
      config.playerStartPosition,
      config.height / 2,
      "player"
    );
    this.player.setGravityY(config.playerGravity);

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);

    // checking for input
    this.input.on("pointerdown", this.jump, this);
  }

  // the core of the script: platform are added from the pool or created on the fly
  addPlatform(platformWidth, posX) {
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(
        posX,
        config.height * 0.8,
        "platform"
      );
      platform.setImmovable(true);
      platform.setVelocityX(-config.platformStartSpeed);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      config.spawnRange[0],
      config.spawnRange[1]
    );
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  jump() {
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0 && this.playerJumps < config.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(-config.jumpForce);
      this.playerJumps++;
    }
  }
  update() {
    // game over
    if (this.player.y > config.height) {
      this.scene.start("PlayGame");
    }
    this.player.x = config.playerStartPosition;

    // recycling platforms
    let minDistance = config.width;
    this.platformGroup.getChildren().forEach(function(platform) {
      const platformDistance = config.width - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      var nextPlatformWidth = Phaser.Math.Between(
        config.platformSizeRange[0],
        config.platformSizeRange[1]
      );
      this.addPlatform(
        nextPlatformWidth,
        config.width + nextPlatformWidth / 2
      );
    }
  }
}
