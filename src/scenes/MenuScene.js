import { GAME_CONFIG, MODES } from '../utils/gameConfig.js';
import { isMobileLike } from '../utils/device.js';

export class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    create() {
        this.isMobile = isMobileLike(this);
        this.createBackground();
        this.createTitle();
        this.createOptions();
        this.createControlsPanel();

        this.keys = this.input.keyboard.addKeys({
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO
        });
    }

    createBackground() {
        const { width, height } = GAME_CONFIG;

        if (this.textures.exists('arena-map')) {
            this.add.image(width / 2, height / 2, 'arena-map')
                .setDisplaySize(width, height);
        }

        this.add.rectangle(width / 2, height / 2, width, height, 0x081622, 0.74);
        this.add.circle(width / 2, 120, 160, 0xf2b25f, 0.12);
        this.add.rectangle(width / 2, 336, 860, 420, 0x122131, 0.7)
            .setStrokeStyle(2, 0xf1d39d, 0.92);
        this.add.rectangle(width / 2, 336, 810, 370, 0x0c1724, 0.28);
    }

    createTitle() {
        const centerX = GAME_CONFIG.width / 2;

        this.add.text(centerX, 94, 'BATALHA DOS CANGURUS', {
            fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#fff2d7',
            stroke: '#3a2116',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5).setShadow(0, 6, '#000000', 12, true, true);

        this.add.text(centerX, 148, 'luta arcade local com controles rapidos e leitura limpa', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#d9e7f3',
            letterSpacing: 1
        }).setOrigin(0.5);
    }

    createOptions() {
        if (this.isMobile) {
            this.createOptionCard(306, 'Jogar no Celular', 'controles na tela e luta contra CPU', MODES.CPU, null);

            this.add.text(GAME_CONFIG.width / 2, 424, 'Modo mobile prioriza uma partida clara e confortavel em paisagem.', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '21px',
                color: '#e3edf5',
                align: 'center',
                wordWrap: { width: 760 }
            }).setOrigin(0.5);

            var prompt = this.add.text(GAME_CONFIG.width / 2, 486, 'Toque para iniciar', {
                fontFamily: '"Palatino Linotype", Georgia, serif',
                fontSize: '24px',
                color: '#f6ddb2'
            }).setOrigin(0.5);
        } else {
            this.createOptionCard(286, '1. Jogador vs Jogador', 'duelo local no mesmo teclado', MODES.PVP, '1');
            this.createOptionCard(392, '2. Jogador vs CPU', 'treino rapido contra a IA', MODES.CPU, '2');

            var prompt = this.add.text(GAME_CONFIG.width / 2, 480, 'Pressione 1 ou 2', {
                fontFamily: '"Palatino Linotype", Georgia, serif',
                fontSize: '24px',
                color: '#f6ddb2'
            }).setOrigin(0.5);
        }

        this.tweens.add({
            targets: prompt,
            alpha: 0.35,
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    }

    createOptionCard(y, title, subtitle, mode, hotkey) {
        const centerX = GAME_CONFIG.width / 2;
        const card = this.add.rectangle(centerX, y, 520, 78, 0x102131, 0.88)
            .setStrokeStyle(2, 0xf0d59d, 0.95)
            .setInteractive({ useHandCursor: true });

        const accent = this.add.rectangle(centerX - 224, y, 8, 52, 0xe08c55, 1);
        this.add.text(centerX - 196, y - 12, title, {
            fontFamily: '"Palatino Linotype", Georgia, serif',
            fontSize: '28px',
            color: '#fff3da'
        }).setOrigin(0, 0.5);

        this.add.text(centerX - 196, y + 16, subtitle, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#d7e4ef'
        }).setOrigin(0, 0.5);

        if (hotkey) {
            this.add.text(centerX + 218, y, hotkey, {
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: '28px',
                color: '#f0d59d'
            }).setOrigin(0.5);
        }

        card.on('pointerover', () => {
            card.setFillStyle(0x173048, 0.95);
            accent.setFillStyle(0xf0b46a, 1);
        });

        card.on('pointerout', () => {
            card.setFillStyle(0x102131, 0.88);
            accent.setFillStyle(0xe08c55, 1);
        });

        card.on('pointerdown', () => {
            this.startMatch(mode);
        });
    }

    createControlsPanel() {
        if (this.isMobile) {
            this.add.rectangle(GAME_CONFIG.width / 2, 626, 860, 104, 0x102131, 0.84)
                .setStrokeStyle(2, 0xf1d39d, 0.92);

            this.add.text(GAME_CONFIG.width / 2, 602, 'Paisagem recomendada\nmovimento, pulo, soco forte e chute ficam na tela.', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '22px',
                color: '#e6eef6',
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5);

            return;
        }

        const controls = [
            'P1  A/D mover   W pular   G soco forte   H chute',
            'P2  <-/-> mover   ^ pular   L soco forte   ; chute'
        ];

        this.add.rectangle(GAME_CONFIG.width / 2, 626, 880, 112, 0x102131, 0.84)
            .setStrokeStyle(2, 0xf1d39d, 0.92);

        this.add.text(GAME_CONFIG.width / 2, 604, controls.join('\n'), {
            fontFamily: 'Arial, sans-serif',
            fontSize: '19px',
            color: '#e6eef6',
            align: 'center',
            lineSpacing: 12
        }).setOrigin(0.5);
    }

    startMatch(mode) {
        this.scene.start('FightScene', { mode });
    }

    update() {
        if (this.isMobile) {
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
            this.startMatch(MODES.PVP);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.two)) {
            this.startMatch(MODES.CPU);
        }
    }

}
