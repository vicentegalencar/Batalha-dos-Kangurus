import { GAME_CONFIG } from '../utils/gameConfig.js';

const BAR_WIDTH = 360;
const MOBILE_BAR_WIDTH = 250;

export class FightHUD {

    constructor(scene, { leftFighter, rightFighter, modeLabel, isMobile }) {
        this.scene = scene;
        this.leftFighter = leftFighter;
        this.rightFighter = rightFighter;
        this.isMobile = isMobile;
        this.barWidth = isMobile ? MOBILE_BAR_WIDTH : BAR_WIDTH;

        this.createFrame(modeLabel);
        this.createBars();
        this.createTexts();
    }

    createFrame(modeLabel) {
        const width = GAME_CONFIG.width;
        const frameHeight = this.isMobile ? 74 : 84;
        const labelFontSize = this.isMobile ? '16px' : '18px';

        this.scene.add.rectangle(width / 2, this.isMobile ? 50 : 56, width - 80, frameHeight, 0x1a1717, 0.62)
            .setStrokeStyle(2, 0xf2d38d)
            .setDepth(100);

        this.scene.add.text(width / 2, this.isMobile ? 18 : 24, modeLabel, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: labelFontSize,
            color: '#ffe7b0'
        }).setOrigin(0.5, 0).setDepth(110);
    }

    createBars() {
        const edge = this.isMobile ? 76 : 120;
        const y = this.isMobile ? 58 : 62;
        const height = this.isMobile ? 22 : 28;

        this.scene.add.rectangle(edge, y, this.barWidth, height, 0x463532, 1)
            .setOrigin(0, 0.5)
            .setDepth(105);

        this.scene.add.rectangle(GAME_CONFIG.width - edge, y, this.barWidth, height, 0x463532, 1)
            .setOrigin(1, 0.5)
            .setDepth(105);

        this.leftBar = this.scene.add.rectangle(edge, y, this.barWidth, height, 0xf46d49, 1)
            .setOrigin(0, 0.5)
            .setDepth(106);

        this.rightBar = this.scene.add.rectangle(GAME_CONFIG.width - edge, y, this.barWidth, height, 0x4db7f0, 1)
            .setOrigin(1, 0.5)
            .setDepth(106);
    }

    createTexts() {
        const edge = this.isMobile ? 76 : 120;
        const topY = this.isMobile ? 28 : 28;
        const playerFont = this.isMobile ? '16px' : '20px';
        const resultFont = this.isMobile ? '34px' : '42px';
        const helpFont = this.isMobile ? '16px' : '18px';
        const helpText = this.isMobile
            ? 'Toque nos botoes da tela   MENU no topo'
            : 'ESC menu   R reiniciar apos o KO';

        this.scene.add.text(edge, topY, this.leftFighter.label, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: playerFont,
            color: '#fff6db'
        }).setOrigin(0, 0.5).setDepth(110);

        this.scene.add.text(GAME_CONFIG.width - edge, topY, this.rightFighter.label, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: playerFont,
            color: '#fff6db'
        }).setOrigin(1, 0.5).setDepth(110);

        this.resultText = this.scene.add.text(GAME_CONFIG.width / 2, 190, '', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: resultFont,
            color: '#fff6db',
            stroke: '#4b1f18',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(120).setVisible(false);

        this.helpText = this.scene.add.text(GAME_CONFIG.width / 2, this.isMobile ? 92 : 690, helpText, {
            fontFamily: 'Arial, sans-serif',
            fontSize: helpFont,
            color: '#fff6db'
        }).setOrigin(0.5).setDepth(120);
    }

    update() {
        const leftRatio = Phaser.Math.Clamp(this.leftFighter.health / this.leftFighter.maxHealth, 0, 1);
        const rightRatio = Phaser.Math.Clamp(this.rightFighter.health / this.rightFighter.maxHealth, 0, 1);

        this.leftBar.width = this.barWidth * leftRatio;
        this.rightBar.width = this.barWidth * rightRatio;
    }

    showWinner(message) {
        const suffix = this.isMobile ? 'Toque em REINICIAR' : 'R para revanche';
        this.resultText.setText(`${message}\n${suffix}`);
        this.resultText.setVisible(true);
    }

}
