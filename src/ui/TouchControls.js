import { GAME_CONFIG, MOBILE_UI } from '../utils/gameConfig.js';

const BUTTON_STYLE = {
    fill: 0x231c1c,
    fillDown: 0x5a3425,
    stroke: 0xf3d27d,
    text: '#fff6db'
};

export class TouchControls {

    constructor(scene) {
        this.scene = scene;
        this.buttonStates = new Map();
        this.inputEnabled = true;

        this.createMovementButtons();
        this.createActionButtons();
        this.createSystemButtons();
        this.createOrientationOverlay();

        this.scene.input.on('pointerup', (pointer) => {
            this.releasePointer(pointer.id);
        });

        this.scene.input.on('pointerupoutside', (pointer) => {
            this.releasePointer(pointer.id);
        });
    }

    createMovementButtons() {
        this.createCircleButton('left', MOBILE_UI.leftPadX, MOBILE_UI.leftPadY, 62, '<');
        this.createCircleButton('right', MOBILE_UI.leftPadX + 130, MOBILE_UI.leftPadY, 62, '>');
        this.createCircleButton('jump', MOBILE_UI.jumpX, MOBILE_UI.jumpY, 52, 'PULO');
    }

    createActionButtons() {
        this.createCircleButton('heavy', MOBILE_UI.attackHeavyX, MOBILE_UI.attackHeavyY, 58, 'SOCO');
        this.createCircleButton('kick', MOBILE_UI.attackKickX, MOBILE_UI.attackKickY, 58, 'CHUTE');
    }

    createSystemButtons() {
        this.createRectButton('menu', MOBILE_UI.menuX, MOBILE_UI.menuY, 128, 52, 'MENU');
        this.restartButton = this.createRectButton('restart', MOBILE_UI.restartX, MOBILE_UI.restartY, 164, 52, 'REINICIAR');
        this.restartButton.container.setVisible(false);
    }

    createOrientationOverlay() {
        this.orientationOverlay = this.scene.add.container(0, 0).setDepth(300).setVisible(false);

        const backdrop = this.scene.add.rectangle(
            GAME_CONFIG.width / 2,
            GAME_CONFIG.height / 2,
            GAME_CONFIG.width,
            GAME_CONFIG.height,
            0x000000,
            0.72
        );

        const title = this.scene.add.text(GAME_CONFIG.width / 2, 300, 'Gire o celular', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '44px',
            color: '#fff6db'
        }).setOrigin(0.5);

        const body = this.scene.add.text(GAME_CONFIG.width / 2, 366, 'Use o modo paisagem para jogar melhor.', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#fff6db'
        }).setOrigin(0.5);

        this.orientationOverlay.add([backdrop, title, body]);
    }

    createCircleButton(id, x, y, radius, label) {
        const background = this.scene.add.circle(x, y, radius, BUTTON_STYLE.fill, 0.68)
            .setStrokeStyle(4, BUTTON_STYLE.stroke)
            .setDepth(210)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        const text = this.scene.add.text(x, y, label, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: label.length <= 2 ? '38px' : '18px',
            color: BUTTON_STYLE.text,
            align: 'center'
        }).setOrigin(0.5).setDepth(211).setScrollFactor(0);

        return this.registerButton(id, { background, text, container: this.scene.add.container(0, 0, [background, text]) });
    }

    createRectButton(id, x, y, width, height, label) {
        const background = this.scene.add.rectangle(x, y, width, height, BUTTON_STYLE.fill, 0.72)
            .setStrokeStyle(3, BUTTON_STYLE.stroke)
            .setDepth(210)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        const text = this.scene.add.text(x, y, label, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '22px',
            color: BUTTON_STYLE.text
        }).setOrigin(0.5).setDepth(211).setScrollFactor(0);

        return this.registerButton(id, { background, text, container: this.scene.add.container(0, 0, [background, text]) });
    }

    registerButton(id, ui) {
        const state = {
            id,
            justPressed: false,
            isDown: false,
            pointerId: null,
            ui
        };

        const press = (pointer) => {
            if (!this.inputEnabled) {
                return;
            }

            state.pointerId = pointer.id;
            state.justPressed = true;
            state.isDown = true;
            state.ui.background.setFillStyle(BUTTON_STYLE.fillDown, 0.9);
        };

        const release = () => {
            state.pointerId = null;
            state.isDown = false;
            state.ui.background.setFillStyle(BUTTON_STYLE.fill, 0.68);
        };

        state.release = release;
        state.ui.background.on('pointerdown', press);
        state.ui.background.on('pointerout', (pointer) => {
            if (state.pointerId === pointer.id) {
                release();
            }
        });

        this.buttonStates.set(id, state);
        return ui;
    }

    releasePointer(pointerId) {
        this.buttonStates.forEach((state) => {
            if (state.pointerId === pointerId) {
                state.release();
            }
        });
    }

    setPortraitMode(isPortrait) {
        this.inputEnabled = !isPortrait;
        this.orientationOverlay.setVisible(isPortrait);

        if (isPortrait) {
            this.buttonStates.forEach((state) => {
                state.release();
                state.justPressed = false;
            });
        }
    }

    setRestartVisible(visible) {
        this.restartButton.container.setVisible(visible);
        this.restartButton.background.setVisible(visible);
        this.restartButton.text.setVisible(visible);
    }

    getInput() {
        return {
            left: this.consumeHeld('left'),
            right: this.consumeHeld('right'),
            jump: this.consumePress('jump'),
            heavy: this.consumePress('heavy'),
            kick: this.consumePress('kick')
        };
    }

    consumeMenu() {
        return this.consumePress('menu');
    }

    consumeRestart() {
        return this.consumePress('restart');
    }

    consumeHeld(id) {
        return this.buttonStates.get(id)?.isDown || false;
    }

    consumePress(id) {
        const state = this.buttonStates.get(id);
        if (!state || !state.justPressed) {
            return false;
        }

        state.justPressed = false;
        return true;
    }

    destroy() {
        this.buttonStates.forEach((state) => {
            state.ui.background.destroy();
            state.ui.text.destroy();
            state.ui.container.destroy();
        });

        this.orientationOverlay.destroy();
        this.buttonStates.clear();
    }

}
