import { GAME_CONFIG } from '../utils/gameConfig.js';

const BAR_WIDTH = 340;
const MOBILE_BAR_WIDTH = 232;

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
        const panelY = this.isMobile ? 54 : 58;
        const panelHeight = this.isMobile ? 88 : 96;

        this.scene.add.rectangle(width / 2, panelY + 4, width - 88, panelHeight, 0x000000, 0.18)
            .setDepth(98);
        this.scene.add.rectangle(width / 2, panelY, width - 92, panelHeight, 0x0f1d2a, 0.84)
            .setStrokeStyle(2, 0xf1d39d, 0.95)
            .setDepth(100);

        this.scene.add.text(width / 2, this.isMobile ? 27 : 26, modeLabel, {
            fontFamily: '"Palatino Linotype", Georgia, serif',
            fontSize: this.isMobile ? '18px' : '20px',
            color: '#fff0cf'
        }).setOrigin(0.5, 0.5).setDepth(110);
    }

    createBars() {
        const edge = this.isMobile ? 84 : 126;
        const y = this.isMobile ? 63 : 67;
        const height = this.isMobile ? 20 : 24;
        const framePadding = 6;

        this.scene.add.rectangle(edge + (this.barWidth / 2), y, this.barWidth + 16, height + 14, 0x0a141f, 0.88)
            .setStrokeStyle(2, 0xd8ba83, 0.95)
            .setDepth(105);

        this.scene.add.rectangle(GAME_CONFIG.width - edge - (this.barWidth / 2), y, this.barWidth + 16, height + 14, 0x0a141f, 0.88)
            .setStrokeStyle(2, 0xd8ba83, 0.95)
            .setDepth(105);

        this.scene.add.rectangle(edge, y, this.barWidth, height, 0x3b4955, 1)
            .setOrigin(0, 0.5)
            .setDepth(106);

        this.scene.add.rectangle(GAME_CONFIG.width - edge, y, this.barWidth, height, 0x3b4955, 1)
            .setOrigin(1, 0.5)
            .setDepth(106);

        this.leftBar = this.scene.add.rectangle(edge, y, this.barWidth, height, 0xf07b58, 1)
            .setOrigin(0, 0.5)
            .setDepth(107);

        this.rightBar = this.scene.add.rectangle(GAME_CONFIG.width - edge, y, this.barWidth, height, 0x57b6eb, 1)
            .setOrigin(1, 0.5)
            .setDepth(107);

        this.scene.add.rectangle(edge + framePadding, y - 5, this.barWidth - 12, 4, 0xffffff, 0.14)
            .setOrigin(0, 0.5)
            .setDepth(108);

        this.scene.add.rectangle(GAME_CONFIG.width - edge - framePadding, y - 5, this.barWidth - 12, 4, 0xffffff, 0.14)
            .setOrigin(1, 0.5)
            .setDepth(108);
    }

    createTexts() {
        const edge = this.isMobile ? 84 : 126;
        const topY = this.isMobile ? 38 : 40;
        const playerFont = this.isMobile ? '15px' : '18px';
        const resultFont = this.isMobile ? '30px' : '40px';
        const helpFont = this.isMobile ? '16px' : '18px';
        const helpText = this.isMobile
            ? 'Toque em SOCO e CHUTE   MENU no topo'
            : 'P1 G/H   P2 L/;   ESC menu   R reiniciar';

        this.scene.add.text(edge, topY, this.leftFighter.label, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: playerFont,
            color: '#fff1d7'
        }).setOrigin(0, 0.5).setDepth(110);

        this.scene.add.text(GAME_CONFIG.width - edge, topY, this.rightFighter.label, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: playerFont,
            color: '#fff1d7'
        }).setOrigin(1, 0.5).setDepth(110);

        this.leftHealthText = this.scene.add.text(edge + this.barWidth, topY, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.isMobile ? '15px' : '17px',
            color: '#dbe7f2'
        }).setOrigin(1, 0.5).setDepth(110);

        this.rightHealthText = this.scene.add.text(GAME_CONFIG.width - edge - this.barWidth, topY, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.isMobile ? '15px' : '17px',
            color: '#dbe7f2'
        }).setOrigin(0, 0.5).setDepth(110);

        this.resultPanel = this.scene.add.rectangle(
            GAME_CONFIG.width / 2,
            194,
            this.isMobile ? 360 : 460,
            this.isMobile ? 112 : 126,
            0x0f1d2a,
            0.88
        ).setStrokeStyle(2, 0xf1d39d, 0.95).setDepth(119).setVisible(false);

        this.resultText = this.scene.add.text(GAME_CONFIG.width / 2, 190, '', {
            fontFamily: '"Palatino Linotype", Georgia, serif',
            fontSize: resultFont,
            color: '#fff3db',
            stroke: '#3b2218',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5).setDepth(120).setVisible(false);

        this.helpTextBg = this.scene.add.rectangle(
            GAME_CONFIG.width / 2,
            this.isMobile ? 98 : 688,
            this.isMobile ? 470 : 540,
            34,
            0x0f1d2a,
            0.82
        ).setStrokeStyle(1, 0xe6c98e, 0.8).setDepth(119);

        this.helpText = this.scene.add.text(GAME_CONFIG.width / 2, this.isMobile ? 98 : 688, helpText, {
            fontFamily: 'Arial, sans-serif',
            fontSize: helpFont,
            color: '#edf3f8'
        }).setOrigin(0.5).setDepth(120);
    }

    update() {
        const leftRatio = Phaser.Math.Clamp(this.leftFighter.health / this.leftFighter.maxHealth, 0, 1);
        const rightRatio = Phaser.Math.Clamp(this.rightFighter.health / this.rightFighter.maxHealth, 0, 1);

        this.leftBar.width = this.barWidth * leftRatio;
        this.rightBar.width = this.barWidth * rightRatio;
        this.leftHealthText.setText(`${this.leftFighter.health}/${this.leftFighter.maxHealth}`);
        this.rightHealthText.setText(`${this.rightFighter.health}/${this.rightFighter.maxHealth}`);
    }

    showWinner(message) {
        const suffix = this.isMobile ? 'Toque em REINICIAR' : 'R para revanche';
        this.resultText.setText(`${message}\n${suffix}`);
        this.resultPanel.setVisible(true);
        this.resultText.setVisible(true);
    }

}
