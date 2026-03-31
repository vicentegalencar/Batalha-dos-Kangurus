import { GAME_CONFIG, MODES } from '../utils/gameConfig.js';
import {
    DEFAULT_FIGHTER_TEXTURE_KEY,
    GRAY_FIGHTER_TEXTURE_KEY,
    getAnimationSet
} from '../utils/fighterAnimations.js';
import { ensureBackgroundMusic } from '../utils/audio.js';
import { isMobileLike } from '../utils/device.js';

export class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
        this.selectedIndex = 0;
        this.menuItems = [];
    }

    create() {
        ensureBackgroundMusic(this);

        this.isMobile = isMobileLike(this);
        this.options = this.isMobile
            ? [
                {
                    title: 'JOGAR NO CELULAR',
                    subtitle: 'Partida r\u00E1pida contra a CPU',
                    mode: MODES.CPU
                }
            ]
            : [
                {
                    title: 'JOGADOR VS CPU',
                    subtitle: 'Treino r\u00E1pido contra a IA',
                    mode: MODES.CPU
                },
                {
                    title: 'JOGADOR VS JOGADOR',
                    subtitle: 'Duelo local no mesmo teclado',
                    mode: MODES.PVP
                }
            ];

        this.createBackground();
        this.createShowcaseFighters();
        this.createTitle();
        this.createMenuList();
        this.createFooter();
        this.createInput();
        this.refreshSelection();
    }

    createBackground() {
        const { width, height } = GAME_CONFIG;

        if (this.textures.exists('arena-map')) {
            this.add.image(width / 2, height / 2, 'arena-map')
                .setDisplaySize(width, height)
                .setDepth(-30);
        }

        const sunset = this.add.graphics().setDepth(-25);
        sunset.fillGradientStyle(0x435d9f, 0x5f6fb0, 0xff9964, 0xffc36f, 1);
        sunset.fillRect(0, 0, width, height);

        this.add.rectangle(width / 2, height / 2, width, height, 0x3a2130, 0.18).setDepth(-24);
        this.add.circle(width / 2, 212, 150, 0xffd481, 0.34).setDepth(-23);
        this.add.rectangle(width / 2, height - 112, width + 40, 220, 0x43281d, 0.5).setDepth(-22);

        const horizon = this.add.graphics().setDepth(-21);
        horizon.fillStyle(0x89553f, 0.95);
        horizon.fillEllipse(width / 2, 410, 940, 150);
        horizon.fillStyle(0x5b3427, 0.9);
        horizon.fillEllipse(width / 2, 472, width + 140, 220);
    }

    createShowcaseFighters() {
        const leftAnimations = getAnimationSet('gray');
        const rightAnimations = getAnimationSet('red');

        this.leftShadow = this.add.ellipse(248, 563, 168, 26, 0x000000, 0.25).setDepth(4);
        this.rightShadow = this.add.ellipse(1038, 563, 168, 26, 0x000000, 0.25).setDepth(4);

        this.leftFighter = this.add.sprite(252, 538, GRAY_FIGHTER_TEXTURE_KEY)
            .setScale(1.55)
            .setDepth(6);
        this.leftFighter.play(leftAnimations.idle);

        this.rightFighter = this.add.sprite(1032, 538, DEFAULT_FIGHTER_TEXTURE_KEY)
            .setScale(1.55)
            .setFlipX(true)
            .setDepth(6);
        this.rightFighter.play(rightAnimations.idle);

        this.tweens.add({
            targets: [this.leftFighter, this.rightFighter],
            y: '-=6',
            duration: 1100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });

        this.tweens.add({
            targets: [this.leftShadow, this.rightShadow],
            scaleX: 0.9,
            scaleY: 0.84,
            alpha: 0.18,
            duration: 1100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    createTitle() {
        const centerX = GAME_CONFIG.width / 2;

        this.add.text(centerX, 84, 'BATALHA DOS', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '46px',
            fontStyle: 'bold',
            color: '#ffd54c',
            stroke: '#1a0f0d',
            strokeThickness: 10
        }).setOrigin(0.5).setDepth(20).setShadow(0, 5, '#9f421b', 0, false, true);

        this.add.text(centerX, 144, 'CANGURUS', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '66px',
            fontStyle: 'bold',
            color: '#ffb623',
            stroke: '#170d0b',
            strokeThickness: 12
        }).setOrigin(0.5).setDepth(20).setShadow(0, 6, '#9f421b', 0, false, true);

        this.add.text(centerX, 196, 'Luta arcade no deserto australiano', {
            fontFamily: '"Palatino Linotype", Georgia, serif',
            fontSize: '20px',
            color: '#fff2d0'
        }).setOrigin(0.5).setDepth(20);
    }

    createMenuList() {
        const startY = this.isMobile ? 316 : 304;
        const spacing = 72;
        const centerX = GAME_CONFIG.width / 2;

        this.cursor = this.add.text(centerX - 202, startY, '\u25B6', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '34px',
            color: '#fff4d4',
            stroke: '#1a0f0d',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(30);

        this.options.forEach((option, index) => {
            const y = startY + (index * spacing);
            const title = this.add.text(centerX, y - 8, option.title, {
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: this.isMobile ? '34px' : '38px',
                color: '#fff7ea',
                stroke: '#140d0c',
                strokeThickness: 7
            }).setOrigin(0.5).setDepth(30).setInteractive({ useHandCursor: true });

            const subtitle = this.add.text(centerX, y + 25, option.subtitle, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                color: '#eed7ae'
            }).setOrigin(0.5).setDepth(30);

            title.on('pointerover', () => {
                this.selectedIndex = index;
                this.refreshSelection();
            });

            title.on('pointerdown', () => {
                this.startMatch(option.mode);
            });

            this.menuItems.push({ title, subtitle, y, mode: option.mode });
        });

        this.tweens.add({
            targets: this.cursor,
            x: '-=8',
            duration: 420,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    createFooter() {
        const footerText = this.isMobile
            ? 'Toque na op\u00E7\u00E3o para come\u00E7ar'
            : 'Setas ou mouse para navegar. Enter, 1 ou 2 para selecionar.';
        const controlsText = this.isMobile
            ? 'Paisagem recomendada. Os nomes dos cangurus s\u00E3o definidos antes da luta.'
            : 'P1: A/D/W/G/H   P2: Setas/Up/L/;   Nomes definidos antes da luta.';

        this.add.text(GAME_CONFIG.width / 2, 632, footerText, {
            fontFamily: '"Palatino Linotype", Georgia, serif',
            fontSize: '22px',
            color: '#fff0d2'
        }).setOrigin(0.5).setDepth(30);

        this.add.text(GAME_CONFIG.width / 2, 670, controlsText, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#f0ddbb',
            align: 'center'
        }).setOrigin(0.5).setDepth(30);
    }

    createInput() {
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO
        });
    }

    refreshSelection() {
        this.menuItems.forEach((item, index) => {
            const isSelected = index === this.selectedIndex;

            item.title.setScale(isSelected ? 1.06 : 1);
            item.title.setTint(isSelected ? 0xffd25a : 0xffffff);
            item.subtitle.setTint(isSelected ? 0xfff0d0 : 0xffffff);
        });

        if (this.menuItems[this.selectedIndex]) {
            this.cursor.y = this.menuItems[this.selectedIndex].y - 8;
        }
    }

    moveSelection(direction) {
        const itemCount = this.menuItems.length;
        this.selectedIndex = Phaser.Math.Wrap(this.selectedIndex + direction, 0, itemCount);
        this.refreshSelection();
    }

    startSelected() {
        const selected = this.menuItems[this.selectedIndex];
        if (!selected) {
            return;
        }

        this.startMatch(selected.mode);
    }

    startMatch(mode) {
        if (this.isMobile) {
            this.tryEnterFullscreen();
        }

        this.scene.start('FightScene', {
            mode,
            fighterNames: this.collectFighterNames(mode)
        });
    }

    collectFighterNames(mode) {
        const leftDefault = mode === MODES.CPU ? 'Desafiante' : 'Jogador 1';
        const rightDefault = mode === MODES.CPU ? 'Canguru Cinza' : 'Jogador 2';

        return {
            left: this.promptForName('Nome do canguru da esquerda:', leftDefault),
            right: this.promptForName('Nome do canguru da direita:', rightDefault)
        };
    }

    promptForName(message, fallback) {
        if (typeof window === 'undefined' || typeof window.prompt !== 'function') {
            return fallback;
        }

        const value = window.prompt(message, fallback);
        const normalized = (value || '').trim();

        if (!normalized) {
            return fallback;
        }

        return normalized.slice(0, 18);
    }

    tryEnterFullscreen() {
        const target = document.getElementById('game-container') || document.documentElement;
        const requestFullscreen = target.requestFullscreen
            || target.webkitRequestFullscreen
            || target.msRequestFullscreen;

        if (!requestFullscreen || document.fullscreenElement) {
            return;
        }

        try {
            requestFullscreen.call(target);
        } catch {
            // Best-effort only.
        }
    }

    update() {
        if (!this.isMobile) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
                this.startMatch(MODES.PVP);
                return;
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.two)) {
                this.startMatch(MODES.CPU);
                return;
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
                this.moveSelection(-1);
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.down)) {
                this.moveSelection(1);
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                this.startSelected();
            }

            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.startSelected();
        }
    }

}
