import config from "./config.js";
import Scene from "./scene.js";

new Phaser.Game({
  type: Phaser.AUTO,
  width: config.width,
  height: config.height,
  scene: Scene,
  backgroundColor: config.backgroundColor,
  physics: {
    default: "arcade"
  }
});
