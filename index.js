import config from './config.js';
import Scene from './scene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  width: config.field.width,
  height: config.field.height,
  scene: Scene,
  backgroundColor: config.field.color,
  physics: {
    default: 'arcade',
  },
});
