import config from "./config.js";
import Scene from "./scene.js";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: config.width,
  height: config.height,
  scene: Scene,
  backgroundColor: config.background,
  physics: {
    default: "arcade"
  }
});
