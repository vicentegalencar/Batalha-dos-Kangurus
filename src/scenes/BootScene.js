import { createFighterAnimations, KANGAROO_SHEET } from '../utils/fighterAnimations.js';

export class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('arena-map', 'assets/mapa.png');
        this.load.spritesheet(KANGAROO_SHEET.key, KANGAROO_SHEET.path, {
            frameWidth: KANGAROO_SHEET.frameWidth,
            frameHeight: KANGAROO_SHEET.frameHeight
        });
    }

    create() {
        createFighterAnimations(this);
        this.scene.start('MenuScene');
    }

}
