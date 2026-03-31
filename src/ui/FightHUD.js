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
        this.modeLabel = modeLabel;
    }

    createBars() {
        this.edge = this.isMobile ? 84 : 126;
        this.barY = this.isMobile ? 70 : 76;
        const height = this.isMobile ? 18 : 22;
        const shinePadding = 6;

        this.scene.add.rectangle(this.edge + (this.barWidth / 2), this.barY, this.barWidth + 16, height + 14, 0x100d0c, 0.76)
            .setStrokeStyle(2, 0xdab77d, 0.95)
            .setDepth(105);

        this.scene.add.rectangle(GAME_CONFIG.width - this.edge - (this.barWidth / 2), this.barY, this.barWidth + 16, height + 14, 0x100d0c, 0.76)
            .setStrokeStyle(2, 0xdab77d, 0.95)
            .setDepth(105);

        this.scene.add.rectangle(this.edge, this.barY, this.barWidth, height, 0x3b312d, 1)
            .setOrigin(0, 0.5)
            .setDepth(106);

        this.scene.add.rectangle(GAME_CONFIG.width - this.edge, this.barY, this.barWidth, height, 0x3b312d, 1)
            .setOrigin(1, 0.5)
            .setDepth(106);

        this.leftBar = this.scene.add.rectangle(this.edge, this.barY, this.barWidth, height, 0xf07b58, 1)
            .setOrigin(0, 0.5)
            .setDepth(107);

        this.rightBar = this.scene.add.rectangle(GAME_CONFIG.width - this.edge, this.barY, this.barWidth, height, 0xb7bcc4, 1)
            .setOrigin(1, 0.5)
            .setDepth(107);

        this.scene.add.rectangle(this.edge + shinePadding, this.barY - 4, this.barWidth - 12, 3, 0xffffff, 0.12)
            .setOrigin(0, 0.5)
            .setDepth(108);

        this.scene.add.rectangle(GAME_CONFIG.width - this.edge - shinePadding, this.barY - 4, this.barWidth - 12, 3, 0xffffff, 0.12)
            .setOrigin(1, 0.5)
            .setDepth(108);
    }

    createTexts() {
        const nameY = this.isMobile ? 36 : 38;
        const valueY = this.isMobile ? 91 : 98;
        const playerFont = this.isMobile ? '22px' : '28px';
        const valueFont = this.isMobile ? '15px' : '17px';
        const resultFont = this.isMobile ? '30px' : '40px';
        const helpFont = this.isMobile ? '16px' : '18px';
        const helpText = this.isMobile
            ? 'Toque em SOCO e CHUTE   MENU no topo'
            : 'P1 G/H   P2 L/;   ESC menu   R reiniciar';

        this.scene.add.text(this.edge, nameY, this.leftFighter.label, {
            fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif',
            fontSize: playerFont,
            fontStyle: 'bold',
            color: '#fff1d7',
            stroke: '#3a2116',
            strokeThickness: 4
        }).setOrigin(0, 0.5).setDepth(110).setShadow(0, 4, '#000000', 10, true, true);

        this.scene.add.text(GAME_CONFIG.width - this.edge, nameY, this.rightFighter.label, {
            fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif',
            fontSize: playerFont,
            fontStyle: 'bold',
            color: '#f0f1f3',
            stroke: '#2a2d31',
            strokeThickness: 4
        }).setOrigin(1, 0.5).setDepth(110).setShadow(0, 4, '#000000', 10, true, true);

        this.leftHealthText = this.scene.add.text(this.edge + this.barWidth, valueY, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: valueFont,
            color: '#e8ded4'
        }).setOrigin(1, 0.5).setDepth(110);

        this.rightHealthText = this.scene.add.text(GAME_CONFIG.width - this.edge - this.barWidth, valueY, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: valueFont,
            color: '#e8eaed'
        }).setOrigin(0, 0.5).setDepth(110);

        this.resultPanel = this.scene.add.rectangle(
            GAME_CONFIG.width / 2,
            194,
            this.isMobile ? 360 : 460,
            this.isMobile ? 112 : 126,
            0x171311,
            0.9
        ).setStrokeStyle(2, 0xe6c78d, 0.95).setDepth(119).setVisible(false);

        this.resultText = this.scene.add.text(GAME_CONFIG.width / 2, 190, '', {
            fontFamily: '"Palatino Linotype", Georgia, serif',
            fontSize: resultFont,
            color: '#fff3db',
            stroke: '#3b2218',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5).setDepth(120).setVisible(false);

        this.helpText = this.scene.add.text(GAME_CONFIG.width / 2, this.isMobile ? 98 : 688, helpText, {
            fontFamily: 'Arial, sans-serif',
            fontSize: helpFont,
            color: '#edf3f8'
        }).setOrigin(0.5).setDepth(120).setShadow(0, 2, '#000000', 8, true, true);
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
