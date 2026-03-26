import { createFighterAnimations, KANGAROO_SHEET } from '../utils/fighterAnimations.js';

export class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('arena-map', 'assets/mapa.png');
        this.load.image(KANGAROO_SHEET.key, KANGAROO_SHEET.path);
    }

    create() {
        createFighterAnimations(this);
        this.scene.start('IntroScene');
    }

}
