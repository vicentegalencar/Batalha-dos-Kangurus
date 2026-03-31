import { ensureBackgroundMusic } from '../utils/audio.js';
import { GAME_CONFIG } from '../utils/gameConfig.js';

export class IntroScene extends Phaser.Scene {

    constructor() {
        super('IntroScene');
        this.finished = false;
    }

    create() {
        ensureBackgroundMusic(this);
        this.createBackground();
        this.createMessage();
        this.scheduleExit();
        this.registerSkip();
    }

    createBackground() {
        const { width, height } = GAME_CONFIG;

        if (this.textures.exists('arena-map')) {
            this.add.image(width / 2, height / 2, 'arena-map')
                .setDisplaySize(width, height)
                .setDepth(-10);
        }

        this.add.rectangle(width / 2, height / 2, width, height, 0x08141f, 0.78).setDepth(-5);
        this.add.circle(width / 2, height / 2 - 36, 170, 0xf0b35d, 0.14);
        this.add.rectangle(width / 2, height / 2, width - 180, 270, 0x112131, 0.58)
            .setStrokeStyle(2, 0xf4d8a2, 0.85);
    }

    createMessage() {
        const centerX = GAME_CONFIG.width / 2;

        this.messageText = this.add.text(centerX, 296, 'Feliz anivers\u00E1rio, Manoel!', {
            fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif',
            fontSize: '68px',
            fontStyle: 'italic',
            color: '#fff4da',
            stroke: '#6b3f1c',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        this.messageText.setShadow(0, 8, '#000000', 18, true, true);

        this.subtitleText = this.add.text(centerX, 398, 'Uma abertura especial antes da luta.', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#f3d9b4',
            letterSpacing: 2
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: [this.messageText, this.subtitleText],
            alpha: 1,
            y: '-=10',
            ease: 'Sine.Out',
            duration: 700
        });
    }

    scheduleExit() {
        this.time.delayedCall(2200, () => {
            if (this.finished) {
                return;
            }

            this.tweens.add({
                targets: [this.messageText, this.subtitleText],
                alpha: 0,
                y: '-=10',
                ease: 'Sine.In',
                duration: 550
            });
        });

        this.time.delayedCall(3000, () => {
            this.goToMenu();
        });
    }

    registerSkip() {
        this.input.once('pointerdown', () => {
            this.goToMenu();
        });

        if (this.input.keyboard) {
            this.input.keyboard.once('keydown', () => {
                this.goToMenu();
            });
        }
    }

    goToMenu() {
        if (this.finished) {
            return;
        }

        this.finished = true;
        this.scene.start('MenuScene');
    }

}
