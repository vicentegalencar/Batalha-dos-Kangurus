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

        this.add.rectangle(width / 2, height / 2, width, height, 0x261327);
        this.add.circle(width / 2, 160, 130, 0xf7b267, 1);
        this.add.ellipse(width / 2, height - 110, width * 1.25, 220, 0x59311f, 1);

        const skyline = this.add.graphics();
        skyline.fillStyle(0x8c4b2a, 1);
        skyline.fillTriangle(40, 530, 260, 250, 420, 530);
        skyline.fillTriangle(300, 530, 520, 220, 700, 530);
        skyline.fillTriangle(620, 530, 860, 260, 1040, 530);
        skyline.fillTriangle(900, 530, 1120, 210, 1240, 530);

        const floor = this.add.graphics();
        floor.fillStyle(0x3f6b34, 1);
        floor.fillRect(0, 560, width, 160);
        floor.fillStyle(0x6f4f28, 1);
        floor.fillRect(0, 548, width, 18);
    }

    createTitle() {
        const centerX = GAME_CONFIG.width / 2;

        this.add.text(centerX, 96, 'BATALHA DOS KANGURUS', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '44px',
            color: '#fff6db',
            stroke: '#4b1f18',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, 152, 'MVP arcade 2D local para testes rapidos', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffe2a6'
        }).setOrigin(0.5);
    }

    createOptions() {
        if (this.isMobile) {
            this.createOption(338, 'Jogar no Celular', MODES.CPU, 38, { left: 34, right: 34, top: 22, bottom: 22 });

            this.add.text(GAME_CONFIG.width / 2, 430, 'Modo mobile usa controles na tela e prioriza Jogador vs CPU.', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '22px',
                color: '#fff6db',
                align: 'center',
                wordWrap: { width: 760 }
            }).setOrigin(0.5);

            var prompt = this.add.text(GAME_CONFIG.width / 2, 486, 'Toque para iniciar', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '26px',
                color: '#fff6db'
            }).setOrigin(0.5);
        } else {
            this.createOption(300, '1. Jogador vs Jogador', MODES.PVP);
            this.createOption(390, '2. Jogador vs CPU', MODES.CPU);

            var prompt = this.add.text(GAME_CONFIG.width / 2, 480, 'Pressione 1 ou 2', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '26px',
                color: '#fff6db'
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

    createOption(y, label, mode, fontSize = 30, padding = { left: 26, right: 26, top: 16, bottom: 16 }) {
        const option = this.add.text(GAME_CONFIG.width / 2, y, label, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: `${fontSize}px`,
            color: '#23120d',
            backgroundColor: '#f6d37a',
            padding
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        option.on('pointerover', () => {
            option.setStyle({ backgroundColor: '#fff0b3' });
        });

        option.on('pointerout', () => {
            option.setStyle({ backgroundColor: '#f6d37a' });
        });

        option.on('pointerdown', () => {
            this.startMatch(mode);
        });
    }

    createControlsPanel() {
        if (this.isMobile) {
            this.add.rectangle(GAME_CONFIG.width / 2, 628, 860, 104, 0x1f1a1a, 0.78)
                .setStrokeStyle(2, 0xf3d27d);

            this.add.text(GAME_CONFIG.width / 2, 603, 'Paisagem recomendada\nEsquerda, direita, pulo, soco e chute ficam na tela.', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '23px',
                color: '#fff6db',
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5);

            return;
        }

        const controls = [
            'P1  A/D mover   W pular   F leve   G forte',
            'P2  <-/-> mover   ^ pular   K leve   L forte'
        ];

        this.add.rectangle(GAME_CONFIG.width / 2, 628, 820, 108, 0x1f1a1a, 0.78)
            .setStrokeStyle(2, 0xf3d27d);

        this.add.text(GAME_CONFIG.width / 2, 604, controls.join('\n'), {
            fontFamily: 'Courier New, monospace',
            fontSize: '21px',
            color: '#fff6db',
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
