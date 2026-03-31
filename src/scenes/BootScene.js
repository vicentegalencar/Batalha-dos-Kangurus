import { createFighterAnimations, KANGAROO_SHEETS } from '../utils/fighterAnimations.js';

export class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('arena-map', 'assets/mapa.png');
        this.load.audio('bgm', 'assets/music.mp3');
        Object.values(KANGAROO_SHEETS).forEach((sheet) => {
            this.load.image(sheet.key, sheet.path);
        });
    }

    create() {
        createFighterAnimations(this);
        this.scene.start('IntroScene');
    }

}
