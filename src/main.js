import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { FightScene } from './scenes/FightScene.js';
import { GAME_CONFIG } from './utils/gameConfig.js';

const config = {
    type: Phaser.AUTO,
    title: 'Batalha dos Kangurus',
    parent: 'game-container',
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    backgroundColor: GAME_CONFIG.backgroundColor,
    pixelArt: false,
    roundPixels: true,
    input: {
        activePointers: 5
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GAME_CONFIG.gravityY },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, MenuScene, FightScene]
};

new Phaser.Game(config);
            
