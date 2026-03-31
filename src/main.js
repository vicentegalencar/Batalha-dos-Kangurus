import { BootScene } from './scenes/BootScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { FightScene } from './scenes/FightScene.js';
import { GAME_CONFIG } from './utils/gameConfig.js';

function syncAppHeight() {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty('--app-height', `${Math.round(viewportHeight)}px`);
}

syncAppHeight();
window.addEventListener('resize', syncAppHeight);
window.visualViewport?.addEventListener('resize', syncAppHeight);

const config = {
    type: Phaser.AUTO,
    title: 'Batalha dos Cangurus',
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
    scene: [BootScene, IntroScene, MenuScene, FightScene]
};

new Phaser.Game(config);
            
